import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js'
import { fetchIntakePlaces } from '../restaurant/restaurantService.js';

export function displaydroptest() {

    launchInitialisation();
}




// Initialiser le sélecteur de lieux
export async function initPlaceSelector() {
    let placesData = {};
    let selectedPlaces = new Set();

    // Tous les IDs de lieux pour la logique "Tous les lieux"
    let allPlaceIds = [];
    const places = await fetchIntakePlaces()
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
            // updatePlaceTags();
        });
    });
}