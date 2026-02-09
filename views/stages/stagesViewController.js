import { getPageTitleDisplay } from '../../shared/bootstrapServices/components/components.js';
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js';
import { fetchStageProducts, getStagesData } from './stagesService.js';

// Controller pour annuler les requêtes précédentes
let currentController = null;

// Template HTML pour le contenu principal
const stagesContentString = `
    <div class="" style="padding-top:60px; margin-bottom:20px">
        ${getPageTitleDisplay("Planning des stages", "bi bi-calendar3")}
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

    <!-- Conteneur des tableaux -->
    <div id="planningTableContainer"></div>
    <div id="configTableContainer"></div>

    <!-- Lignes de commande -->
    <div id="commandesTableContainer"></div>
`;

// Point d'entrée principal
export async function startStagesController() {
    await launchInitialisation();
    headerViewDisplay("#menuSection");
    displayStagesContent("mainActiveSection");
}

// Afficher le contenu principal
function displayStagesContent(htmlPartId) {
    document.querySelector("#" + htmlPartId).innerHTML = stagesContentString;

    // Initialiser les dates par défaut à la date du jour
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateDebut').value = today;
    document.getElementById('dateFin').value = today;

    // Initialiser les événements
    initEventListeners();
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Écouteur d'événement - clic sur le bouton de recherche
    document.getElementById('searchBtn').addEventListener('click', loadData);

    // Permettre d'appuyer sur Entrée dans les champs de date pour lancer la recherche
    document.getElementById('dateDebut').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadData();
    });
    document.getElementById('dateFin').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadData();
    });
}

// Formater la date en j/M
function formatDateShort(date) {
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

// Formater la date en YYYY-MM-DD pour l'API
function formatDateAPI(date) {
    return date.toISOString().split('T')[0];
}

// Parser la date YYYY-MM-DD pour éviter les problèmes de fuseau horaire
function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Générer un tableau de dates entre début et fin
function getDateRange(startDate, endDate) {
    const dates = [];
    const current = parseDate(startDate);
    const end = parseDate(endDate);
    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

// Vérifier si une date est dans une plage (début <= date <= fin)
function isDateInRange(targetDate, startTimestamp, endTimestamp) {
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const start = new Date(startTimestamp * 1000);
    const end = new Date(endTimestamp * 1000);
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return target >= startDay && target <= endDay;
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

// Générer le HTML du tableau Planning des stages
function renderPlanningTable() {
    return `
        <div class="mb-2">Planning des stages</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm meal-table mb-2" id="totauxTable">
                <thead class="table-secondary">
                    <tr><th>Title</th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
}

// Générer le HTML du tableau Configuration des stages
function renderConfigTable() {
    return `
        <div class="mt-2 mb-2">Configuration des stages</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm meal-table" id="configTable">
                <thead class="table-secondary">
                    <tr>
                        <th>ID</th>
                        <th>Label</th>
                        <th>Maxim. inscrits</th>
                        <th>Partici. Obligat.</th>
                        <th>Héberg. Interdit</th>
                        <th>Publié Zopaweb</th>
                        <th>Analyse</th>
                        <th>Compta</th>
                        <th>Prix</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
}

// Générer le HTML du tableau des commandes
function renderCommandesTable() {
    return `
        <div class="mt-2 mb-2">Lignes de commande impliquées dans le calcul des tableaux</div>
        <div style="overflow-x: auto;">
            <table class="table table-bordered table-sm" id="commandesTable">
                <thead class="table-secondary">
                    <tr>
                        <th>Commande</th>
                        <th>Client</th>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
}

// Charger les données et remplir les tableaux
async function loadData() {
    // Annuler la requête précédente si elle existe
    if (currentController) {
        currentController.abort();
    }
    currentController = new AbortController();

    const startDate = document.getElementById('dateDebut').value;
    const endDate = document.getElementById('dateFin').value;

    // Validation des dates
    if (!startDate || !endDate) {
        alert('Veuillez sélectionner les dates de début et de fin');
        return;
    }

    if (endDate < startDate) {
        alert('La date de fin doit être postérieure ou égale à la date de début');
        return;
    }

    // Afficher l'indicateur de chargement
    showLoading(true);

    try {
        // Récupérer les produits stages (IDs et labels)
        const { ids: stageProductIds, products: stageProducts } = await fetchStageProducts();

        // Vérifier qu'on a des IDs de produits
        if (stageProductIds.length === 0) {
            throw new Error('Aucun produit stage trouvé');
        }

        // Récupérer les données via le service
        const data = await getStagesData(startDate, endDate, stageProductIds, currentController.signal);

        // Obtenir la plage de dates
        const dates = getDateRange(startDate, endDate);

        // Initialiser les compteurs par stage (productId -> { label, counts: { date: count } })
        const stagesCounts = {};

        // Traiter chaque ligne
        data.forEach(item => {
            const startTs = item.array_options?.options_lin_datedebut;
            const endTs = item.array_options?.options_lin_datefin;
            if (!startTs || !endTs) return;

            const productId = item.fk_product;
            const qty = parseInt(item.qty) || 1;

            // Initialiser le stage si pas encore fait
            if (!stagesCounts[productId]) {
                const product = stageProducts[productId];
                stagesCounts[productId] = {
                    label: product ? product.label : `Stage ${productId}`,
                    counts: {}
                };
                dates.forEach(date => {
                    stagesCounts[productId].counts[formatDateAPI(date)] = 0;
                });
            }

            // Calculer le nombre de jours dans l'inscription
            const daysInSubscription = Math.round((endTs - startTs) / (24 * 60 * 60)) + 1;
            // Calculer le nombre de personnes par jour (qty divisé par nombre de jours)
            const personsPerDay = qty / daysInSubscription;

            // Pour chaque date de la plage UI, vérifier si elle est dans la plage de l'inscription
            dates.forEach(date => {
                if (isDateInRange(date, startTs, endTs)) {
                    const key = formatDateAPI(date);
                    stagesCounts[productId].counts[key] += personsPerDay;
                }
            });
        });

        // Injecter les tableaux dans leurs conteneurs
        document.getElementById('planningTableContainer').innerHTML = renderPlanningTable();
        document.getElementById('configTableContainer').innerHTML = renderConfigTable();
        document.getElementById('commandesTableContainer').innerHTML = renderCommandesTable();

        // Construire le tableau avec une ligne par stage
        buildTable('totauxTable', stagesCounts, dates);

        // Construire le tableau de configuration des stages
        buildConfigTable(stagesCounts, stageProducts);

        // Construire le tableau des commandes
        buildCommandesTable(data);

        // Masquer le message d'erreur si succès
        document.getElementById('errorMessage').classList.add('hidden');

        // Masquer l'indicateur de chargement
        showLoading(false);

    } catch (error) {
        // Ignorer les erreurs d'annulation (AbortError)
        if (error.name === 'AbortError') {
            console.log('Requête annulée');
            return;
        }
        console.error('Erreur:', error);

        // Afficher message d'erreur à l'utilisateur
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = `Erreur lors du chargement des données: ${error.message}`;
        errorDiv.classList.remove('hidden');

        showLoading(false);
    }
}

// Fonction pour construire le tableau avec une ligne par stage
function buildTable(tableId, stagesCounts, dates) {
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Construire l'en-tête : "Title" + dates
    thead.innerHTML = '';
    const thTitle = document.createElement('th');
    thTitle.textContent = 'Title';
    thead.appendChild(thTitle);
    dates.forEach(date => {
        const th = document.createElement('th');
        th.textContent = formatDateShort(date);
        thead.appendChild(th);
    });

    // Construire une ligne par stage
    tbody.innerHTML = '';
    Object.values(stagesCounts).forEach(stage => {
        const tr = document.createElement('tr');

        // Nom du stage
        const tdTitle = document.createElement('td');
        tdTitle.textContent = stage.label;
        tr.appendChild(tdTitle);

        // Valeurs par jour
        dates.forEach(date => {
            const key = formatDateAPI(date);
            const td = document.createElement('td');
            const value = Math.round(stage.counts[key]);
            td.textContent = value > 0 ? value : '';
            if (value > 0) {
                td.classList.add('table-warning');
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Fonction pour construire le tableau de configuration des stages
function buildConfigTable(stagesCounts, stageProducts) {
    const tbody = document.querySelector('#configTable tbody');
    tbody.innerHTML = '';

    // Afficher uniquement les stages qui ont des données (présents dans stagesCounts)
    Object.keys(stagesCounts).forEach(productId => {
        const product = stageProducts[productId];
        if (!product) return;

        const tr = document.createElement('tr');

        // Id
        const tdId = document.createElement('td');
        tdId.textContent = product.id;
        tr.appendChild(tdId);

        // Label
        const tdLabel = document.createElement('td');
        tdLabel.textContent = product.label;
        tr.appendChild(tdLabel);

        // Maxim. inscrits
        const tdNbmax = document.createElement('td');
        tdNbmax.textContent = product.nbmax || 'Non défini';
        tr.appendChild(tdNbmax);

        // Partici. Obligat.
        const tdFullattend = document.createElement('td');
        tdFullattend.textContent = product.fullattend ? 'Oui' : '';
        tr.appendChild(tdFullattend);

        // Héberg. Interdit
        const tdHosting = document.createElement('td');
        tdHosting.textContent = product.hostingclosed ? 'Oui' : '';
        tr.appendChild(tdHosting);

        // Publié Zopaweb
        const tdPublished = document.createElement('td');
        tdPublished.textContent = product.published ? 'Oui' : '';
        tr.appendChild(tdPublished);

        // Analyse (place)
        const tdPlace = document.createElement('td');
        tdPlace.textContent = product.place === '1' ? 'Institut' : (product.place || 'Non défini');
        tr.appendChild(tdPlace);

        // Compta
        const tdCompta = document.createElement('td');
        tdCompta.textContent = product.analcompta || 'Non défini';
        tr.appendChild(tdCompta);

        // Prix
        const tdPrix = document.createElement('td');
        tdPrix.textContent = product.prices.join(', ');
        tr.appendChild(tdPrix);

        tbody.appendChild(tr);
    });
}

// Fonction pour construire le tableau des commandes
function buildCommandesTable(data) {
    const tbody = document.querySelector('#commandesTable tbody');
    tbody.innerHTML = '';

    // Formater le timestamp en JJ/MM/AAAA
    function formatTimestampToDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Trier par date de début
    const sortedData = [...data].sort((a, b) => {
        const dateA = a.array_options?.options_lin_datedebut || 0;
        const dateB = b.array_options?.options_lin_datedebut || 0;
        return dateA - dateB;
    });

    sortedData.forEach(item => {
        const tr = document.createElement('tr');

        // Commande (fk_commande)
        const tdCommande = document.createElement('td');
        tdCommande.textContent = item.fk_commande || 'Non défini';
        tr.appendChild(tdCommande);

        // Client (customername)
        const tdClient = document.createElement('td');
        tdClient.textContent = item.customername || 'Non défini';
        tr.appendChild(tdClient);

        // Produit (ref)
        const tdProduit = document.createElement('td');
        tdProduit.textContent = item.ref || 'Non défini';
        tr.appendChild(tdProduit);

        // Quantité
        const tdQty = document.createElement('td');
        tdQty.textContent = item.qty || '';
        tr.appendChild(tdQty);

        // Date début
        const tdDateDebut = document.createElement('td');
        const startTs = item.array_options?.options_lin_datedebut;
        tdDateDebut.textContent = formatTimestampToDate(startTs);
        tr.appendChild(tdDateDebut);

        // Date fin
        const tdDateFin = document.createElement('td');
        const endTs = item.array_options?.options_lin_datefin;
        tdDateFin.textContent = formatTimestampToDate(endTs);
        tr.appendChild(tdDateFin);

        tbody.appendChild(tr);
    });
}
