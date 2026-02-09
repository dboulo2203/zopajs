import { getBlocTitleDisplay } from '../../shared/bootstrapServices/components/components.js';
import { addMultipleEnventListener, getAppPath } from '../../shared/services/commonFunctions.js';
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js';
import { searchProducts } from './productsService.js';

// Template HTML pour le contenu principal
const productsContentString = `
    <div class="pb-4">
        <!-- Search Section -->
        <div class="card shadow-sm mb-4" style="margin-top:60px">
            <div class="card-body p-4">
                <span class="card-title mb-4 fs-3">
                ${getBlocTitleDisplay("Recherche de produit", "bi-search")}
                </span>
                <form id="searchForm">
                    <div class="row g-3">
                        <div class="col-md-9">
                            <input type="text" id="searchInput" class="form-control form-control-md"
                                placeholder="Entrez votre recherche (titre, référence...)" autocomplete="off" required>
                        </div>
                        <div class="col-md-3">
                            <button type="submit" class="btn btn-secondary btn-mdg w-100">
                                Rechercher
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Error Alert -->
        <div class="alert alert-warning alert-dismissible fade show d-none" id="errorAlert" role="alert">
            <strong>Erreur!</strong> <span id="errorMessage"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>

        <!-- Loading Spinner -->
        <div class="card shadow-sm text-center py-5 d-none" id="loading">
            <div class="card-body">
                <div class="spinner-border text-secondary mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Recherche en cours...</p>
            </div>
        </div>

        <!-- Results -->
        <div id="results"></div>
    </div>
`;

// Point d'entrée principal
export async function startProductsController() {
    await launchInitialisation();
    headerViewDisplay("#menuSection");
    displayProductsContent("mainActiveSection");
}

// Afficher le contenu principal
function displayProductsContent(htmlPartId) {
    document.querySelector("#" + htmlPartId).innerHTML = productsContentString;

    // Initialiser les événements
    initEventListeners();

    // Focus sur le champ de recherche
    document.getElementById('searchInput').focus();
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', handleSearch);

}

// Gérer la soumission du formulaire de recherche
async function handleSearch(e) {
    e.preventDefault();

    const searchInput = document.getElementById('searchInput');
    const searchString = searchInput.value.trim();

    if (!searchString) return;

    // Reset UI
    showLoading(true);
    hideResults();
    hideError();

    try {
        const data = await searchProducts(searchString);

        showLoading(false);

        if (!data || data.length === 0) {
            displayNoResults(searchString);
        } else {
            displayResults(data);
        }
    } catch (error) {
        showLoading(false);
        showError(`Erreur lors de la recherche: ${error.message}`);
        console.error('Search error:', error);
    }
}

// Afficher l'indicateur de chargement
function showLoading(show) {
    const loadingEl = document.getElementById('loading');
    if (show) {
        loadingEl.classList.remove('d-none');
    } else {
        loadingEl.classList.add('d-none');
    }
}

// Masquer les résultats
function hideResults() {
    const resultsEl = document.getElementById('results');
    resultsEl.classList.add('d-none');
    resultsEl.innerHTML = '';
}

// Afficher un message d'erreur
function showError(message) {
    const errorEl = document.getElementById('errorAlert');
    const errorMessageEl = document.getElementById('errorMessage');
    errorMessageEl.textContent = message;
    errorEl.classList.remove('d-none');
}

// Masquer le message d'erreur
function hideError() {
    const errorEl = document.getElementById('errorAlert');
    errorEl.classList.add('d-none');
}

// Afficher un message "Aucun résultat"
function displayNoResults(searchString) {
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body text-center py-5">
                <h3 class="h5 mb-3">Aucun résultat</h3>
                <p class="text-muted">Aucun produit trouvé pour "${searchString}"</p>
            </div>
        </div>
    `;
    resultsEl.classList.remove('d-none');
}


// Afficher les résultats de recherche
function displayResults(data) {
    const resultsEl = document.getElementById('results');

    const resultsHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <span class="fs-6 mb-0 text-primary-custom">
                    📋 Résultats de la recherche (${data.length})
                </span>
            </div>
            <div class="list-group list-group-flush">
                ${data.map(product => createProductRow(product)).join('')}
            </div>
        </div>
    `;

    resultsEl.innerHTML = resultsHTML;
    addMultipleEnventListener(".result-row", function (event) {
        window.location.href = `${getAppPath()}/views/products/productDetail/productDetail.html?productid=` + event.currentTarget.getAttribute('productid');
    });

    resultsEl.classList.remove('d-none');
}

// Créer une ligne de résultat pour un produit
function createProductRow(product) {
    // Formater la date de début
    const dateDebut = product.array_options?.options_sta_datedebut
        ? formatDate(product.array_options.options_sta_datedebut)
        : 'N/A';

    // Formater les prix
    const prices = formatPrices(product.multiprices_ttc);

    return `
        <div class="list-group-item result-row" productid="${product.id}">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <span class="fw-light">${product.ref || 'N/A'}</span><br/>
                    <span class="fs-5 mb-2">${product.label || 'Sans titre'}</span>
                    <div class="d-flex flex-wrap gap-3 text-muted">
                        <span class="fw-light">Date début : </span>${dateDebut}
                        <span class="fw-light">Prix : </span>${prices}
                    </div>
                </div>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-muted">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    `;
}

// Formater une date timestamp
function formatDate(timestamp) {
    return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(timestamp * 1000);
}

// Formater les prix
function formatPrices(multiprices) {
    if (!multiprices) return 'N/A';

    return Object.values(multiprices)
        .map(price => new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price))
        .join(', ');
}

// Naviguer vers la page de détails du produit
window.viewProductDetails = function (productId) {
    window.location.href = `product-detail.html?id=${productId}`;
};
