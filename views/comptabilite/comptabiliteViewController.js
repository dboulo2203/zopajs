import { getPageTitleDisplay } from '../../shared/bootstrapServices/components.js';
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js';
import { fetchUsers, getPaymentsByMode, getPaymentsByAccountCode, getInvoicesWithPayments } from './comptabiliteService.js';

// Controller pour annuler les requêtes précédentes
let currentController = null;

// Cache des utilisateurs pour l'affichage
let usersCache = {};

// Template HTML pour le contenu principal
const comptabiliteContentString = `
    <div class="" style="padding-top:60px; margin-bottom:20px">
    ${getPageTitleDisplay("Comptabilité", "bi-calculator")}
    </div>

    <!-- Filtres de dates -->
    <div class="col-6">
        <div class="row" style="margin-bottom:-10px">
            <label for="dateDebut" class="form-label">Date début</label>
            <div class="col">
                <input type="date" class="form-control" name="dateDebut" id="dateDebut">
            </div>
        </div>
        <div class="row" style="padding-top:20px; margin-bottom:-10px">
            <label for="dateFin" class="form-label">Date fin</label>
            <div class="col-12">
                <input type="date" class="form-control" name="dateFin" id="dateFin">
            </div>
        </div>
        <div class="row" style="padding-top:20px; margin-bottom:-10px">
            <label for="userSelect" class="form-label">Utilisateur</label>
            <div class="col-12">
                <select class="form-select" id="userSelect">
                    <option value="0" selected>Chargement...</option>
                </select>
            </div>
        </div>
        <div class="row" style="padding-top:20px; padding-bottom:20px">
            <div class="col">
                <button type="button" class="btn btn-secondary" id="searchBtn">Calculer</button>
            </div>
        </div>
    </div>

    <!-- Message d'erreur -->
    <div id="errorMessage" class="alert alert-danger hidden"></div>

    <!-- Indicateur de chargement -->
    <div class="hidden d-flex align-items-center gap-2 my-3" id="loadingIndicator">
        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
        <span>Chargement des données...</span>
    </div>

    <!-- Conteneur des résultats -->
    <div id="tableContainer"></div>
`;

// Point d'entrée principal
export async function startComptabiliteController() {
    await launchInitialisation();
    headerViewDisplay("#menuSection");
    displayComptabiliteContent("mainActiveSection");
}

// Afficher le contenu principal
function displayComptabiliteContent(htmlPartId) {
    document.querySelector("#" + htmlPartId).innerHTML = comptabiliteContentString;

    // Initialiser les dates par défaut à la date du jour
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateDebut').value = today;
    document.getElementById('dateFin').value = today;

    // Initialiser les événements
    initEventListeners();

    // Initialiser le sélecteur d'utilisateurs
    initUserSelector();
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', loadData);

    document.getElementById('dateDebut').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadData();
    });
    document.getElementById('dateFin').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadData();
    });
}

// Initialiser le sélecteur d'utilisateurs
async function initUserSelector() {
    const users = await fetchUsers();
    usersCache = users;
    const select = document.getElementById('userSelect');

    select.innerHTML = '<option value="0" selected>Tous les utilisateurs</option>';

    // Trier les utilisateurs par ordre alphabétique
    const sortedUsers = Object.entries(users).sort((a, b) => a[1].localeCompare(b[1], 'fr'));

    sortedUsers.forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        select.appendChild(option);
    });
}

// Afficher/masquer l'indicateur de chargement
function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    const searchBtn = document.getElementById('searchBtn');
    if (show) {
        loader.classList.remove('hidden');
        searchBtn.style.pointerEvents = 'none';
        searchBtn.style.opacity = '0.5';
    } else {
        loader.classList.add('hidden');
        searchBtn.style.pointerEvents = 'auto';
        searchBtn.style.opacity = '1';
    }
}

// Formater un montant en euros
function formatMontant(value) {
    const num = parseFloat(value) || 0;
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// Formater une date
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Générer une couleur basée sur l'ID utilisateur
function getUserColor(userId) {
    const colors = ['#198754', '#0d6efd', '#dc3545', '#fd7e14', '#6f42c1', '#20c997', '#0dcaf0'];
    const index = parseInt(userId) % colors.length;
    return colors[index];
}

// Rendre le tableau des paiements par mode
function renderPaymentsByModeTable(data) {
    if (!data || data.length === 0) {
        return '<p class="text-muted">Aucune donnée disponible</p>';
    }

    let total = 0;
    let rows = '';

    data.forEach(item => {
        const montant = parseFloat(item.total) || 0;
        total += montant;
        rows += `<tr>
            <td>${item.libelle || 'Non défini'}</td>
            <td class="text-end">${formatMontant(montant)}</td>
        </tr>`;
    });

    return `
        <div class="mb-2">Total mouvements par mode de paiement</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm">
                <thead class="table-secondary">
                    <tr>
                        <th>Mode</th>
                        <th class="text-end">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                    <tr>
                        <td style="font-weight: bold;">Total</td>
                        <td class="text-end" style="font-weight: bold;">${formatMontant(total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Convertir ftype en libellé
function getFtypeLabel(ftype) {
    const types = {
        '0': 'Standard',
        '3': 'Acompte'
    };
    return types[ftype] || 'Standard';
}

// Rendre le tableau des paiements par code comptable
function renderPaymentsByAccountCodeTable(data) {
    if (!data || data.length === 0) {
        return '<p class="text-muted">Aucune donnée disponible</p>';
    }

    let total = 0;
    let rows = '';

    data.forEach(item => {
        const montant = parseFloat(item.ptotal) || 0;
        total += montant;
        rows += `<tr>
            <td>${getFtypeLabel(item.ftype)}</td>
            <td>${item.ccompta || 'Non défini'}</td>
            <td class="text-end">${formatMontant(montant)}</td>
        </tr>`;
    });

    return `
        <div class="mb-2">Total mouvements par code comptable</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm">
                <thead class="table-secondary">
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th class="text-end">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                    <tr>
                        <td colspan="2" style="font-weight: bold;">Total</td>
                        <td class="text-end" style="font-weight: bold;">${formatMontant(total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Rendre le tableau des factures
function renderInvoicesTable(data) {
    if (!data || data.length === 0) {
        return '<p class="text-muted">Aucune facture disponible</p>';
    }

    let rows = '';

    data.forEach(item => {
        const montant = parseFloat(item.multicurrency_total_ttc) || 0;
        const userId = item.fk_user_author || '';
        const userColor = getUserColor(userId);

        // Récupérer les infos du premier paiement
        const payment = item.payments && item.payments[0] ? item.payments[0] : {};
        const paymentAmount = parseFloat(payment.amount) || 0;
        const paymentType = payment.type || 'Non défini';
        const paymentDate = payment.date || '';

        // Type de facture
        const invoiceType = item.type === '0' ? 'Standard' : (item.type === '3' ? 'Acompte' : 'Standard');

        rows += `<tr>
            <td><i class="bi bi-arrow-right"></i></td>
            <td>${item.ref || 'Non défini'}</td>
            <td>${paymentType} (${formatMontant(paymentAmount)})</td>
            <td>${invoiceType}</td>
            <td>${formatDate(paymentDate)}</td>
            <td class="text-end">${formatMontant(montant)}</td>
            <td class="text-end">${userId}</td>
        </tr>`;
    });

    return `
        <div class="mb-2">Factures impliquées dans le calcul de la clôture de caisse</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm">
                <thead class="table-secondary">
                    <tr>
                        <th></th>
                        <th>Référence</th>
                        <th>Paiement</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th class="text-end">Montant</th>
                        <th class="text-end">Utilisateur</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Charger les données et remplir les tableaux
async function loadData() {
    if (currentController) {
        currentController.abort();
    }
    currentController = new AbortController();

    const startDate = document.getElementById('dateDebut').value;
    const endDate = document.getElementById('dateFin').value;
    const selectedUserId = document.getElementById('userSelect').value;

    if (!startDate || !endDate) {
        alert('Veuillez sélectionner les dates de début et de fin');
        return;
    }

    if (endDate < startDate) {
        alert('La date de fin doit être postérieure ou égale à la date de début');
        return;
    }

    showLoading(true);
    document.getElementById('tableContainer').innerHTML = '';

    try {
        // Appeler les 3 APIs en parallèle
        const [paymentsByMode, paymentsByAccountCode, invoices] = await Promise.all([
            getPaymentsByMode(startDate, endDate, selectedUserId, currentController.signal),
            getPaymentsByAccountCode(startDate, endDate, selectedUserId, currentController.signal),
            getInvoicesWithPayments(startDate, endDate, selectedUserId, currentController.signal)
        ]);

        // Générer le HTML des tableaux
        const tableHtml = `
            <div class="row mb-4">
                <div class="col-md-6">
                    ${renderPaymentsByModeTable(paymentsByMode)}
                </div>
                <div class="col-md-6">
                    ${renderPaymentsByAccountCodeTable(paymentsByAccountCode)}
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    ${renderInvoicesTable(invoices)}
                </div>
            </div>
        `;

        document.getElementById('tableContainer').innerHTML = tableHtml;
        document.getElementById('errorMessage').classList.add('hidden');

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Requête annulée');
            return;
        }
        console.error('Erreur:', error);

        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = `Erreur lors du chargement des données: ${error.message}`;
        errorDiv.classList.remove('hidden');
    } finally {
        showLoading(false);
    }
}
