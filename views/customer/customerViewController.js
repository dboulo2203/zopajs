// *** Component ressources
import { getCustomer, getCustomerOrders } from './customerService.js'

// *** Shared ressoucres
import { headerViewDisplay } from '../../shared/components/global/headerViewCont.js'//***  shared ressources
import { getProducts, getintakeplacesTypesFromAPI, getMealTypesFromAPI, getIncomeLevelsTypesFromAPI, getPublipostageTypesFromAPI } from '../../shared/services/productService.js'
import { loadTranslations } from '../../shared/services/translationService.js'
/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startCustomerController() {

    try {
        // *** Initialisations
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

    // *** Get url params
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('customerID'))
        displayCustomerContent("mainActiveSection", searchParams.get('customerID'));
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayCustomerContent(htlmPartId, customerID) {

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

    // *** Display skeleton
    document.querySelector("#" + htlmPartId).innerHTML = initString;

    try {


        // *** Load data from API
        let customer = await getCustomer(customerID);
        let customerOrders = await getCustomerOrders(customerID);

        let output = '';

        // *** Notice titles
        output += `<div style="margin-bottom:10px">`;
        output += `<div style="padding-top:10px;padding-bottom:5px"><span class="fs-6" style="color:#8B2331">Customer Identity</span></div>`;
        output += `<div class="col-md-12 main" " > <span class="fw - light" style ="color:grey">Nom</span> : ${customer.name}`;
        output += `</div>`
        output += `<div class="col-md-12 main"  > <span class="fw-light" style ="color:grey">Adresse</span> : ${customer.address}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Zip</span> :  ${customer.zip}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Ville</span> :  ${customer.town}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey"></span> </div>`;
        output += `</div>`;
        output += `<hr/>`;

        output += `<div style="padding-top:10px"><p class="fs-6" style="color:#8B2331">Customer orders</p></div>`;

        document.querySelector("#customerIdentity").innerHTML = output;

        // output += JSON.stringify(customerOrders);
        let customerOrdersString = '';
        if (customerOrders) {
            customerOrders.map((customerOrder, index) => {
                customerOrdersString += `
                    <div class="row">
                        <div class="col-2" > 
                            <span class="customerLink" customerid="${customerOrder.total_ttc}" style="cursor: pointer">${customerOrder.ref}</span>
                        </div> 
                        <div class="col-2"> 
                            ${new Intl.NumberFormat("fr-FR",
                    {
                        style: "currency", currency: "EUR", maximumSignificantDigits: 3,
                        maximumFractionDigits: 2
                    }).format(customerOrder.total_ttc)}

                        </div> 
                        <div class="col-2">   
                        ${customerOrder.statut == 3 ? 'Clôturé' : customerOrder.statut == 1 ? 'Validé' : customerOrder.statut == 0 ? 'Brouillon' : customerOrder.statut == -1 ? 'Annulée' : 'Inconnu'}
                            
                        </div>
                        <div class="col-2">
                            ${new Intl.DateTimeFormat("fr-FR",
                        {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                        }).format(customerOrder.date_creation * 1000)}

                        </div>
                    </div>
                    <hr/>`;

            });
        } else {
            customerOrdersString += `
            <div class="row">
            <div class="col-3" > 
                <span class="customerLink" >Pas de commande pour cet adhérent</span>
            </div> 
            </div><hr/>`;
        }



        // *** Display skeleton  //    ${result.address}, ${result.zip}, ${result.town} 
        document.querySelector("#customerOrders").innerHTML = customerOrdersString;


        // //***  Actions
        // document.querySelector("#searchString").addEventListener("keypress", function (event) {
        //     if (event.keyCode === 13) {
        //         getSearch();
        //     }
        // });

        // document.querySelector("#myBtnCompute").onclick = async function () {
        //     getSearch();
        // };

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }

}

