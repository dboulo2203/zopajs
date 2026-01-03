// *** Component ressources
import { getCustomer, getCustomerOrders, getCustomerInvoices } from '../../shared/services/zopaCustomerServices.js'
import { createNewOrder } from '../../shared/services/zopaOrderServices.js';

// *** Shared ressoucres
import { headerViewDisplay } from '../../shared/services/headerViewCont.js'//***  shared ressources
import { addMultipleEnventListener, getAppPath, getLinkWithctrl } from '../../shared/services/commonFunctions.js'
import { launchInitialisation } from '../../shared/services/initialisationService.js'
import { getUserLoginFromId } from '../../shared/services/zopaListsServices.js'
import { personIcon, orderIcon, addOrderIcon, threedotsvertical } from '../../shared/assets/constants.js'
import { getevaluateSession } from '../../shared/services/zopaOrderServices.js'
/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startCustomerController() {

    // *** Initialisations
    try {

        launchInitialisation();
        headerViewDisplay("#menuSection");

        // *** Get url params and launch controller
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('customerID'))
            displayCustomerContent("mainActiveSection", searchParams.get('customerID'));

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayCustomerContent(htlmPartId, customerID) {

    try {
        // *** Get customer
        let customer = await getCustomer(customerID);

        let customerOrders = await getCustomerOrders(customerID);
        customerOrders.sort((a, b) => b.date_creation - a.date_creation);

        let customerInvoices = await getCustomerInvoices(customerID);
        customerInvoices.sort((a, b) => b.date_creation - a.date_creation);
        // *** Display the controller skeleton
        let initString = `
        <div style="padding-top:10px"><span class="fs-5" style="color:#8B2331">${personIcon} Customer</span></div>
        <div id='componentMessage'></div>
        
            <div class="row" id="customerIdentity" > Customer identity    
            </div>

            <div class="row" id="customerOrders"> 
            </div>
            <div class="row" id="customerInvoices">
            </div>

            </div>
    `;
        document.querySelector("#" + htlmPartId).innerHTML = initString;

        document.querySelector("#customerIdentity").innerHTML = displayCustomerIdentity(customer);

        document.querySelector("#customerOrders").innerHTML = displayCustomerorders(customer, customerOrders);

        document.querySelector("#customerInvoices").innerHTML = displayCustomerInvoices(customer, customerInvoices);


        // *** Add actions
        addMultipleEnventListener(".orderLink", function (event) {
            window.location.href = `${getAppPath()}/views/order/order.html?orderID=` + event.currentTarget.getAttribute('orderID') + `&indep=false`;
        });

        document.querySelector("#addOrder").onclick = function (event) {
            try {

                createNewOrder(customer.id);
                displayCustomerContent(htlmPartId, customerID);
            } catch (error) {
                document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}  </div > `;
            }


        }



    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}   </div > `;
    }

}

/**
 * Display customer identity
 * @param {*} customer 
 * @returns 
 */
function displayCustomerIdentity(customer) {
    let output = '';
    output += `<div style="margin-bottom:10px">`;
    output += `<hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:15px" />
        <div style=""><span class="fs-6" style="color:#8B2331">Customer Identity</span></div>`;
    output += `<div class="col-md-12 main"  > <span  class="fw-light" style ="color:grey">Nom</span> : ${customer.name}`;
    output += `</div>`
    output += `<div class="col-md-12 main"  > <span class="fw - light" style ="color:grey">email</span> : ${customer.email}`;
    output += `</div>`

    output += `<div class="col-md-12 main"  > <span class="fw-light" style ="color:grey">Adresse</span> : ${customer.address}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Zip</span> :  ${customer.zip}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Ville</span> :  ${customer.town}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Téléphone</span> :  ${customer.phone}</div>`;


    output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Niveau de revenu</span> :  ${customer.price_level}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Adhésion </span> : </div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Publipostage  </span> : </div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Adhérent créé par
             ${getUserLoginFromId(customer.user_creation)}, le
            ${new Intl.DateTimeFormat("fr-FR",
        {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(customer.date_creation * 1000)}
                ${getUserLoginFromId(customer.user_modification)}, le
            ${new Intl.DateTimeFormat("fr-FR",
            {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }).format(customer.date_modification * 1000)}

            </span> </div>`;
    output += `</div>`;
    output += ``;

    return output;
    // document.querySelector("#customerIdentity").innerHTML = output;
}

/**
 * Display customer orders
 * @param {*} customer 
 * @param {*} customerOrders 
 * @returns 
 */
function displayCustomerorders(customer, customerOrders) {
    let customerOrdersString = `<div style="margin-bottom:10px">
        <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:15px" />
        
        <div class="d-flex  justify-content-between" style="padding-top:0px" >
            <span class="fs-6" style="color:#8B2331">${orderIcon} Customer orders</span>
                    <div class="col-4 flex float-right text-end" style="cursor: pointer">
                        <div class="dropdown">
                            <a href="#" data-bs-toggle="dropdown" aria-expanded="false" style="color:black">${threedotsvertical}  </a>
                            <ul class="dropdown-menu" style="padding:4px;background-color:#F7F7F3">
                                <li id="addOrder"><span>${addOrderIcon} Ajouter une commande</span></li>
                            </ul>
                        </div>                         
                    </div>                          

            </div>`;

    // document.querySelector("#customerIdentity").innerHTML = output;


    // *** Display customer orders

    // let customerOrdersString = '';
    if (customerOrders) {
        customerOrders.map((customerOrder, index) => {
            customerOrdersString += `
            <div class="row" style = "margin-top:5px" >

                        <div class="col-2" > 
                            <span class="orderLink"  orderID="${customerOrder.id}"style="cursor: pointer">${customerOrder.ref}</span>
                        </div> 
                       
                        <div class="col-6">
                            ${getevaluateSession(customerOrder, true)}
                        </div>      
                                         
                       <div class="col-2">
                            ${new Intl.DateTimeFormat("fr-FR",
                {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }).format(customerOrder.date_creation * 1000)}
                        </div>
                        
                        <div class="col-1"> 
                            ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(customerOrder.total_ttc)}
                        </div> 

                        <div class="col-1">   
                            ${customerOrder.statut == 3 ? 'Clôturé' : customerOrder.statut == 1 ? 'Validé' : customerOrder.statut == 0 ? 'Brouillon' : customerOrder.statut == -1 ? 'Annulée' : 'Inconnu'}                            
                        </div>
                     </div >
            `;

        });
    } else {
        customerOrdersString += `
            <div class="row" >
                <div class="col-6" >
                    <span class="customerLink" >Pas de commande pour cet adhérent</span>
                </div> 
            </div > `;
    }
    return customerOrdersString;
    // document.querySelector("#customerOrders").innerHTML = customerOrdersString;
}

/**
 * Display customer invoices
 * @param {*} customer 
 * @param {*} customerInvoices 
 * @returns 
 */
function displayCustomerInvoices(customer, customerInvoices) {
    // *** Display customer invoices

    let customerInvoicesString = '';
    customerInvoicesString += `
            <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:15px" />
                <div style=""><p class="fs-6" style="color:#8B2331">Customer Invoices</p></div>`;

    if (customerInvoices) {
        customerInvoices.map((customerInvoice, index) => {
            customerInvoicesString += `
                    <div class="row" style = "margin-bottom:5px" >

                        <div class="col-2" >
                            <span class="" orderID="${customerInvoice.id}"style="cursor: pointer">${customerInvoice.ref}</span>
                        </div> 
                       
                        <div class="col-4">
                            ${customerInvoice.type === "3"
                    ? "deposit"
                    : customerInvoice.type === "2"
                        ? "creditnote"
                        : customerInvoice.type === "0"
                            ? "standard"
                            : "Type facture inconnu"}
                        </TableCell>
                        </div >      
                                         
                       <div class="col-2">
                            ${new Intl.DateTimeFormat("fr-FR",
                                {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }).format(customerInvoice.date_creation * 1000)}
                        </div>
                        
                        <div class="col-2"> 
                            ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(customerInvoice.total_ttc)}
                        </div> 

                        <div class="col-2">
                         ${customerInvoice.statut === "2" ?
                    "paid"
                    : customerInvoice.statut === "1" ?
                        "validated"
                        : customerInvoice.statut === "0" ?
                            "draft"
                            : customerInvoice.statut === "3"
                                ? "cancelled"
                                : "Statut inconnu"
                }
                        </div>

                     </div >
            `;

        });
    } else {
        customerInvoicesString += `
            <div class="row" >
                <div class="col-6" >
                    <span class="customerLink" >Pas de facture pour cet adhérent</span>
                </div> 
            </div > `;
    }

    return customerInvoicesString;
}