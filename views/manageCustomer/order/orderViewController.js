// *** Component ressources
import {
    getOrder, getOrderBilledAmount, getOrderPaidAmount, getevaluateOrderGlobalStatus, getOrderRoomNotSet,
    getOrderhostingtaxesconsistancy, getOrderDatesQtyconsistancy, getOrderRepConsistancy
} from '../../../shared/zopaServices/zopaOrderServices.js'
import { isCurrentUSerLogged } from '../../../shared/zopaServices/zopaLoginServices.js'
import { getUserLoginFromId } from '../../../shared/zopaServices/zopaListsServices.js'

// *** Shared ressoucres
import { headerViewDisplay } from '../../../shared/zopaAppservices/headerViewCont.js'//***  shared ressources
import { launchInitialisation } from '../../../shared/zopaAppservices/initialisationService.js'
import {
    threedotsvertical, orderIcon, addOrderIcon, bedIcon, mealIcon, validateIcon, cancelIcon, plussquareIcon,
    pencilsquareIcon, closeOrderIcon, invoiceIcon
} from '../../../shared/assets/constants.js'
import { getLinkWithctrl, getAppPath, addMultipleEnventListener } from '../../../shared/services/commonFunctions.js'



/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startOrderController() {

    // *** Initialisations
    try {

        launchInitialisation();
        headerViewDisplay("#menuSection");

        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");

        // *** Get url params and launch controller
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('orderID'))
            displayOrderContent("mainActiveSection", searchParams.get('orderID'));

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayOrderContent(htlmPartId, orderID) {

    try {

        // *** Load data from API
        let order = await getOrder(orderID);

        // *** Display the controller skeleton
        let initString = `
            <div style="padding-top:60px" id="orderHeader">
                <span class="fs-5" style="color:#8B2331"> ${orderIcon} Order : ${order.ref}</span>
            </div>
            <hr/>
            <div id='componentMessage'></div>
            <div class="row" >
                <div class="col-12 col-md-5" id="orderIdentity" ></div>
                <div class="col-12 col-md-7" id="linkedInvoices" ></div>
            </div>

            <div class="row" id="orderLines" > 
            </div>
            `;
        document.querySelector("#" + htlmPartId).innerHTML = initString;

        displayOrderIdentity(order)

        // *** Display order lines
        displayOrderLines(order)

        // *** Display order invvoices
        displayOrderInvoices(order)

        // *** Actions
        document.querySelector("#customerLink").onclick = function (event) {
            getLinkWithctrl(`${getAppPath()}/views/manageCustomer/customer/customer.html?customerID=` + event.currentTarget.getAttribute('entityid'), event.ctrlKey);
        };
        addMultipleEnventListener(".invoiceLink", function (event) {
            window.location.href = `${getAppPath()}/views/manageCustomer/invoice/invoice.html?invoiceID=` + event.currentTarget.getAttribute('entityid');
        });

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }
}

//*** ************************************* */
/**
 * 
 * @param {*} order 
 * @returns 
 */
function displayOrderIdentity(order) {
    let output = ``;
    output += `
    <div id="orderIdentity" style="margin-bottom:20px">
        <dob-bloctitle id="bloc" usericon="bi-list-task" username="Details">
             <ul class="dropdown-menu " style="padding:10px;width:250px">
                <li id=""><span> Valider une commande</span></li>
                <li id=""><span> Ré-ouvrir la commande</span></li>
                <li id=""><span> Annuler la commande</span></li>
                <li id=""><span> Clôturer la commande</span></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li id=""><span> Générer un acompte</span></li>
                <li id=""><span> Facturer partiellement</span></li>
                <li id=""><span> Générer une facture</span></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li id=""><span> Afficher badge</span></li>
                <li id=""><span> Afficher devis</span></li>
            </ul>
        </dob-bloctitle>

        <dob-stdfieldwithlink fieldName="Adhérent : " fieldValue="${order.customer.name}" entityid="${order.socid}" fieldlink="customerLink">
        </dob-stdfieldwithlink>

        <dob-stdfield fieldName="Ref. commande" fieldValue="${order.ref}">
        </dob-stdfield>

        <dob-stdfield fieldName="Date création :" fieldValue="${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(order.date_creation * 1000)}">
        </dob-stdfield>

        <dob-stdfield fieldName="Acteurs :" fieldValue="Commande créée par
                    ${getUserLoginFromId(order.user_author_id)}, le
                    ${new Intl.DateTimeFormat('fr-FR',
        {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(order.date_creation * 1000)
        }
                        ,validée par ${getUserLoginFromId(order.user_valid)}, le
                    ${new Intl.DateTimeFormat('fr-FR',
            {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }).format(order.date_validation * 1000)
        } ">
        </dob-stdfield>

        <dob-stdfield fieldName= "Paiement : " fieldValue="${new Intl.NumberFormat("fr-FR",
            {
                style: "currency", currency: "EUR", maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }).format(parseFloat(order.total_ttc))}" >  
        </dob-stdfield>

        <dob-stdfield fieldName= "Paiement : " fieldValue="
            Facturé : ${new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR", maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }).format(parseFloat(getOrderBilledAmount(order)))},
                  Payé  ${new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR", maximumFractionDigits: 2,
                minimumFractionDigits: 2
            }).format(parseFloat(getOrderPaidAmount(order)))},
        </dob-stdfield> 

        <dob-stdfield fieldName= "Statut commande :" fieldValue="
            Statut commande : </span> : 
            ${order.statut === "3" && order.billed === "0"
            ? "Clôturée"
            : order.statut === "3" && order.billed === "1"
                ? "Clôturée"
                : order.statut === "1" && order.billed === "1"
                    ? "Validée - facturée"
                    : order.statut === "1" && order.billed === "0"
                        ? "Validée"
                        : order.statut === "0"
                            ? "Brouillon"
                            : order.statut === "-1"
                                ? "Annulée"
                                : "Statut inconnu"
        }">
        </dob-stdfield>
        <dob-stdfield fieldName= "Statut global: " fieldValue="${getevaluateOrderGlobalStatus(order)}" </dob-stdfield >
    </div > `;
    // output += `<div class="col-md-12 main"  > <span class="fw-light" style ="color:grey">Statut global : </span> : ${getevaluateOrderGlobalStatus(order)} </div >`;
    // output += `<div class="col-md-12 main" style=" margin-top:5px" >
    // ${order.statut === '1' && (Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100 - Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) !== 0 && `<Tooltip title="Montants facturés et payés différents"><ErrorOutlineIcon /></Tooltip>`}
    // ${order.statut === '1' && (Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100 - Math.round(parseFloat(order.total_ttc) * 100) / 100) !== 0 && `<Tooltip title="Montants commande et montant facturés différents"><ErrorOutlineIcon /></Tooltip>`}
    // ${order.statut === '-1' && (Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100 - Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) !== 0 && `<Tooltip title="Commande annulée à rembourser"><ErrorOutlineIcon /></Tooltip>`}
    // ${order && getOrderRoomNotSet(order) !== null && getOrderRoomNotSet(order) !== true && `<Tooltip title="Chambre non affectée"><ErrorOutlineIcon /></Tooltip>`}
    // ${order && getOrderhostingtaxesconsistancy(order) !== null && getOrderhostingtaxesconsistancy(order) !== true && `<Tooltip title="Erreur cohérence hébergement et taxes"><ErrorOutlineIcon /></Tooltip>`}
    // ${order && getOrderDatesQtyconsistancy(order) !== null && getOrderDatesQtyconsistancy(order) !== true && `<Tooltip title="Erreur de cohérence entre les dates et les quantités"><ErrorOutlineIcon /></Tooltip>`}
    // ${order && getOrderRepConsistancy(order) === true && `<Tooltip title="Ligne de repas sans type de repas"><ErrorOutlineIcon /></Tooltip>`}
    // ${getOrderRepConsistancy(order)}

    // *** Display order
    document.querySelector("#orderIdentity").innerHTML = output

}

/**
 * 
 * @param {*} order 
 * @returns 
 */
function displayOrderLines(order) {

    let output = `
        <div id="orderLines" style="margin-bottom:0px">
            <dob-bloctitle id="bloc" usericon="bi-list-task" username="Order lines">
                <ul class="dropdown-menu bg-light-subtle" style="padding:10px;width:250px">
                    <li id=""><span>${addOrderIcon} Outil prestation stage</span></li>
                    <li id=""><span>${addOrderIcon} Outil prestation retraite</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li id=""><span>${bedIcon} Ajouter un hébergement</span></li>
                    <li id=""><span>${mealIcon} Ajouter un repas</span></li>
                    <li id=""><span>${addOrderIcon} Ajouter une adhésion</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li id=""><span>${plussquareIcon} Ajouter un produit</span></li>
                </ul>
            </<dob-bloctitle>
        </div> 
        `;

    if (order.lines) {
        order.lines.map((orderLine, index) => {
            output += `
            <div class="row" >
                
                <div class=" col d-none d-md-block" >
                    <span   orderLineID="${orderLine.id}" >${orderLine.ref}</span>
                </div> 
                
                <div class="col-4" >
                    <span   orderLineID="${orderLine.id}" >${orderLine.label}</span>
                </div>     
                
                <div class="col" >
                    <span   orderLineID="${orderLine.id}" >${orderLine.qty}</span>
                </div>              
                        
                <div class="col"> 
                    ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(orderLine.total_ttc))}
                </div> 
                <div class="col d-none d-md-block">
                    ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(orderLine.array_options.options_lin_datedebut * 1000)} 
                        </div> 

                <div class="col d-none d-md-block">
                    ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric" }).format(orderLine.array_options.options_lin_datefin * 1000)} 
                        </div> 

                        <!-- Action button -->
                <div class="col-1 flex float-right text-end" style="cursor: pointer">                             
                    <div class="dropdown">
                        <a href="#" class="btn" data-bs-toggle="dropdown" aria-expanded="false" color:grey>${threedotsvertical}  </a>

                        <ul class="dropdown-menu bg-light-subtle" style="padding:10px;background-color:#F7F7F3">
                            <li id="deleteLine">Supprimer ligne</li>
                            <li>Editer ligne</li>
                            <li>Scinder ligne</li>
                            <li><hr class="dropdown-divider"></li>
                            <li>Supprimer repas</li>
                        </ul>
                    </div>                         
                </div>   
                ${index < order.lines.length - 1 ? '<hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:10px" />' : ''}             
            </div >           
            `;
        });

    } else {
        output += `
            < div class="row" >
                <div class="col-3" >
                    <span class="customerLink" >Pas de ligne pour cette commande</span>
                </div> 
            </div >`;
    }
    document.querySelector("#orderLines").innerHTML = output;
}

/**
 * 
 * @param {*} order 
 * @returns 
 */
function displayOrderInvoices(order) {

    // *** Display order invoices
    let output = '';
    // invoicesString += `<div class=" " style="padding:5px">  `;
    output += `
        <div id="orderInvoices" style="margin-bottom:0px">
            <dob-bloctitle id="" usericon="bi-receipt" username="Invoices">
             </<dob-bloctitle>
        </div> 
        `;

    // invoicesString += `
    // <div style="margin-bottom:20px">
    //     <div class="flex-grow-1"><span class="fs-5" style="color:#8B2331">${invoiceIcon} Invoices</span></div>
    //     <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" /> `;

    if (order.linkedInvoices) {
        order.linkedInvoices.map((linkedInvoice, index) => {
            output += `
            <div class="row" style = "" >
                
                <div class="col-3" >
                    <dob-stdfieldwithlinkclass fieldName="" fieldValue="${linkedInvoice.ref}" entityid="${linkedInvoice.id}" fieldlink="invoiceLink"/>
                    <!-- <span class="invoiceLink text-danger-emphasis"  invoiceid="${linkedInvoice.id}" style="cursor: pointer">${linkedInvoice.ref}</span> -->
                </div> 
                <div class="col-2 col d-none d-md-block" > 
                    ${linkedInvoice.type === "3"
                    ? "Acompte"
                    : linkedInvoice.type === "2"
                        ? "Avoir"
                        : linkedInvoice.type === "0"
                            ? "Standard"
                            : "Type facture inconnu"}
                </div> 

                <div class="col-2  col d-none d-md-block">
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
             </div>
            `;
        });

    } else {
        output += `
            <div class="row" >
                <div class="col-3" >
                    <span class="customerLink" >Pas de facture pour cette commande</span>
                </div> 
            </div >`;
    }

    document.querySelector("#linkedInvoices").innerHTML = output;
}