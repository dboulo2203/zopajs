import { wsUrlformel, DOLAPIKEY } from '../../../shared/assets/constants.js';

export async function getOrder(orderID) {

    let wsUrl = wsUrlformel + `dklaccueil/fullorders?sortorder=ASC&limit=1&sqlfilters=t.rowid%3D${orderID}&DOLAPIKEY=${DOLAPIKEY}`

    let responsefr = await fetch(wsUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("order", JSON.stringify(data[0]));
        // console.log("getOrder  await ok ");
        return (data[0]);

    } else {
        console.log(`getOrder Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getOrder Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

/**
 * Returns the order total billed 
 * @param {*} order 
 * @param {*} invoiceId
 * @returns {number} the amount billed for this order 
 */
export function getOrderBilledAmount(order) {
    let totalBilled = 0;

    order.linkedInvoices.forEach((invoice, index) => {
        if (invoice.statut !== "0" && invoice.statut !== "3") { // we don't care about draft invoices
            totalBilled += parseFloat(invoice.total_ttc);
        }
    })
    return totalBilled;
}

/**
 * Returns the order total paid 
 * @param {*} order 
 * @param {*} invoiceId 
 * @returns {number} the total paid for this order
 */
export function getOrderPaidAmount(order) {
    let totalPaid = 0;
    order.linkedInvoices.forEach((invoice, index) => {

        if (invoice.statut === "2") { // we don't care about draft invoices
            let usedCreditNoteLine = invoice.lines.filter(line => line.desc === "(CREDIT_NOTE)");
            if (!usedCreditNoteLine.length > 0) {
                totalPaid += parseFloat(invoice.total_ttc);
            } else {
                totalPaid += invoice.total_ttc - usedCreditNoteLine[0].total_ttc; // *** For invoices with credit note used, we substract  the amount of the line.
            }
        }
    });
    return totalPaid;
}
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



/*****************************************************************************
/**
* Evaluate global status of an order
 * @param {*} orderParam 
 * @returns {number} status code
 */
export function getevaluateOrderGlobalStatusCode(order) {
    let globalStatus = 0;
    // let order = orderParam;

    // *** get the invoices and sort the invoices by creation date
    let orderLinkedInvoices = order.linkedInvoices;
    orderLinkedInvoices = orderLinkedInvoices.sort((a, b) => a.date_creation - b.date_creation);

    orderLinkedInvoices = orderLinkedInvoices.filter((invoice) => invoice.statut === '2' || invoice.statut === '1');
    // *** Brouillon
    if (order.statut === '0') {
        if (orderLinkedInvoices.length == 0) {
            globalStatus = 1;
        } else {
            globalStatus = 14;
        }

        // *** Commande Validée
    } else if (order.statut === '1') {

        // ** Comande validée sans facture
        if (orderLinkedInvoices.length === 0) {
            globalStatus = 2;
        } else {


            //******* Commande validée avec 1 facture ************************************ */
            // *** Commandee validée avec une facture
            if (orderLinkedInvoices.length == 1) {

                if (orderLinkedInvoices[0].type === '0') {
                    if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100) {
                        if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) {
                            globalStatus = 16;
                        } else {
                            globalStatus = 17;
                        }
                    } else {
                        globalStatus = 18; // *** Ordered!=invoiced 
                    }

                } else if (orderLinkedInvoices[0].type === '3') {
                    if (Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100 === Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) {
                        globalStatus = 19;
                    } else {
                        globalStatus = 20;
                    }
                } else {
                    globalStatus = -1;
                }

                //*** Commande validée avec 2 factures  ********************************************** */
            } else if (orderLinkedInvoices.length === 2) {

                if (orderLinkedInvoices[0].type === '3') { //* 1rst is a deposit invoice
                    // if (orderLinkedInvoices[1].type === '0') { //* 2nd is standard invoice - cas standard deposit and standard

                    // *** acompte et standard, payées
                    // if (orderLinkedInvoices[0].statut === '2' && orderLinkedInvoices[1].statut === '2') {
                    if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100) {
                        if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) {
                            globalStatus = 16;  // *** Ordered=invoiced = paid
                        } else {
                            globalStatus = 17;  // *** Ordered=invoiced != paid
                        }
                    } else {
                        if (Math.round(parseFloat(order.total_ttc) * 100) / 100 < Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100)
                            globalStatus = 22;
                        else
                            globalStatus = 18; // *** Ordered!=invoiced 
                    }

                } else if (orderLinkedInvoices[1].type === '2') {  //* 1rst is standard invoice 2nd is creditnote
                    globalStatus = 9;
                    //   //TODO Compute payment status

                    // ** 1rst is a standard invoice
                } else if (orderLinkedInvoices[0].type === '0') {
                    if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100) {
                        if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) {
                            globalStatus = 16;  // *** Ordered=invoiced = paid
                        } else {
                            globalStatus = 17;  // *** Ordered=invoiced != paid
                        }
                    } else {
                        globalStatus = 18; // *** Ordered!=invoiced 
                    }
                } else {
                    globalStatus = -1;
                }

                //*** Commande validée plus de 2 factures  ********************************************** */
            } else if (orderLinkedInvoices.length >= 3) {
                globalStatus = 14;

                if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderBilledAmount(order)) * 100) / 100) {
                    if (Math.round(parseFloat(order.total_ttc) * 100) / 100 === Math.round(parseFloat(getOrderPaidAmount(order)) * 100) / 100) {
                        globalStatus = 16;  // *** Ordered=invoiced = paid
                    } else {
                        globalStatus = 17;  // *** Ordered=invoiced != paid
                    }
                } else {
                    globalStatus = 18; // *** Ordered!=invoiced 
                }
            } else {
                globalStatus = 99;
            }
        }
        // *** Annulée
    } else if (order.statut === '-1') {
        globalStatus = 10;

    } else if (order.statut === '3') { // Traitée
        globalStatus = 13;
    }
    return globalStatus;
}

/**
 * get the status of the order
 * @param {*} order 
 * @returns {string} the string to be displayed 
 */
export function getevaluateOrderGlobalStatus(order) {

    let globalStatus = getevaluateOrderGlobalStatusCode(order);
    // return (dispatch) => {
    return globalStatus === 0
        ? "Statut non déterminé, situation non traitée"
        : globalStatus === -1
            ? "Anomalie"
            : globalStatus === 1
                ? "Réservation brouillon"
                : globalStatus === 2
                    ? "Inscription validée, sans facture"
                    // : globalStatus === 3
                    //   ? "Réservation facturée"
                    //   : globalStatus === 4
                    //     ? "Réservation réglée"
                    : globalStatus === 5
                        ? "Réservation réglée, inscription facturée"
                        : globalStatus === 6
                            ? "Réservation réglée, inscription réglée"
                            : globalStatus === 7
                                ? "Inscription (sans réservation)  réglée"
                                : globalStatus === 8
                                    ? "Inscription (sans réservation), facturée"
                                    // : globalStatus === 9
                                    //   ? "Réservation cours de modification"
                                    : globalStatus === 10
                                        ? "Inscription annulée"
                                        : globalStatus === 11
                                            ? "Réservation non réglée, inscription réglée"
                                            : globalStatus === 12
                                                ? "Réservation non réglée, inscription non réglée"
                                                : globalStatus === 13
                                                    ? "Inscription clôturée"
                                                    : globalStatus === 14
                                                        ? "Inscription en cours de modification "
                                                        // : globalStatus === 15
                                                        //   ? "Inscription en cours d'annulation"
                                                        : globalStatus === 16
                                                            ? "Inscription réglée  "
                                                            : globalStatus === 17
                                                                ? "Inscription à encaisser  "
                                                                : globalStatus === 18
                                                                    ? "Inscription à facturer  "
                                                                    : globalStatus === 19
                                                                        ? "Réservation réglée  "
                                                                        : globalStatus === 20
                                                                            ? "Réservation à encaisser  "
                                                                            : globalStatus === 21
                                                                                ? "Réservation à facturer  "
                                                                                : globalStatus === 22
                                                                                    ? "Facturé est supérieur au montant de la commande  "

                                                                                    : globalStatus === 99
                                                                                        ? "Inscription complexe, Analyse impossible, contacter l'administrateur"
                                                                                        : "Analyse impossible, contacter l'administrateur"

}
