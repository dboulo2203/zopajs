// *** Component ressources
import { getOrder } from './orderService.js'

// *** Shared ressoucres
import { headerViewDisplay } from '../../shared/services/headerViewCont.js'//***  shared ressources
import { getProducts, getintakeplacesTypesFromAPI, getMealTypesFromAPI, getIncomeLevelsTypesFromAPI, getPublipostageTypesFromAPI } from '../../shared/services/productService.js'
import { loadTranslations } from '../../shared/services/translationService.js'
// import { addMultipleEnventListener } from '../../shared/functions/commonFunctions.js'


const threedotsvertical = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
</svg>`;

/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startOrderController() {

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
    if (searchParams.has('orderID'))
        displayOrderContent("mainActiveSection", searchParams.get('orderID'));
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayOrderContent(htlmPartId, orderID) {

    // *** Display the controller skeleton
    let initString = `
    <div style="padding-top:10px"><p class="fs-5" style="color:#8B2331">Order</p></div><hr/>
    <div id='componentMessage'></div>
    
          <div class="row" id="orderIdentity" >   
           </div>

           <div class="row" id="orderLines"> 
           </div>

           <div class="row" id="linkedInvoices">
           </div>



        

    </div>
    `;
    document.querySelector("#" + htlmPartId).innerHTML = initString;

    try {

        // *** Load data from API
        let order = await getOrder(orderID);

        console.log(JSON.stringify(order));
        let output = '';

        // *** Display order
        output += `<div style="margin-bottom:10px">`;
        output += `<div style="padding-top:0px;padding-bottom:5px"><span class="fs-6" style="color:#8B2331">Order Identity</span></div>`;
        output += `<div class="col-md-12 main"  > <span class="fw - light" style ="color:grey">Ref. commande : </span> : ${order.ref} </div >`;
        output += `<div class="col-md-12 main"  > <span class="fw - light" style ="color:grey">Adhérent : </span> : ${order.customer.name}</div >`;
        output += `<div class="col-md-12 main"  > <span class="fw - light" style ="color:grey">Date commande : </span> :  ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(order.date_creation * 1000)} </div >`;
        output += `<div class="col-md-12 main"  > <span class="fw - light" style ="color:grey">Date modification : </span> :  ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(order.date_modification * 1000)}</div > `;
        output += `<div class="col-md-12 main" style =" margin-top:5px" > <span class="fw - light" style ="color:grey">Montant ttc : </span> : ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(order.total_ttc))}</div >`;
        output += `</div > `
        output += `</div > `;
        output += `<hr /> `;

        document.querySelector("#orderIdentity").innerHTML = output;


        // *** Display order lines
        let orderLInesString = '';
        orderLInesString += `<div style = "padding-bottom:5px" > <span class="fs-6" style="color:#8B2331">Order lines</span></div > `;


        if (order.lines) {
            order.lines.map((orderLine, index) => {
                orderLInesString += `
            <div class="row" style = "margin-bottom:5px" >

                        <div class="col-2" > 
                            <span   orderLineID="${orderLine.id}" style="cursor: pointer">${orderLine.ref}</span>
                        </div> 
                        
                         <div class="col-4" >
                            <span   orderLineID="${orderLine.id}"style="cursor: pointer">${orderLine.label}</span>
                        </div>     
                        
                        <div class="col-1" >
                            <span   orderLineID="${orderLine.id}"style="cursor: pointer">${orderLine.qty}</span>
                        </div>              
                               
                        <div class="col-1"> 
                            ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(orderLine.total_ttc))}
                        </div> 
                        <div class="col-1">
                            ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(orderLine.array_options.options_lin_datedebut * 1000)} 
                             </div> 

                       <div class="col-1">
                            ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(orderLine.array_options.options_lin_datefin * 1000)} 
                             </div> 

                             <!-- Action button -->
                       <div class="col-2 flex float-right text-end" style="cursor: pointer">
                              
                            <div class="dropdown">
                            <a href="#" data-bs-toggle="dropdown" aria-expanded="false">${threedotsvertical}  </a>

                            <ul class="dropdown-menu" style="padding:4px">
                                <li id="deleteLine">Supprimer ligne</li>
                                <li>Editer ligne</li>
                                <li>scinder ligne</li>
                                <li>Supprimer repas</li>
                            </ul>
                            </div>                         
                        </div>                          
                    </div >
            <hr style="color:grey" />
            `;

            });

        } else {
            orderLInesString += `
            < div class="row" >
                <div class="col-3" >
                    <span class="customerLink" >Pas de li   gne pour cette commande</span>
                </div> 
                    </div > <hr />`;
        }

        document.querySelector("#orderLines").innerHTML = orderLInesString;

        // *** Display order invoices
        let invoicesString = '';
        invoicesString += `<div style = "padding-bottom:5px" > <span class="fs-6" style="color:#8B2331">Invoices</span></div > `;

        if (order.linkedInvoices) {
            order.linkedInvoices.map((linkedInvoice, index) => {
                invoicesString += `
            <div class="row" style = "" >

                <div class="col-2" > 
                    <span   orderLineID="${linkedInvoice.id}" style="cursor: pointer">${linkedInvoice.ref}</span>
                </div> 
                <div class="col-2" > 
                    ${linkedInvoice.type === "3"
                        ? "Acompte"
                        : linkedInvoice.type === "2"
                            ? "Avoir"
                            : linkedInvoice.type === "0"
                                ? "Standard"
                                : "Type facture inconnu"}


                </div> 

                <div class="col-2">
                    ${new Date(linkedInvoice.date_creation * 1000).toLocaleString("fr-FR")}
                </div>

                <div class="col-2">
                    ${new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                }).format(linkedInvoice.total_ttc)}
                </div>

                <div class="col-2">
                    ${linkedInvoice.statut === "2" ?
                        '<span>Payée</span>'
                        : linkedInvoice.statut === "1" ?
                            '<span >Validée</span>'
                            : linkedInvoice.statut === "0" ?
                                '<span >Brouillon</span>'
                                : linkedInvoice.statut === "3"
                                    ? '<span >Abandonnée</span>'
                                    : "Statut inconnu"
                    }
                </div>

            </div>
            <hr style="color:grey" />
            `;

            });

        } else {
            invoicesString += `
            < div class="row" >
                <div class="col-3" >
                    <span class="customerLink" >Pas de facture pour cette commande</span>
                </div> 
                    </div > <hr />`;
        }

        document.querySelector("#linkedInvoices").innerHTML = invoicesString


        // *** Actions
        document.querySelector("#deleteLine").onclick = function () {
            console.log("deleteLine : ");
            // personEditModalDisplay(mainDisplay, person, function (status) {
            // });
        };
        ;
        // const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
        // const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl))

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `< div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }
}

//*** Function needed */

/**
 * 
 * @param {*} order 
 * @param {*} fullDescription 
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