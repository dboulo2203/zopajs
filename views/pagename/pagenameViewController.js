import { getCustomer } from '../../shared/zopaServices/zopaCustomerServices.js'
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js'
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js'
import { isCurrentUSerLogged } from '../../shared/zopaServices/zopaLoginServices.js';

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

function displayPagenameContent(htmlPlaceId, customerid) {

    // *** Get the data from the web services

    // *** Builf the html string to display in the mainActiveSection
    let htmlContent = `
        <div class="page-content">
            <div class="page-title">
                <div class="d-flex  justify-content-between page" style = "margin-top:0px" >
                        <span class="fs-4 text-danger-emphasis"  >${iconString} ${pageName}</span>
                    </div >
                    <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />
            </div>
            
            <div class="page-body">
                <div id ="blockName1"></div>
                <div id ="blockName2"></div>

            </div>
        </div>
    `;

    // *** display the mainActiveSection
    document.querySelector("#" + htmlPlaceId).innerHTML = htmlContent;

    // *** Display block1
    displayblockname1Content("blockName1", params);

    // *** Display block2
    displayblockname2Content("blockName2", params);

}


function displayblockname1Content(htmlPlaceid, params) {

    // *** Build html string to display in the block
    let htmlContent = `<div class="card shadow-sm  border border-1 component-block" >
        < div class="card-body p-2 mb-4 " >
                <div class="card-title block-title">
                    <div class="d-flex  justify-content-between ">
                        <span class="fs-5 text-danger-emphasis block-label" ><i class="bi bi-person"></i> ${bloc - label}</span>
                        <div class="col-8 flex float-right text-end bloc-menu" style="cursor: pointer">            
                            <div class="dropdown">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false" class="text-secondary" ><i class="bi bi-three-dots-vertical"></i> </a>
                                <ul class="dropdown-menu " style="padding:10px">
                                </ul>
                            </div>                   
                        </div>
                    </div>
                    <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />
                </div>
                <div class="card-title block-bodycontent">
                    <!-- example of a block-bodycontent -->
                    <button id="testbutton"> bouton de test </button>
                </div>
            </div >
        <div>`;

    // *** Display html string in the document
    document.querySelector("#" + htmlPlaceid).innerHTML = htmlContent;


    // *** add event handlers
    let testbutton = document.getElementById('testbutton');
    testbutton.addEventListener('click', (event) => {
        console.log("click on testbutton 1");
    });
}

function displayblockname2Content(htmlPlaceid, params) {
    // *** Build html string to display in the block
    let htmlContent = `<div id="#blockName2"'>test block 2</div>`


    document.querySelector("#" + htmlPlaceid).innerHTML = htmlContent;
}

