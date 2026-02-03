// *** Component ressources
import { getInvoice, getInvoicePayments } from '../../../shared/zopaServices/zopaInvoicesServices.js'
import { getCustomer } from '../../../shared/zopaServices/zopaCustomerServices.js'
import { getUserLoginFromId } from '../../../shared/zopaServices/zopaListsServices.js'
import { isCurrentUSerLogged } from '../../../shared/zopaServices/zopaLoginServices.js'

// *** Shared ressoucres
import { getPageTitleDisplay } from '../../../shared/bootstrapServices/components.js'

import { headerViewDisplay } from '../../../shared/zopaAppservices/headerViewCont.js'//***  shared ressources
import { launchInitialisation } from '../../../shared/zopaAppservices/initialisationService.js'
import {
    threedotsvertical, orderIcon, addOrderIcon, bedIcon, mealIcon, validateIcon, cancelIcon, plussquareIcon,
    pencilsquareIcon, closeOrderIcon, invoiceIcon, printerIcon
} from '../../../shared/assets/constants.js'
import { getLinkWithctrl, getAppPath } from '../../../shared/services/commonFunctions.js'


/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startInvoiceController() {

    // *** Initialisations
    try {

        launchInitialisation();
        headerViewDisplay("#menuSection");

        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");

        // *** Get url params and launch controller
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('invoiceID'))
            displayInvoiceContent("mainActiveSection", searchParams.get('invoiceID'));

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayInvoiceContent(htlmPartId, invoiceID) {

    // *** Load data from API style="color:#8B2331"
    let invoice = await getInvoice(invoiceID);
    let customer = await getCustomer(invoice.socid);
    let invoicePayments = await getInvoicePayments(invoiceID)

    // *** Display the controller skeleton
    //           <dob-pagetitle titlename="Invoice : ${invoice.ref}" titleIcon="bi-receipt"></dob-pagetitle>

    let initString = `
           <div style="margin-top:60px">
                ${getPageTitleDisplay(`Invoice : ${invoice.ref}`, "bi-receipt")}
          
 
            <div class="row" >
                <div class="col-12 col-md-6" id="invoiceIdentity" >   
                </div>
                <div class="col-12 col-md-6" id="invoicePayments">
                </div>
            </div>

            <div class="row" id="invoiceLines"> 
            </div>
            `;
    document.querySelector("#" + htlmPartId).innerHTML = initString;

    // *** Display invoice details
    document.querySelector("#invoiceIdentity").innerHTML = displayInvoiceIdentity(invoice, customer)
    document.querySelector("#invoiceLines").innerHTML = displayInvoiceLines(invoice)
    document.querySelector("#invoicePayments").innerHTML = displayInvoicePayments(invoicePayments)

    // *** Actions
    document.querySelector("#customerLink").onclick = function (event) {
        getLinkWithctrl(`${getAppPath()}/views/manageCustomer/customer/customer.html?customerID=` + event.currentTarget.getAttribute('customerid'), event.ctrlKey);
    };
    document.querySelector("#orderLink").onclick = function (event) {
        getLinkWithctrl(`${getAppPath()}/views/manageCustomer/order/order.html?orderID=` + event.currentTarget.getAttribute('orderid'), event.ctrlKey);
    };

}

//*** Function needed */

function displayInvoiceIdentity(invoice, customer) {
    let output = '';

    // *** Display orderstyle="color:#8B2331"

    // output += `<div style="margin-bottom:10px">     `;
    output += `
        <div id="invoiceIdentity">
            <dob-bloctitlev2 id="bloc" blocIcon="bi-receipt" blocName="Details">          
                <div class="dropdown">
                    <a href="#" data-bs-toggle="dropdown" aria-expanded="false" class="text-secondary" >${threedotsvertical}  </a>
                    <ul class="dropdown-menu bg-light-subtle" style="padding:10px">
                        <li id=""><span>printerIcon Imprimer la facture</span></li>
                        <li id=""><span>pencilsquareIcon Valider la facture</span></li>
                       <li id=""><span>cancelIcon Abandonner la facture</span></li>
                       <li id=""><span>cancelIcon hlkjlla facture</span></li>
                    </ul>
                </div>
            </dob-bloctitlev2>
     
        </div>`;
    // output += `<hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    output += `<div class="col-md-12 main"  > <span class="fw-light text-secondary" >Ref. facture</span> : ${invoice.ref} </div >`;
    output += `<div class="col-md-12 main"  > <span class=" fw-light" >Adhérent : </span> <span id="customerLink" customerid="${invoice.socid}" style ="cursor:pointer"> ${customer.name}</span></div >`;
    output += `<div class="col-md-12 main"  > <span class="fw-light text-secondary" >Ref. commande</span> : <span id="orderLink" orderid="${Object.values(invoice.linkedObjectsIds.commande).join()}" style="cursor:pointer" >${Object.values(invoice.linkedObjectsIds.commande).join()}</span> </div >`;
    output += `<div class="col-md-12 main"  > <span class="fw-light text-secondary" >Type</span> : ${invoice.type === "3"
        ? "Acompte"
        : invoice.type === "2"
            ? "Avoir"
            : invoice.type === "0"
                ? "Standard"
                : "Type facture inconnu"
        } </div >`;
    output += `<div class="col-md-12 main"  style =" margin-top:5px"> <span class="fw-light" >Date création : </span> :  ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).format(invoice.date_creation * 1000)} </div >`;
    output += `<div class="col-md-12 main"  > <span class="fw-light" >Date modification </span> :  ${new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).format(invoice.date_modification * 1000)}</div > `;
    output += `<div class="col-md-12 main" style ="" > <span class="fw-light" >Montant ttc </span> : ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(invoice.total_ttc))}</div >`;
    output += `<div class="col-md-12 main" style ="" > <span class="fw-light" >Reste à payer </span> : ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(invoice.remaintopay))}</div >`;
    output += `<div class="col-md-12 main" style =" margin-top:5px" > <span class="fw-light" >Statut </span> : ${invoice.statut === "2"
        ? "Payée"
        : invoice.statut === "1"
            ? "Validée"
            : invoice.statut === "0"
                ? "Brouillon"
                : invoice.statut === "3"
                    ? "Abandonnée"
                    : "Statut inconnu"}
            </div >`;
    output += `<div class="col-md-12 main" style =" margin-top:5px" > <span class="fw-light" >Acteur : </span> : 
    Créée par ${getUserLoginFromId(invoice.user_author) + ', validée par ' + getUserLoginFromId(invoice.user_valid)}</div >`;
    output += `</div > `


    return output;
}

/**
 * 
 * @param {*} order 
 * @returns 
 */
function displayInvoicePayments(invoicePayments) {

    let invoicePaymentsString = '';
    invoicePaymentsString += `
     <div id="invoicePaiements">
        <dob-bloctitlev2 id="bloc" blocIcon="bi-receipt" blocName="Payments">
            <div class="dropdown">
                <a href="#" data-bs-toggle="dropdown" aria-expanded="false" class="text-secondary">${threedotsvertical}  </a>
                <ul class="dropdown-menu bg-light-subtle" style="padding:10px">
                    <li id=""><span>${printerIcon} Ajouter un paiement</span></li>
                </ul>
            </div>
        </dob-bloctitlev2>
        
                </div>`;


    if (invoicePayments) {
        invoicePayments.map((invoicePayment, index) => {
            invoicePaymentsString += `
            <div class="row" style = "margin-bottom:5px" >
                <div class="col-3" > 
                    <span   orderLineID="${invoicePayment.id}" style="cursor: pointer">${invoicePayment.ref}</span>
                </div> 
                
                <div class="col-1" >
                    <span   orderLineID="${invoicePayment.id}"style="cursor: pointer">${invoicePayment.type}</span>
                </div>              
                        
                <div class="col-2"> 
                    ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(invoicePayment.amount))}
                </div> 

                <div class="col-6">
                    ${invoicePayment.date} 
                </div>                    
            </div >
            `;
        });

    } else {
        invoicePaymentsString += `
            < div class="row" >
                <div class="col-3" >
                    <span class="customerLink" >Pas de ligne pour cette commande</span>
                </div> `;
        invoicePaymentsString += ` </div >`;
    }
    return invoicePaymentsString;
}


/**
 * 
 * @param {*} order 
 * @returns 
 */
function displayInvoiceLines(invoice) {

    let invoiceLInesString = '';
    invoiceLInesString += `
        <div  id="invoiceLines">
            <dob-bloctitlev2 id="bloc" blocIcon="bi-receipt" blocName="Invoice lines">
                <div class="dropdown">
                    <a href="#" data-bs-toggle="dropdown" aria-expanded="false" class="text-secondary">${threedotsvertical}  </a>
                    <ul class="dropdown-menu bg-light-subtle" style="padding:10px;background-color:#F7F7F3">
                        <li id=""><span>${printerIcon} Imprimer la facture</span></li>
                        <li id=""><span>${pencilsquareIcon} Ré-ouvrir la commande</span></li>
                        <li id=""><span>${cancelIcon} Annuler la commande</span></li>
                        <li id=""><span>${closeOrderIcon} Clôturer la commande</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li id=""><span>${invoiceIcon} Générer un acompte</span></li>
                        <li id=""><span>${invoiceIcon} Facturer partiellement</span></li>
                        <li id=""><span>${invoiceIcon} Générer une facture</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li id=""><span>${mealIcon} Afficher badge</span></li>
                        <li id=""><span>${addOrderIcon} Afficher devis</span></li>
                        
                    </ul>
                </div>
            </dob-bloctitlev2>
        </div>`;


    if (invoice.lines) {
        invoice.lines.map((invoiceLine, index) => {
            invoiceLInesString += `
            <div class="row" style = "margin-bottom:5px" >
               
                <div class="col-2" > 
                    <span   orderLineID="${invoiceLine.id}" style="cursor: pointer">${invoiceLine.ref !== null ? invoiceLine.ref : ''}</span>
                </div> 
                
                    <div class="col-4" >
                    <span   orderLineID="${invoiceLine.id}"style="cursor: pointer">${invoiceLine.desc}</span>
                </div>     
                <div class="col-4" >
                    <span   orderLineID="${invoiceLine.id}"style="cursor: pointer">${invoiceLine.label !== null ? invoiceLine.label : ''}</span>
                </div>     
              
                <div class="col-1" >
                    <span   orderLineID="${invoiceLine.id}"style="cursor: pointer">${invoiceLine.qty}</span>
                </div>              
                        
                <div class="col-1"> 
                    ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(parseFloat(invoiceLine.total_ttc))}
                </div> 
                       <!-- Action button -->
               <!-- <div class="col-2 flex float-right text-end" style="cursor: pointer">                             
                    <div class="dropdown">
                        <a href="#" data-bs-toggle="dropdown" aria-expanded="false" style="color:grey">${threedotsvertical}  </a>

                        <ul class="dropdown-menu" style="padding:10px;background-color:#F7F7F3">
                            <li id="deleteLine">Supprimer ligne</li>
                            <li>Editer ligne</li>
                            <li>Scinder ligne</li>
                            <li><hr class="dropdown-divider"></li>
                            <li>Supprimer repas</li>
                        </ul>
                    </div>                         
                </div> -->   
                       
            </div >
            
            `;

        });

    } else {
        invoiceLInesString += `
            < div class="row" >
                <div class="col-3" >
                    <span class="customerLink" >Pas de ligne pour cette commande</span>
                </div> 
            </div >`;
    }
    return invoiceLInesString;
}
