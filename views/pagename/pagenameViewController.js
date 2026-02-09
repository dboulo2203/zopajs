import { getCustomer } from '../../shared/zopaServices/zopaCustomerServices.js'
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js'
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js'
import { isCurrentUSerLogged } from '../../shared/zopaServices/zopaLoginServices.js';
import { footerViewDisplay } from '../../shared/zopaAppservices/footerViewCont.js';
import { modalFunctionViewDisplay } from './modalFunctionViewCont.js';
import { getBlocHeaderWithMenu, getEditField, getStandardFieldDisplay } from '../../shared/bootstrapServices/components/components.js';
import { getPageTitleDisplay } from '../../shared/bootstrapServices/components/components.js';
import DropdownSelector from '../../shared/bootstrapServices/components/dropdown-selector-plain.js';
import AutocompleteSelector from '../../shared/bootstrapServices/components/autocomplete-selector-plain.js';

export async function startPagenameController() {
    try {

        // *** page initialisation
        await launchInitialisation();

        // *** Display header
        headerViewDisplay("#menuSection");

        // *** Check if user logged
        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");

        // *** Get url params and launch controller
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('paramid'))
            displayPagenameContent("mainActiveSection", searchParams.get('paramid'))

        // *** Display footer
        footerViewDisplay("#footerDisplay")

    } catch (error) {
        document.querySelector("#messageSection").innerHTML =
            `<div class="alert alert-danger" style="margin-top:30px" role="alert">${error}</div>`;
    }
}

async function displayPagenameContent(htmlPlaceId, customerid) {

    // *** Get the data from the web services
    let pageName = "Page de test";
    let iconString = `<i class="bi bi-people"></i>`
    let params = "test"
    let customer = await getCustomer(customerid);

    // *** Builf the html string to display in the mainActiveSection
    let htmlContent = `
        <div class="page-content" style="margin-top:60px" >
            ${getPageTitleDisplay("page de text", "bi-people")}
            <div class="page-body">
                <div id ="blockName1"></div>
                <div id ="blockName2"></div>

            </div>
        </div >
        `;
    // *** display the mainActiveSection
    document.querySelector("#" + htmlPlaceId).innerHTML = htmlContent;

    // *** Display block1
    displayblockname1Content("blockName1", customer);

    // *** Display block2
    displayblockname2Content("blockName2", params);
}

/**
 * 
 * @param {*} htmlPlaceid 
 * @param {*} params 
 */
function displayblockname1Content(htmlPlaceid, params) {

    // *** get data
    let bloclabel = "Bloc test"
    let blocIcon = `<i class="bi bi-person"></i>`
    let menuItems = [
        { id: "editBtn", label: "Modifier", icon: "bi-pencil" },
        { id: "deleteBtn", label: "Supprimer", icon: "bi-trash" }
    ];


    // *** Build html string to display in the block
    let htmlContent = `<div class="card shadow-sm  border border-1 component-block" >
        <div class="card-body p-2 mb-4 " >
                ${getBlocHeaderWithMenu(bloclabel, blocIcon, menuItems)}
                <div class="card-title block-bodycontent" id="customerBloc">
                    <!-- example of a block-bodycontent -->
                
                </div>
            </div >
        <div>`;

    // *** Display html string in the document
    document.querySelector("#" + htmlPlaceid).innerHTML = htmlContent;

    let htmlContent2 = `
     <form>
        ${getStandardFieldDisplay("Name", params.name)}
         ${getStandardFieldDisplay("adresse", params.address)}       
         </br><hr/>

         ${getEditField("Ville", "townid", "", "Veuillez saisir la ville", "saisir la ville")}
       </br>
        <div id="selector1"></div>
        </br>
        <div id="autocomplete1"></div>

        
    </form>
     </br><hr/>
    <div class="col-2">
    <button class="btn btn-secondary" id="testbutton"> bouton de test </button>
    </div>
    `

    document.querySelector("#customerBloc").innerHTML = htmlContent2;

    let selector1 = new DropdownSelector('#selector1', {
        apiUrl: 'https://kusala.fr/dolibarr/api/index.php/products',
        apiKey: 'OpK1D8otonWg690PIoj570KdHSCqCc04',
        placeholder: 'Choisissez un produit (dropdown)'
    })

    const autocomplete1 = new AutocompleteSelector('#autocomplete1', {
        apiUrl: 'https://kusala.fr/dolibarr/api/index.php/products',
        apiKey: 'OpK1D8otonWg690PIoj570KdHSCqCc04',
        placeholder: 'Tapez pour rechercher un produit (autocomplete)...'
    });

    // *** add event handlers
    let testbutton = document.getElementById('testbutton');
    testbutton.addEventListener('click', (event) => {
        console.log("click on testbutton 1");
        modalFunctionViewDisplay("modalSection")
    });
}

function displayblockname2Content(htmlPlaceid, params) {
    // *** Build html string to display in the block
    let htmlContent = `<div id="#blockName2"'>test block 2</div>`


    document.querySelector("#" + htmlPlaceid).innerHTML = htmlContent;
}

