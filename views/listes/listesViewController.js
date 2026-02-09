import { getPageTitleDisplay } from '../../shared/bootstrapServices/components.js';
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js';
import { fetchUsers, fetchOrders, fetchInvoices } from './listesService.js';

// Controller pour annuler les requêtes précédentes
let currentController = null;

// Cache des utilisateurs pour l'affichage
let usersCache = {};

// Template HTML pour le contenu principal
const listesContentString = `
    <div class="" style="padding-top:60px; margin-bottom:20px">
    ${getPageTitleDisplay("Listes", "bi-card-list")}
    </div>

    <!-- Filtres -->
    <div class="col-6">
        <div class="row" style="margin-bottom:-10px">
            <label for="searchTypeSelect" class="form-label">Choisir une recherche</label>
            <div class="col-12">
                <select class="form-select" id="searchTypeSelect">
                    <option value="" selected disabled>-- Sélectionnez --</option>
                    <option value="orders_draft">Commandes : Dernières commandes brouillon</option>
                    <option value="orders_inprogress">Commandes : Dernières commandes en cours</option>
                    <option value="orders_closed">Commandes : Dernières commandes clôturées</option>
                    <option value="orders_cancelled">Commandes : Dernières commandes annulées</option>
                    <option value="invoices_pending">Factures : Factures en attente de paiement</option>
                    <option value="invoices_draft">Factures : Factures brouillon</option>
                    <option value="invoices_avoir">Factures : Factures avoir en brouillon ou validées</option>
                </select>
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
                <button type="button" class="btn btn-secondary" id="searchBtn">Rechercher</button>
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
export async function startListesController() {
    await launchInitialisation();
    headerViewDisplay("#menuSection");
    displayListesContent("mainActiveSection");
}

// Afficher le contenu principal
function displayListesContent(htmlPartId) {
    document.querySelector("#" + htmlPartId).innerHTML = listesContentString;

    // Initialiser les événements
    initEventListeners();

    // Initialiser le sélecteur d'utilisateurs
    initUserSelector();
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', loadData);
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
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20ac';
}

// Formater une date (timestamp unix ou date string)
function formatDate(dateStr) {
    if (!dateStr) return '';
    let date;
    if (!isNaN(dateStr) && String(dateStr).length >= 10) {
        date = new Date(parseInt(dateStr) * 1000);
    } else {
        date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Obtenir le libellé du statut commande
function getOrderStatusLabel(status) {
    const statuses = {
        '-1': 'Annulée',
        '0': 'Brouillon',
        '1': 'Validée',
        '3': 'Clôturée'
    };
    return statuses[String(status)] || 'Non défini';
}

// Obtenir le libellé du statut facture
function getInvoiceStatusLabel(status, paye) {
    if (String(paye) === '1') return 'Payée';
    const statuses = {
        '0': 'Brouillon',
        '1': 'Validée',
        '2': 'Payée'
    };
    return statuses[String(status)] || 'Non défini';
}

// Obtenir le libellé du type de facture
function getInvoiceTypeLabel(type) {
    const types = {
        '0': 'Standard',
        '2': 'Avoir',
        '3': 'Acompte'
    };
    return types[String(type)] || 'Standard';
}

// Obtenir le nom d'utilisateur depuis le cache
function getUserName(userId) {
    if (!userId || userId === '0') return '';
    return usersCache[userId] || userId;
}

// Rendre le tableau des commandes
function renderOrdersTable(data) {
    if (!data || data.length === 0) {
        return '<p class="text-muted">Aucune commande trouvée</p>';
    }

    let rows = '';
    data.forEach(item => {
        const montant = parseFloat(item.total_ttc) || 0;
        // Extraire le nom du premier produit (stage)
        const stage = (item.lines && item.lines.length > 0)
            ? (item.lines[0].libelle || item.lines[0].product_label || item.lines[0].desc || 'Non défini')
            : 'Non défini';

        // Nom de l'adhérent
        const adherent = item.customer?.name || 'Non défini';

        rows += `<tr>
            <td><i class="bi bi-arrow-right"></i></td>
            <td>${item.ref || 'Non défini'}</td>
            <td>${adherent}</td>
            <td>${formatDate(item.date_creation || item.datec)}</td>
            <td>${formatDate(item.tms || item.date_modification)}</td>
            <td class="text-end">${formatMontant(montant)}</td>
            <td>${stage}</td>
            <td>${getOrderStatusLabel(item.statut || item.fk_statut)}</td>
            <td>${getUserName(item.fk_user_author || item.user_author_id)}</td>
        </tr>`;
    });

    return `
        <div class="mb-2">Commandes (${data.length} résultat(s))</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm">
                <thead class="table-secondary">
                    <tr>
                        <th></th>
                        <th>Réf</th>
                        <th>Adhérent</th>
                        <th>Date C</th>
                        <th>Date M</th>
                        <th class="text-end">Montant</th>
                        <th>Stage</th>
                        <th>Statut</th>
                        <th>Utilisateur</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

// Rendre le tableau des factures
function renderInvoicesTable(data) {
    if (!data || data.length === 0) {
        return '<p class="text-muted">Aucune facture trouvée</p>';
    }

    let rows = '';
    data.forEach(item => {
        const montant = parseFloat(item.total_ttc) || parseFloat(item.multicurrency_total_ttc) || 0;

        rows += `<tr>
            <td><i class="bi bi-arrow-right"></i></td>
            <td>${item.ref || 'Non défini'}</td>
            <td>${getInvoiceTypeLabel(item.type)}</td>
            <td>${formatDate(item.date || item.datec)}</td>
            <td class="text-end">${formatMontant(montant)}</td>
            <td>${getInvoiceStatusLabel(item.statut || item.fk_statut, item.paye)}</td>
            <td>${getUserName(item.fk_user_author || item.user_author_id)}</td>
        </tr>`;
    });

    return `
        <div class="mb-2">Factures (${data.length} résultat(s))</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm">
                <thead class="table-secondary">
                    <tr>
                        <th></th>
                        <th>Réf</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th class="text-end">Montant</th>
                        <th>Etat</th>
                        <th>Auteur</th>
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

    const searchType = document.getElementById('searchTypeSelect').value;
    const selectedUserId = document.getElementById('userSelect').value;

    if (!searchType) {
        alert('Veuillez sélectionner un type de recherche');
        return;
    }

    showLoading(true);
    document.getElementById('tableContainer').innerHTML = '';

    try {
        let tableHtml = '';

        if (searchType.startsWith('orders_')) {
            const data = await fetchOrders(searchType, selectedUserId, currentController.signal);
            tableHtml = renderOrdersTable(data);
        } else if (searchType.startsWith('invoices_')) {
            const data = await fetchInvoices(searchType, selectedUserId, currentController.signal);
            tableHtml = renderInvoicesTable(data);
        }

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
