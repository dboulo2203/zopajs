import { headerViewDisplay } from '../../../shared/zopaAppservices/headerViewCont.js';
import { launchInitialisation } from '../../../shared/zopaAppservices/initialisationService.js';
import { fetchProductDetails, fetchRegisteredPersons } from './productDetailService.js';
import { getevaluateOrderGlobalStatus } from '../../../shared/zopaServices/zopaOrderServices.js'
import { getBlocTitleDisplay, getPageTitleDisplay } from '../../../shared/bootstrapServices/components.js';
// Template HTML pour le contenu principal
const productDetailContentString = `
    <div class="pb-4">
        <!-- Loading Spinner -->
        <div class="card shadow-sm text-center py-5 d-none" id="loading">
            <div class="card-body">
                <div class="spinner-border text-primary-custom mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Chargement des détails...</p>
            </div>
        </div>

        <!-- Error -->
        <div class="card shadow-sm text-center py-5 d-none" id="error">
            <div class="card-body">
                <svg width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    class="text-danger mb-3">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 class="h4 mb-2">Erreur</h2>
                <p class="text-muted" id="errorMessage"></p>
            </div>
        </div>

        <!-- Detail Card -->
        <div class="card shadow-sm d-none" id="detailCard"></div>

        <!-- Registered Persons Section -->
        <div class="" id="registeredSection" style="margin-top:20px">
            ${getBlocTitleDisplay("Personnes inscrites", "bi-people")}
            <div class="card shadow-sm">
                <div class="card-body">
                    <div id="registeredList"></div>
                </div>
            </div>
        </div>
    </div>
`;

// Point d'entrée principal
export async function startProductDetailController() {
    await launchInitialisation();
    headerViewDisplay("#menuSection");
    displayProductDetailContent("mainActiveSection");
}

// Afficher le contenu principal
function displayProductDetailContent(htmlPartId) {
    document.querySelector("#" + htmlPartId).innerHTML = productDetailContentString;

    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productid');

    if (!productId) {
        showError('Aucun produit sélectionné');
    } else {
        loadProductDetails(productId);
    }
}

// Charger les détails du produit
async function loadProductDetails(productId) {
    showLoading(true);

    try {
        // Charger les détails du produit et la liste des inscrits en parallèle
        const [product, registeredPersons] = await Promise.all([
            fetchProductDetails(productId),
            fetchRegisteredPersons(productId)
        ]);

        showLoading(false);
        displayProductDetails(product);
        displayRegisteredPersons(registeredPersons);
    } catch (error) {
        showLoading(false);
        showError(`Impossible de charger les détails du produit: ${error.message}`);
        console.error('Load error:', error);
    }
}

// Afficher les détails du produit
function displayProductDetails(product) {
    const detailCardEl = document.getElementById('detailCard');

    const detailHTML = `
        <div style="margin-top:60px"><div> 
        <div class="card-header  border-bottom">
            ${getPageTitleDisplay("Produit")}
            ${getBlocTitleDisplay("Identité du produit")}
         </div>

        <div class="card-body p-4">
            <div class="mb-4">
                <div class="row g-3">
                    ${createDetailRow('Référence', product.ref || 'N/A')}
                    ${createDetailRow('Nom', product.label || 'Sans titre')}

                    ${product.array_options?.options_sta_datedebut ?
            createDetailRow('Date début', formatDateTime(product.array_options.options_sta_datedebut)) : ''}

                    ${product.array_options?.options_sta_datefin ?
            createDetailRow('Date fin', formatDateTime(product.array_options.options_sta_datefin)) : ''}

                    ${product.description ?
            createDetailRow('Description', product.description) : ''}

                    ${createDetailRow('Code Comptable', product.accountancy_code_sell || 'N/A')}

                    ${product.array_options?.options_sta_published ?
            createDetailRow('Publié en ligne', product.array_options.options_sta_published === "1" ? "Oui" : "Non") : ''}

                    ${product.array_options?.options_sta_fullattend ?
            createDetailRow('Participation complète obligatoire', product.array_options.options_sta_fullattend === "1" ? "Oui" : "Non") : ''}

                    ${product.array_options?.options_sta_nbmax ?
            createDetailRow('Nb. max participants', product.array_options.options_sta_nbmax) : ''}

                    ${product.array_options?.options_sta_place ?
            createDetailRow('Lieu du stage', '<strong>A finaliser</strong>') : ''}

                    ${product.barcode ?
            createDetailRow('Code-barres', `<code>${product.barcode}</code>`) : ''}

                    ${product.stock_reel !== undefined ?
            createDetailRow('Stock réel', product.stock_reel) : ''}

                    ${product.date_creation ?
            createDetailRow('Date de création', formatDate(product.date_creation)) : ''}

                    ${product.date_modification ?
            createDetailRow('Dernière modification', formatDate(product.date_modification)) : ''}
                </div>
            </div>

            ${product.note_public ? createNoteSection('Note publique', product.note_public) : ''}
            ${product.note_private ? createNoteSection('Note privée', product.note_private) : ''}
        </div>
    `;

    detailCardEl.innerHTML = detailHTML;
    detailCardEl.classList.remove('d-none');
}

// Créer une ligne de détail
function createDetailRow(label, value) {
    return `
        <div class="col-md-3">
            <label class="fw-light">${label} :</label>
        </div>
        <div class="col-md-9">
            <p class="mb-0">${value}</p>
        </div>
    `;
}

// Afficher la liste des personnes inscrites
function displayRegisteredPersons(persons) {
    const registeredSection = document.getElementById('registeredSection');
    const registeredList = document.getElementById('registeredList');

    if (!persons || persons.length === 0) {
        // Ne pas afficher la section s'il n'y a personne d'inscrit
        // registeredSection.classList.add('d-none');
        registeredList.innerHTML = "Pas d'inscrit à ce produit";
        return;
    }

    // Créer le tableau des personnes inscrites
    const tableHTML = `
        <div class="table-responsive">
            <table class="table table-hover table-bordered mb-0">
                <thead class="table-secondary">
                    <tr>
                        <th>ref.</th>
                        <th>Adhérent</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Utilisateur</th>
                    </tr>
                </thead>
                <tbody>
                    ${persons.map(person => createRegisteredPersonRow(person)).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3 text-muted">
            <strong>Total :</strong> ${persons.length} personne${persons.length > 1 ? 's' : ''} inscrite${persons.length > 1 ? 's' : ''}
        </div>
    `;

    registeredList.innerHTML = tableHTML;
    registeredSection.classList.remove('d-none');
}

// Créer une ligne pour une personne inscrite
function createRegisteredPersonRow(order) {
    return `
        <tr>
            <td>${order.ref || 'N/A'}</td>
            <td>${order.customer.name || 'N/A'}</td>
            <td>${order.customer.email || 'N/A'}</td>
            <td>${formatDate(order.date_creation) || 'N/A'}</td>
            <td>${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(order.total_ttc)
        }</td>
            <td>${getevaluateOrderGlobalStatus(order)} </td>
            <td>getUserLoginFromId(order.user_author_id) </td>
        </tr>
    `;
}

// Créer une section de note
function createNoteSection(title, content) {
    return `
        <div class="mb-4">
            <h4 class="h6 text-primary-custom mb-3">${title}</h4>
            <div class="alert alert-light mb-0">
                ${content}
            </div>
        </div>
    `;
}

// Afficher/masquer l'indicateur de chargement
function showLoading(show) {
    const loadingEl = document.getElementById('loading');
    if (show) {
        loadingEl.classList.remove('d-none');
    } else {
        loadingEl.classList.add('d-none');
    }
}

// Afficher un message d'erreur
function showError(message) {
    const errorEl = document.getElementById('error');
    const errorMessageEl = document.getElementById('errorMessage');
    errorMessageEl.textContent = message;
    errorEl.classList.remove('d-none');
}

// Formater une date avec heure
function formatDateTime(timestamp) {
    return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(timestamp * 1000);
}

// Formater une date simple
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}