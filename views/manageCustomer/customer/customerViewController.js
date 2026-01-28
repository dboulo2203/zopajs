// *** Component ressources
import { getCustomer, getCustomerOrders, getCustomerInvoices } from '../../../shared/services/zopaCustomerServices.js'
import { createNewOrder } from '../../../shared/services/zopaOrderServices.js';

import { headerViewDisplay } from '../../appservices/headerViewCont.js'//***  shared ressources
import { launchInitialisation } from '../../appservices/initialisationService.js'

import { isCurrentUSerLogged } from '../../../shared/services/zopaLoginServices.js'
import { addMultipleEnventListener, getAppPath, displayToast } from '../../../shared/services/commonFunctions.js'
import { getUserLoginFromId, getSelectFromDatabaseList, getSelectFromDatabaseListDropdown, getvalue } from '../../../shared/services/zopaListsServices.js'
import { personIcon, orderIcon, addOrderIcon, threedotsvertical, invoiceIcon } from '../../../shared/assets/constants.js'
import { getevaluateSession } from '../../../shared/services/zopaOrderServices.js'
/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startCustomerController() {

    // *** Initialisations
    //   try {

    launchInitialisation();
    headerViewDisplay("#menuSection");

    if (!isCurrentUSerLogged())
        throw new Error("Veuillez vous authentifier");

    // *** Get url params and launch controller
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('customerID'))
        displayCustomerContent("mainActiveSection", searchParams.get('customerID'));

    // } catch (error) {
    //     document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    // }
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayCustomerContent(htlmPartId, customerID) {


    // *** Get customer
    let customer = await getCustomer(customerID);

    let customerOrders = await getCustomerOrders(customerID);
    if (customerOrders != null)
        customerOrders.sort((a, b) => b.date_creation - a.date_creation);

    let customerInvoices = await getCustomerInvoices(customerID);
    if (customerInvoices != null)
        customerInvoices.sort((a, b) => b.date_creation - a.date_creation);
    // *** Display the controller skeleton
    let initString = `
        <div style="padding-top:10px"><span class="fs-5" style="color:#8B2331">${personIcon} Customer</span></div>
        <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:5px;margin-bottom:20px" />
        <div id='componentMessage'></div>
        
            <div class="row" id="customerIdentity" > Customer identity    
            </div>

            <div class="row" id="customerOrders" style="margin-top:20px"> 
            </div>
            <div class="row" id="customerInvoices" style="margin-top:20px">
            </div>

            </div>
    `;
    document.querySelector("#" + htlmPartId).innerHTML = initString;

    document.querySelector("#customerIdentity").innerHTML = displayCustomerIdentity(customer);

    document.querySelector("#customerOrders").innerHTML = displayCustomerorders(customer, customerOrders);

    document.querySelector("#customerInvoices").innerHTML = displayCustomerInvoices(customer, customerInvoices);

    // *** Add actions
    addMultipleEnventListener(".orderLink", function (event) {
        window.location.href = `${getAppPath()}/views/manageCustomer/order/order.html?orderID=` + event.currentTarget.getAttribute('orderID') + `&indep=false`;
    });

    // *** Add actions
    addMultipleEnventListener(".invoiceLink", function (event) {
        window.location.href = `${getAppPath()}/views/manageCustomer/invoice/invoice.html?invoiceID=` + event.currentTarget.getAttribute('invoiceID') + `&indep=false`;
    });

    document.querySelector("#addOrder").onclick = function (event) {
        try {
            createNewOrder(customer.id);
            displayCustomerContent(htlmPartId, customerID);
            displayToast("messageSection", "Adhérent", "La commande a été créée")

        } catch (error) {
            document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}  </div > `;
        }
    }
}

/**
 * Display customer identity
 * @param {*} customer 
 * @returns 
 */
function displayCustomerIdentity(customer) {
    let output = '';
    output += `<div style="margin-bottom:2px">`;
    // output += `
    //     <div style=""><span class="fs-5" style="color:#8B2331">Customer Identity</span></div>
    //     <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;

    output += `<dob-bloctitle userIcon = "invoiceIcon" userName = "Customer Identity" ></dob-bloctitle >`;
    output += `<div class="col-md-12 main"  > <span  class="fw-light" style ="">Nom</span> : ${customer.name}`;
    output += `</div>`
    output += `<div class="col-md-12 main"  > <span class="fw-light" style ="">email</span> : ${customer.email}`;
    output += `</div>`

    output += `<div class="col-md-12 main"  > <span class="fw-light" style ="">Adresse</span> : ${customer.address}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Zip</span> :  ${customer.zip}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Ville</span> :  ${customer.town}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Téléphone</span> :  ${customer.phone}</div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Niveau de revenu</span> :  ${customer.price_level}</div>`;
    // output += `
    //     <!--  <div class="col-md-6">
    //         <div class="form-group row" style="margin-bottom:5px">
    //         <label for="inputPublisherDrop" class="col-sm-4 col-form-label " >
    //             <span id="deletePublisherSelection" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Remove publisher selection"> </span>
    //             Niveau de revenu
    //         </label>
    //        <div class="dropdown col-sm-8 " id="inputPublisherDrop">
    //             <span class="dropdown-toggle" type="button" id="PublisherSpan" selectedid="0"  style="width:100%;border-bottom:solid 0.05rem #e9e8e8" data-bs-toggle="dropdown" aria-expanded="false">
    //             </span>
    //             <ul class="dropdown-menu pt-0" aria-labelledby="dropdownMenuButton1" id="dropdown-menuPublisher">
    //                 <input type="text" class="form-control border-0 border-bottom shadow-none mb-2" placeholder="Search..." id="searchPublisher">
    //             </ul>
    //         </div>

    //     </div > --> `;

    // output += `< div class="col-md-12 main" > <span class="fw-light" style="">Niveau de revenu</span> :
    //   ${customer.price_level}
    //     <select class="form-select form-select-sm"  aria-label="Default select example" id="bdd_language">
    //     ${getSelectFromDatabaseListDropdown("incomeLevels", "row_id", "label", customer.price_level)}
    //     </select>

    //   </div>`;
    //    <!-- <div class="col-sm-9 ">
    //     <span class="dropdown-toggle" type="button" style="width:100%;border-bottom:solid 0.05rem #e9e8e8" type="button" data-bs-toggle="dropdown" id="inputGenre_span" selectedId=""> </span>
    //     <ul class="dropdown-menu" id="">
    //         ${getSelectFromDatabaseListDropdown("incomeLevels", "rowid", customer.price_level)}

    //     </ul > ${getvalue("incomeLevels", "rowid", customer.price_level)}
    // </div > -->
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Adhésion </span> : </div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Publipostage  </span> : </div>`;
    output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Adhérent créé par
             ${getUserLoginFromId(customer.user_creation)}, le
            ${new Intl.DateTimeFormat("fr-FR",
        {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(customer.date_creation * 1000)}, modifié par 
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

    // let customerOrdersString = `
    //     <div style="margin-bottom:0px">
    //         <div class="d-flex  justify-content-between" style="padding-top:0px" >
    //             <span class="fs-5" style="color:#8B2331">${orderIcon} Customer orders</span>
    //             <div class="col-4 flex float-right text-end" style="cursor: pointer">
    //                 <div class="dropdown">
    //                     <a href="#" data-bs-toggle="dropdown" aria-expanded="false" style="">${threedotsvertical}  </a>
    //                     <ul class="dropdown-menu" style="padding:4px;background-color:#F7F7F3">
    //                         <li id="addOrder"><span>${addOrderIcon} Ajouter une commande</span></li>
    //                     </ul>
    //                 </div>                         
    //             </div>                          
    //         </div>
    //     </div>
    //     <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    let customerOrdersString = `<dob-bloctitle userIcon = "orderIcon" userName = " Customer orders" ></dob-bloctitle >`;

    // *** Display customer orders

    // let customerOrdersString = '';
    if (customerOrders) {
        customerOrders.map((customerOrder, index) => {
            customerOrdersString += `
            <div class="row flex " style = "margin-top:0px" >
                        <div class="col d-none d-md-block" >
                            <span class="orderLink text-danger-emphasis"  orderID="${customerOrder.id}"style="cursor: pointer">${customerOrder.ref}</span>
                        </div> 
                       
                        <div class="col-5">
                            <span class="orderLink"  orderID="${customerOrder.id}"style="cursor: pointer">${getevaluateSession(customerOrder, true)}</span>
                        </div>      
                                         
                       <div class="col d-none d-md-block">
                            ${new Intl.DateTimeFormat("fr-FR",
                {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }).format(customerOrder.date_creation * 1000)}
                        </div>
                        
                        <div class="col"> 
                            ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(customerOrder.total_ttc)}
                        </div> 

                        <div class="col">   
                            ${customerOrder.statut == 3 ? 'Clôturé' : customerOrder.statut == 1 ? 'Validé' : customerOrder.statut == 0 ? 'Brouillon' : customerOrder.statut == -1 ? 'Annulée' : 'Inconnu'}                            
                        </div>
                     </div >
                ${index < customerOrders.length - 1 ? '<hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:5px" />' : ''}

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
    // customerInvoicesString += `
    //     <div style="margin-bottom:20px">
    //         <div class="d-flex  justify-content-between" style="padding-top:0px" >
    //             <span class="fs-5  fw-normal" style="color:#8B2331">${invoiceIcon} Customer Invoices</span>
    //             <div class="col-4 flex float-right text-end" style="cursor: pointer">
    //                 <div class="dropdown">
    //                     <a href="#" data-bs-toggle="dropdown" aria-expanded="false" style="">${threedotsvertical}  </a>
    //                     <ul class="dropdown-menu" style="padding:4px;background-color:#F7F7F3">
    //                         <li id="addOrder"><span>${addOrderIcon} Ajouter une commande</span></li>
    //                     </ul>
    //                 </div>                         
    //             </div>                          
    //         </div>

    //      <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;

    customerInvoicesString += `<dob-bloctitle userIcon = "invoiceIcon" userName = "Customer Invoices" ></dob-bloctitle >`;
    if (customerInvoices) {
        customerInvoices.map((customerInvoice, index) => {
            customerInvoicesString += `
                <div class="row" style = "margin-bottom:5px" >

                    <div class=" col d-none d-md-block" >
                        <span class="invoiceLink text-danger-emphasis" invoiceID="${customerInvoice.id}" style="cursor: pointer">${customerInvoice.ref}</span>
                    </div> 
                       
                    <div class="col">
                    ${customerInvoice.type === "3" ? "Acompte" : customerInvoice.type === "2" ? "creditnote" : customerInvoice.type === "0" ? "Standard" : "Type facture inconnu"}
                        </TableCell>
                    </div >      
                                         
                    <div class="col d-none d-md-block ">
                        ${new Intl.DateTimeFormat("fr-FR", {
                year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric",
            }).format(customerInvoice.date_creation * 1000)}
                    </div>
                        
                    <div class="col "> 
                        ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(customerInvoice.total_ttc)}
                    </div> 

                    <div class="col">
                            ${customerInvoice.statut === "2" ? "Payée" : customerInvoice.statut === "1" ? "Validée" : customerInvoice.statut === "0" ? "Brouillon" : customerInvoice.statut === "3" ? "Annulée" : "Statut inconnu"}
                    </div>
                </div >
                ${index < customerInvoices.length - 1 ? '<hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:10px" />' : ''}
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