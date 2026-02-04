import { getBlocTitleDisplay, getPageTitleDisplay } from '../../shared/bootstrapServices/components.js';
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js';
import { fetchIntakePlaces, fetchMealProductIds, fetchMealTypes, getRestaurantData } from './restaurantService.js';

// Controller pour annuler les requêtes précédentes
let currentController = null;

// Données des lieux (cache global)
let placesData = {};
let selectedPlaces = new Set();

// Tous les IDs de lieux pour la logique "Tous les lieux"
let allPlaceIds = [];

// Données des types de repas (Végétarien, Non-végétarien, etc.)
let mealTypesData = {};

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
        <!-- Conteneur dynamique pour les tableaux par lieu -->
        <div id="placeTablesContainer"></div>

        <!-- Table Totaux (seule table statique) -->
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
    <div style="overflow-x: auto;">
        <table class="table table-bordered table-sm" id="commandesTable">
            <thead class="table-secondary">
                <tr>
                    <th>Commande</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Lieu</th>
                    <th>Type repas</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
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
    // Charger les lieux et les types de repas en parallèle
    const [places, mealTypes] = await Promise.all([
        fetchIntakePlaces(),
        fetchMealTypes()
    ]);
    placesData = places;
    mealTypesData = mealTypes;

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

// Créer dynamiquement un tableau HTML pour un lieu
function createPlaceTable(placeKey, placeName) {
    const tableId = `totauxTable_${placeKey}`;
    const table = document.createElement('table');
    table.className = 'table table-bordered table-sm meal-table mb-4';
    table.id = tableId;
    table.innerHTML = `
        <thead class="table-secondary">
            <tr><th>${placeName}</th></tr>
        </thead>
        <tbody></tbody>
    `;
    return table;
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

        // Initialiser les compteurs pour un type de repas
        const initCounts = () => ({
            'Matin': {},
            'Midi': {},
            'Soir': {}
        });

        // Initialiser les compteurs pour tous les types de repas (végé, non-végé, non défini)
        const initCountsByMealType = () => ({});

        // Compteur pour les totaux généraux (par type de repas)
        const countsByMealType = initCountsByMealType();

        // Objet dynamique pour stocker les compteurs par lieu
        const countsByPlace = {};

        // Traiter chaque ligne
        data.forEach(item => {
            const ref = item.ref || '';
            const mealTime = getMealType(ref); // Matin, Midi, Soir

            if (!mealTime) return;

            const startTs = item.array_options?.options_lin_datedebut;
            const endTs = item.array_options?.options_lin_datefin;
            const intakePlace = item.array_options?.options_lin_intakeplace;
            const mealTypeId = item.array_options?.options_lin_room;
            if (!startTs || !endTs) return;

            // Déterminer la clé du lieu pour le filtrage
            const placeKey = intakePlace ? String(intakePlace) : 'null';

            // Ignorer si le lieu n'est pas sélectionné
            if (!selectedPlaces.has(placeKey)) return;

            // Déterminer le type de repas (Végétarien, Non-végétarien, Non défini)
            // Si mealTypeId est invalide (null, undefined, array, etc.), on utilise 'null' comme clé
            const isValidMealTypeId = mealTypeId && typeof mealTypeId !== 'object' && mealTypesData[mealTypeId];
            const mealTypeKey = isValidMealTypeId ? String(mealTypeId) : 'null';
            const mealTypeName = isValidMealTypeId ? mealTypesData[mealTypeId] : 'Non défini';

            // Créer dynamiquement le compteur pour ce lieu s'il n'existe pas encore
            if (!countsByPlace[placeKey]) {
                const placeName = placeKey === 'null'
                    ? 'Lieu non défini'
                    : (places[placeKey] || `Lieu ${placeKey}`);

                countsByPlace[placeKey] = {
                    name: placeName,
                    countsByMealType: {}
                };
            }

            // Créer dynamiquement le compteur pour ce type de repas dans ce lieu
            if (!countsByPlace[placeKey].countsByMealType[mealTypeKey]) {
                countsByPlace[placeKey].countsByMealType[mealTypeKey] = {
                    name: mealTypeName,
                    counts: initCounts()
                };
                // Initialiser toutes les dates à 0
                dates.forEach(date => {
                    const dateKey = formatDateAPI(date);
                    ['Matin', 'Midi', 'Soir'].forEach(meal => {
                        countsByPlace[placeKey].countsByMealType[mealTypeKey].counts[meal][dateKey] = 0;
                    });
                });
            }

            // Créer dynamiquement le compteur global pour ce type de repas
            if (!countsByMealType[mealTypeKey]) {
                countsByMealType[mealTypeKey] = {
                    name: mealTypeName,
                    counts: initCounts()
                };
                dates.forEach(date => {
                    const dateKey = formatDateAPI(date);
                    ['Matin', 'Midi', 'Soir'].forEach(meal => {
                        countsByMealType[mealTypeKey].counts[meal][dateKey] = 0;
                    });
                });
            }

            const qty = parseInt(item.qty) || 1;

            // Calculer le nombre de jours dans l'inscription
            const daysInSubscription = Math.round((endTs - startTs) / (24 * 60 * 60)) + 1;
            // Calculer le nombre de repas par jour (qty divisé par nombre de jours)
            const mealsPerDay = qty / daysInSubscription;

            // Pour chaque date de la plage UI, vérifier si elle est dans la plage de l'inscription
            dates.forEach(date => {
                if (isDateInRange(date, startTs, endTs)) {
                    const key = formatDateAPI(date);
                    // Total général par type de repas
                    countsByMealType[mealTypeKey].counts[mealTime][key] += mealsPerDay;
                    // Par lieu et type de repas (dynamique)
                    countsByPlace[placeKey].countsByMealType[mealTypeKey].counts[mealTime][key] += mealsPerDay;
                }
            });
        });

        // Vider le conteneur des tableaux par lieu
        const placeTablesContainer = document.getElementById('placeTablesContainer');
        placeTablesContainer.innerHTML = '';

        // Définir l'ordre d'affichage : lieux numériques triés, puis 'null' en dernier
        const sortedPlaceKeys = Object.keys(countsByPlace).sort((a, b) => {
            if (a === 'null') return 1;  // 'null' va à la fin
            if (b === 'null') return -1;
            return parseInt(a) - parseInt(b);  // Tri numérique pour les autres
        });

        // Fonction pour vérifier si un type de repas a des données
        const mealTypeHasData = (mealTypeData) => {
            return Object.values(mealTypeData.counts).some(mealCounts =>
                Object.values(mealCounts).some(value => value > 0)
            );
        };

        // Construire dynamiquement les tableaux pour chaque lieu ayant des données
        sortedPlaceKeys.forEach(placeKey => {
            const placeData = countsByPlace[placeKey];

            // Vérifier si ce lieu a des données (au moins un type de repas avec des valeurs > 0)
            const hasData = Object.values(placeData.countsByMealType).some(mealTypeHasData);

            if (hasData) {
                const tableId = `totauxTable_${placeKey}`;
                const table = createPlaceTable(placeKey, placeData.name);
                placeTablesContainer.appendChild(table);
                buildTableWithMealTypes(tableId, placeData.countsByMealType, placeData.name, dates);
            }
        });

        // Afficher le tableau Totaux seulement si plus d'1 lieu est sélectionné
        const totauxTable = document.getElementById('totauxTable');
        const placesWithData = sortedPlaceKeys.filter(placeKey => {
            const placeData = countsByPlace[placeKey];
            return Object.values(placeData.countsByMealType).some(mealTypeHasData);
        });

        if (placesWithData.length > 1) {
            totauxTable.classList.remove('hidden');
            buildTableWithMealTypes('totauxTable', countsByMealType, 'Totaux', dates);
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

// Fonction pour construire un tableau avec titre dans l'en-tête (ancienne version)
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

// Fonction pour construire un tableau avec groupes par type de repas (Végétarien, Non-végétarien, Non défini)
function buildTableWithMealTypes(tableId, countsByMealType, title, dates) {
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Construire l'en-tête : titre + type de repas + dates
    thead.innerHTML = '';
    const thTitle = document.createElement('th');
    thTitle.textContent = title;
    thTitle.style.width = '70px';
    thTitle.style.minWidth = '70px';
    thead.appendChild(thTitle);
    const thType = document.createElement('th');
    thType.textContent = 'Type';
    thType.style.width = '70px';
    thType.style.minWidth = '70px';
    thead.appendChild(thType);
    dates.forEach(date => {
        const th = document.createElement('th');
        th.textContent = formatDateShort(date);
        thead.appendChild(th);
    });

    // Trier les types de repas : d'abord les numériques, puis 'null' en dernier
    const sortedMealTypeKeys = Object.keys(countsByMealType).sort((a, b) => {
        if (a === 'null') return 1;
        if (b === 'null') return -1;
        return parseInt(a) - parseInt(b);
    });

    // Construire les lignes groupées par type de repas
    const meals = ['Matin', 'Midi', 'Soir'];
    tbody.innerHTML = '';

    let isFirstGroup = true;
    sortedMealTypeKeys.forEach(mealTypeKey => {
        const mealTypeData = countsByMealType[mealTypeKey];

        // Vérifier si ce type de repas a des données
        const hasData = Object.values(mealTypeData.counts).some(mealCounts =>
            Object.values(mealCounts).some(value => value > 0)
        );

        if (!hasData) return;

        // Ajouter une ligne de séparation entre les groupes (sauf pour le premier)
        if (!isFirstGroup) {
            const separatorRow = document.createElement('tr');
            separatorRow.className = 'meal-type-separator';
            const separatorCell = document.createElement('td');
            separatorCell.colSpan = 2 + dates.length;
            separatorCell.style.borderTop = '1px solid #6c757d';
            separatorCell.style.padding = '0';
            separatorCell.style.height = '0';
            separatorRow.appendChild(separatorCell);
            tbody.appendChild(separatorRow);
        }
        isFirstGroup = false;

        // Créer les 3 lignes pour ce type de repas (Matin, Midi, Soir)
        meals.forEach((meal, mealIndex) => {
            const tr = document.createElement('tr');

            // Première colonne : Matin/Midi/Soir
            const tdMeal = document.createElement('td');
            tdMeal.textContent = meal;
            tdMeal.style.width = '70px';
            tdMeal.style.minWidth = '70px';
            tr.appendChild(tdMeal);

            // Deuxième colonne : Type de repas (affiché sur chaque ligne)
            const tdType = document.createElement('td');
            tdType.textContent = mealTypeData.name;
            tdType.style.fontStyle = 'italic';
            tdType.style.color = '#6c757d';
            tdType.style.width = '70px';
            tdType.style.minWidth = '70px';
            tr.appendChild(tdType);

            // Colonnes des dates
            dates.forEach(date => {
                const key = formatDateAPI(date);
                const td = document.createElement('td');
                const value = Math.round(mealTypeData.counts[meal][key] || 0);
                td.textContent = value > 0 ? value : '';
                if (value > 0) {
                    td.classList.add('table-warning');
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
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

        // Type de repas (mealtype)
        const tdMealType = document.createElement('td');
        const mealTypeId = item.array_options?.options_lin_room;
        const isValidMealType = mealTypeId && typeof mealTypeId !== 'object' && mealTypesData[mealTypeId];
        tdMealType.textContent = isValidMealType ? mealTypesData[mealTypeId] : 'Non défini';
        tr.appendChild(tdMealType);

        tbody.appendChild(tr);
    });
}
