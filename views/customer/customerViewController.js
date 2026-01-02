// *** Component ressources
import { getCustomer, getCustomerOrders, getCustomerInvoices } from './customerService.js'

// *** Shared ressoucres
import { headerViewDisplay } from '../../shared/services/headerViewCont.js'//***  shared ressources
import { addMultipleEnventListener, getAppPath } from '../../shared/services/commonFunctions.js'
import { launchInitialisation } from '../../shared/services/initialisationService.js'
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
        // *** Display the controller skeleton
        let initString = `
        <div style="padding-top:10px"><p class="fs-5" style="color:#8B2331">Customer</p></div><hr/>
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

        // *** Display customer
        let customer = await getCustomer(customerID);
        let output = '';
        output += `<div style="margin-bottom:10px">`;
        output += `<div style="padding-top:10px;padding-bottom:5px"><span class="fs-6" style="color:#8B2331">Customer Identity</span></div>`;
        output += `<div class="col-md-12 main" " > <span class="fw - light" style ="color:grey">Nom</span> : ${customer.name}`;
        output += `</div>`
        output += `<div class="col-md-12 main" " > <span class="fw - light" style ="color:grey">email</span> : ${customer.email}`;
        output += `</div>`

        output += `<div class="col-md-12 main"  > <span class="fw-light" style ="color:grey">Adresse</span> : ${customer.address}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Zip</span> :  ${customer.zip}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Ville</span> :  ${customer.town}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Téléphone</span> :  ${customer.phone}</div>`;


        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Niveau de revenu</span> :  ${customer.price_level}</div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Adhésion </span> : </div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="color:grey">Publipostage  </span> : </div>`;
        output += `<div class="col-md-12 main"> <span class="fw-light" style ="">Adhérent créé par
             xxxxxx, 
            ${new Intl.DateTimeFormat("fr-FR",
            {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }).format(customer.date_creation * 1000)}
                et modifié par 
            xxxxx, 
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
        output += `<hr/>`;

        output += `<div style="padding-top:10px"><p class="fs-6" style="color:#8B2331">Customer orders</p></div>`;

        document.querySelector("#customerIdentity").innerHTML = output;

        // *** Display customer orders
        let customerOrders = await getCustomerOrders(customerID);
        let customerOrdersString = '';
        if (customerOrders) {
            customerOrders.map((customerOrder, index) => {
                customerOrdersString += `
                    <div class="row">

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
                     </div>
                    `;

            });
        } else {
            customerOrdersString += `
            <div class="row">
                <div class="col-6" > 
                    <span class="customerLink" >Pas de commande pour cet adhérent</span>
                </div> 
            </div>`;
        }
        document.querySelector("#customerOrders").innerHTML = customerOrdersString;

        // *** Display customer invoices
        let customerInvoices = await getCustomerInvoices(customerID);
        let customerInvoicesString = '';
        customerInvoicesString += `<hr/>`;
        customerInvoicesString += `<div style="padding-top:10px"><p class="fs-6" style="color:#8B2331">Customer Invoices</p></div>`;

        if (customerInvoices) {
            customerInvoices.map((customerInvoice, index) => {
                customerInvoicesString += `
                 <div class="row">

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
                        </div>      
                                         
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

                     </div>
                   `;

            });
        } else {
            customerInvoicesString += `
            <div class="row">
            <div class="col-6" > 
                <span class="customerLink" >Pas de facture pour cet adhérent</span>
            </div> 
            </div>`;
        }
        document.querySelector("#customerInvoices").innerHTML = customerInvoicesString;



        // *** Add actions
        addMultipleEnventListener(".orderLink", function (event) {
            // console.log("click person details");
            window.location.href = `${getAppPath()}/views/order/order.html?orderID=` + event.currentTarget.getAttribute('orderID') + `&indep=false`;
        });

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }

}

//*** Function needed */

/**
 * Get the summary of the session (date, course name, options )
 * @param {*} order 
 * @param {*} fullDescription : true if options are requested
 * @returns 
 */
export function getevaluateSession(order, fullDescription) {
    // Fulldescription : the function must returns the session and the product list
    let session = "";
    let otherProducts = [];
    order.lines.forEach((orderLine, index) => {
        if (orderLine.ref) {
            if (orderLine.ref.startsWith('STA')) {
                // *** Build a session label with short date and libelle
                let dateDebut = new Intl.DateTimeFormat("fr-FR",
                    {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                    }).format(orderLine.array_options.options_lin_datedebut * 1000);


                session = dateDebut + " - " + orderLine.libelle
            } else {
                // *** if the product is not a session, keep the products used in the order
                if (otherProducts.find(element => element === orderLine.ref.substring(0, 3)) === undefined)
                    otherProducts.push(orderLine.ref.substring(0, 3));
            }
        }
    });
    if (fullDescription)
        return session + " - " + otherProducts.join(', ');
    else
        if (session)
            return session;
        else
            return otherProducts.join(', ');
}