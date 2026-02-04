import { getBlocTitleDisplay, getPageTitleDisplay } from '../../shared/bootstrapServices/components.js';
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js';
import { fetchIntakePlaces, fetchMealProductIds, getRestaurantData } from './restaurantService.js';

// Controller pour annuler les requêtes précédentes
let currentController = null;

// Données des lieux (cache global)
let placesData = {};
let selectedPlaces = new Set();

// Tous les IDs de lieux pour la logique "Tous les lieux"
let allPlaceIds = [];

// Template HTML pour le contenu principal
const restaurantContentString = `
    <div class="" style="padding-top:60px; margin-bottom:20px">
    ${getPageTitleDisplay("Restaurant", "bi-cup-hot")}
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
            <label class="form-label">Lieux de consommation</label>
            <div class="col-12 place-select">
                <div class="place-select-box" id="placeSelectBox">
                    <span class="text-muted small">Chargement...</span>
                </div>
                <div class="place-dropdown hidden" id="placeDropdown"></div>
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
    <div id="tableContainer">
        <!-- Table Lieu 1 -->
        <table class="table table-bordered table-sm meal-table mb-4" id="totauxTable1">
            <thead class="table-secondary">
                <tr>
                    <th>Lieu 1</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <!-- Table Lieu 3 -->
        <table class="table table-bordered table-sm meal-table mb-4" id="totauxTable3">
            <thead class="table-secondary">
                <tr>
                    <th>Lieu 3</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <!-- Table Lieu non défini -->
        <table class="table table-bordered table-sm meal-table mb-4" id="totauxTableNull">
            <thead class="table-secondary">
                <tr>
                    <th>Lieu non défini</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        <!-- Table Totaux -->
        <table class="table table-bordered table-sm meal-table mb-4" id="totauxTable">
            <thead class="table-secondary">
                <tr>
                    <th>Totaux</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- Lignes de commande -->
    <div class="mt-4 mb-2">Lignes de commande impliquées dans le calcul des tableaux</div>
    <table class="table table-bordered table-sm" id="commandesTable">
        <thead class="table-secondary">
            <tr>
                <th>Commande</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Lieu</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
`;

// Point d'entrée principal
export async function startRestaurantController() {
    await launchInitialisation();
    headerViewDisplay("#menuSection");
    displayRestaurantContent("mainActiveSection");
}

// Afficher le contenu principal
function displayRestaurantContent(htmlPartId) {
    document.querySelector("#" + htmlPartId).innerHTML = restaurantContentString;

    // Initialiser les dates par défaut à la date du jour
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateDebut').value = today;
    document.getElementById('dateFin').value = today;

    // Initialiser les événements
    initEventListeners();

    // Initialiser le sélecteur de lieux
    initPlaceSelector();
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

    // Basculer la visibilité du menu déroulant
    document.getElementById('placeSelectBox').addEventListener('click', () => {
        document.getElementById('placeDropdown').classList.toggle('hidden');
    });

    // Fermer le menu déroulant lors d'un clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.place-select')) {
            document.getElementById('placeDropdown').classList.add('hidden');
        }
    });
}

// Initialiser le sélecteur de lieux
async function initPlaceSelector() {
    const places = await fetchIntakePlaces();
    placesData = places;

    const dropdown = document.getElementById('placeDropdown');
    dropdown.innerHTML = '';

    // Construire la liste de tous les IDs de lieux
    allPlaceIds = ['null', ...Object.keys(places)];

    // Ajouter l'option "Tous les lieux" en premier
    const labelAll = document.createElement('label');
    labelAll.innerHTML = `<input type="checkbox" value="all" checked> Tous les lieux`;
    labelAll.style.borderBottom = '1px solid #dee2e6';
    dropdown.appendChild(labelAll);

    // Ajouter l'option "Lieu non défini"
    const labelNull = document.createElement('label');
    labelNull.innerHTML = `<input type="checkbox" value="null" checked> Lieu non défini`;
    dropdown.appendChild(labelNull);
    selectedPlaces.add('null');

    // Ajouter les lieux depuis l'API
    Object.entries(places).forEach(([id, name]) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${id}" checked> ${name}`;
        dropdown.appendChild(label);
        selectedPlaces.add(id);
    });

    // Ajouter les écouteurs d'événements aux cases à cocher
    dropdown.querySelectorAll('input').forEach(cb => {
        cb.addEventListener('change', (e) => {
            if (e.target.value === 'all') {
                // La case "Tous les lieux" active/désactive toutes les autres
                const checkAll = e.target.checked;
                dropdown.querySelectorAll('input:not([value="all"])').forEach(otherCb => {
                    otherCb.checked = checkAll;
                    if (checkAll) {
                        selectedPlaces.add(otherCb.value);
                    } else {
                        selectedPlaces.delete(otherCb.value);
                    }
                });
            } else {
                // Case individuelle
                if (e.target.checked) {
                    selectedPlaces.add(e.target.value);
                } else {
                    selectedPlaces.delete(e.target.value);
                }
                // Mettre à jour l'état de la case "Tous les lieux"
                const allCheckbox = dropdown.querySelector('input[value="all"]');
                allCheckbox.checked = allPlaceIds.every(id => selectedPlaces.has(id));
            }
            updatePlaceTags();
        });
    });

    updatePlaceTags();
}

// Mettre à jour l'affichage des étiquettes de lieux sélectionnés
function updatePlaceTags() {
    const box = document.getElementById('placeSelectBox');
    box.innerHTML = '';

    // Vérifier si tous les lieux sont sélectionnés
    const allSelected = allPlaceIds.length > 0 && allPlaceIds.every(id => selectedPlaces.has(id));

    if (allSelected) {
        // Afficher uniquement l'étiquette "Tous les lieux"
        const tag = document.createElement('span');
        tag.className = 'place-tag';
        tag.innerHTML = `Tous les lieux <span class="remove" data-id="all">&times;</span>`;
        box.appendChild(tag);
    } else {
        // Afficher les étiquettes individuelles
        selectedPlaces.forEach(id => {
            const name = id === 'null' ? 'Lieu non défini' : (placesData[id] || `Lieu ${id}`);
            const tag = document.createElement('span');
            tag.className = 'place-tag';
            tag.innerHTML = `${name} <span class="remove" data-id="${id}">&times;</span>`;
            box.appendChild(tag);
        });
    }

    // Ajouter la flèche du menu déroulant
    const arrow = document.createElement('span');
    arrow.className = 'ms-auto';
    arrow.innerHTML = '&#9660;';
    box.appendChild(arrow);

    // Ajouter les gestionnaires de clic pour les boutons de suppression
    box.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = e.target.dataset.id;
            if (id === 'all') {
                // Désélectionner tout
                selectedPlaces.clear();
                document.querySelectorAll('#placeDropdown input').forEach(cb => cb.checked = false);
            } else {
                selectedPlaces.delete(id);
                const checkbox = document.querySelector(`#placeDropdown input[value="${id}"]`);
                if (checkbox) checkbox.checked = false;
                // Mettre à jour la case "Tous les lieux"
                const allCheckbox = document.querySelector('#placeDropdown input[value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            }
            updatePlaceTags();
        });
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

// Obtenir le type de repas depuis la ref (lettre avant le dernier "_")
function getMealType(ref) {
    const parts = ref.split('_');
    if (parts.length < 2) return null;
    const beforeLast = parts[parts.length - 2];
    const letter = beforeLast.charAt(beforeLast.length - 1).toUpperCase();
    if (letter === 'P') return 'Matin';
    if (letter === 'M') return 'Midi';
    if (letter === 'S') return 'Soir';
    return null;
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
        // Récupérer les IDs des produits repas
        const mealProductIds = await fetchMealProductIds();
        const places = placesData;

        // Vérifier qu'on a des IDs de produits
        if (mealProductIds.length === 0) {
            throw new Error('Aucun produit repas trouvé');
        }

        // Récupérer les données via le service
        const data = await getRestaurantData(startDate, endDate, mealProductIds, currentController.signal);

        // Obtenir la plage de dates
        const dates = getDateRange(startDate, endDate);

        // Initialiser les compteurs - total et par lieu
        const initCounts = () => ({
            'Matin': {},
            'Midi': {},
            'Soir': {}
        });

        const counts = initCounts();
        const counts1 = initCounts();
        const counts3 = initCounts();
        const countsNull = initCounts();

        dates.forEach(date => {
            const key = formatDateAPI(date);
            ['Matin', 'Midi', 'Soir'].forEach(meal => {
                counts[meal][key] = 0;
                counts1[meal][key] = 0;
                counts3[meal][key] = 0;
                countsNull[meal][key] = 0;
            });
        });

        // Traiter chaque ligne
        data.forEach(item => {
            const ref = item.ref || '';
            const mealType = getMealType(ref);

            if (!mealType) return;

            const startTs = item.array_options?.options_lin_datedebut;
            const endTs = item.array_options?.options_lin_datefin;
            const intakePlace = item.array_options?.options_lin_intakeplace;
            if (!startTs || !endTs) return;

            // Déterminer la clé du lieu pour le filtrage
            const placeKey = intakePlace ? String(intakePlace) : 'null';

            // Ignorer si le lieu n'est pas sélectionné
            if (!selectedPlaces.has(placeKey)) return;

            const qty = parseInt(item.qty) || 1;

            // Calculer le nombre de jours dans l'inscription
            const daysInSubscription = Math.round((endTs - startTs) / (24 * 60 * 60)) + 1;
            // Calculer le nombre de repas par jour (qty divisé par nombre de jours)
            const mealsPerDay = qty / daysInSubscription;

            // Pour chaque date de la plage UI, vérifier si elle est dans la plage de l'inscription
            dates.forEach(date => {
                if (isDateInRange(date, startTs, endTs)) {
                    const key = formatDateAPI(date);
                    // Total
                    counts[mealType][key] += mealsPerDay;
                    // Par lieu (placeKey déjà normalisé en string)
                    if (placeKey === '1') {
                        counts1[mealType][key] += mealsPerDay;
                    } else if (placeKey === '3') {
                        counts3[mealType][key] += mealsPerDay;
                    } else if (placeKey === 'null') {
                        countsNull[mealType][key] += mealsPerDay;
                    }
                }
            });
        });

        // Construire les tableaux avec les noms des lieux (si sélectionnés)
        const table1 = document.getElementById('totauxTable1');
        const table3 = document.getElementById('totauxTable3');
        const tableNull = document.getElementById('totauxTableNull');

        if (selectedPlaces.has('1')) {
            table1.classList.remove('hidden');
            buildTable('totauxTable1', counts1, places['1'] || 'Lieu 1', dates);
        } else {
            table1.classList.add('hidden');
        }

        if (selectedPlaces.has('3')) {
            table3.classList.remove('hidden');
            buildTable('totauxTable3', counts3, places['3'] || 'Lieu 3', dates);
        } else {
            table3.classList.add('hidden');
        }

        if (selectedPlaces.has('null')) {
            tableNull.classList.remove('hidden');
            buildTable('totauxTableNull', countsNull, 'Lieu non défini', dates);
        } else {
            tableNull.classList.add('hidden');
        }

        // Afficher le tableau Totaux seulement si plus d'1 lieu est sélectionné
        const totauxTable = document.getElementById('totauxTable');
        if (selectedPlaces.size > 1) {
            totauxTable.classList.remove('hidden');
            buildTable('totauxTable', counts, 'Totaux', dates);
        } else {
            totauxTable.classList.add('hidden');
        }

        // Construire le tableau des commandes (filtré par lieux sélectionnés)
        const filteredData = data.filter(item => {
            const intakePlace = item.array_options?.options_lin_intakeplace;
            const placeKey = intakePlace ? String(intakePlace) : 'null';
            return selectedPlaces.has(placeKey);
        });
        buildCommandesTable(filteredData, places);

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

// Fonction pour construire un tableau avec titre dans l'en-tête
function buildTable(tableId, countsData, title, dates) {
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Construire l'en-tête : titre + dates
    thead.innerHTML = '';
    const thTitle = document.createElement('th');
    thTitle.textContent = title;
    thead.appendChild(thTitle);
    dates.forEach(date => {
        const th = document.createElement('th');
        th.textContent = formatDateShort(date);
        thead.appendChild(th);
    });

    // Construire les lignes
    const meals = ['Matin', 'Midi', 'Soir'];
    tbody.innerHTML = '';
    meals.forEach(meal => {
        const tr = document.createElement('tr');
        const tdTitle = document.createElement('td');
        tdTitle.textContent = meal;
        tr.appendChild(tdTitle);

        dates.forEach(date => {
            const key = formatDateAPI(date);
            const td = document.createElement('td');
            const value = Math.round(countsData[meal][key]);
            td.textContent = value > 0 ? value : '';
            if (value > 0) {
                td.classList.add('table-warning');
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Fonction pour construire le tableau des commandes
function buildCommandesTable(data, places) {
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
        tdCommande.textContent = item.fk_commande || '';
        tr.appendChild(tdCommande);

        // Produit (ref)
        const tdProduit = document.createElement('td');
        tdProduit.textContent = item.ref || '';
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

        // Lieu (intakeplace)
        const tdLieu = document.createElement('td');
        const intakePlace = item.array_options?.options_lin_intakeplace;
        tdLieu.textContent = places[intakePlace] || intakePlace || '';
        tr.appendChild(tdLieu);

        tbody.appendChild(tr);
    });
}
