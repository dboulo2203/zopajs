// *** Component ressources
// import { getCustomer, getCustomerOrders } from './customerService.js'

// *** Shared ressoucres
import { headerViewDisplay } from '../../shared/components/global/headerViewCont.js'//***  shared ressources
import { getProducts, getintakeplacesTypesFromAPI, getMealTypesFromAPI, getIncomeLevelsTypesFromAPI, getPublipostageTypesFromAPI } from '../../shared/services/productService.js'
import { loadTranslations } from '../../shared/services/translationService.js'
import { addMultipleEnventListener, getAppPath } from '../../shared/functions/commonFunctions.js'
/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startcomponentFrameController() {

    // *** Initialisations
    try {

        await loadTranslations();
        await getProducts();
        await getintakeplacesTypesFromAPI();
        await getMealTypesFromAPI();
        await getIncomeLevelsTypesFromAPI();
        await getPublipostageTypesFromAPI();

        headerViewDisplay("#menuSection");

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }

    // *** Get url params and launch controller
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('componentFrameID'))
        displaycomponentFrameContent("mainActiveSection", searchParams.get('componentFrameID'));
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displaycomponentFrame(htlmPartId, customerID) {

    // *** Display the controller skeleton
    let initString = `
    <div style="padding-top:10px"><p class="fs-5" style="color:#8B2331">Customer</p></div><hr/>
    <div id='componentMessage'></div>
    
          <div class="row" id="customerIdentity" > Customer identity    
           </div>

           <div class="row" id="customerOrders"> 
           </div>
    </div>
    `;
    document.querySelector("#" + htlmPartId).innerHTML = initString;

    try {

        // *** Load data from API
        let componentFrame = await getComponentFrame(componentFrameID);

        let output = '';

        // *** Display entity
        output += `<div style="margin-bottom:10px">`;
        output += `<div style="padding-top:10px;padding-bottom:5px"><span class="fs-6" style="color:#8B2331">componentFrame</span></div>`;
        output += `<div class="col-md-12 main" " > <span class="fw - light" style ="color:grey">Nom</span> : ${customer.name}`;
        output += `</div>`
        output += `<div class="col-md-12 main"  > <span class="fw-light" style ="color:grey">Adresse</span> : ${customer.address}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Zip</span> :  ${customer.zip}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Ville</span> :  ${customer.town}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey"></span> </div>`;
        output += `</div>`;
        output += `<hr/>`;

        output += `<div style="padding-top:10px"><p class="fs-6" style="color:#8B2331">Customer orders</p></div>`;

        // document.querySelector("#customerIdentity").innerHTML = output;

        // let customerOrdersString = '';
        // if (customerOrders) {
        //     customerOrders.map((customerOrder, index) => {
        //         customerOrdersString += `
        //             <div class="row">

        //                 <div class="col-2" > 
        //                     <span class="customerLink"  orderID="${customerOrder.id}"style="cursor: pointer">${customerOrder.ref}</span>
        //                 </div> 

        //                 <div class="col-4">
        //                     ${getevaluateSession(customerOrder, true)}
        //                 </div>      

        //                <div class="col-2">
        //                     ${new Intl.DateTimeFormat("fr-FR",
        //             {
        //                 year: "numeric",
        //                 month: "numeric",
        //                 day: "numeric",
        //             }).format(customerOrder.date_creation * 1000)}
        //                 </div>

        //                 <div class="col-2"> 
        //                     ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumSignificantDigits: 3, maximumFractionDigits: 2 }).format(customerOrder.total_ttc)}
        //                 </div> 

        //                 <div class="col-2">   
        //                     ${customerOrder.statut == 3 ? 'Clôturé' : customerOrder.statut == 1 ? 'Validé' : customerOrder.statut == 0 ? 'Brouillon' : customerOrder.statut == -1 ? 'Annulée' : 'Inconnu'}                            
        //                 </div>
        //              </div>
        //             <hr/>`;

        //     });
        // } else {
        //     customerOrdersString += `
        //     <div class="row">
        //     <div class="col-3" > 
        //         <span class="customerLink" >Pas de commande pour cet adhérent</span>
        //     </div> 
        //     </div><hr/>`;
        // }

        // document.querySelector("#customerOrders").innerHTML = customerOrdersString;

        // *** Add actions
        addMultipleEnventListener(".componentsubFrameLink", function () {
            console.log("click person details");
            window.location.href = `${getAppPath()}/componentsubFrame/componentsubFrame/componentsubFrame.html?componentsubFrameID=` + $(this).attr('orderID') + `&indep=false`;
            // launchNoticeController(mainDisplay, $(this).attr('searid'));
        });




    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }

}

//*** Function needed */