import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';

/**
 * 
 * @param {*} orderID 
 * @returns 
 */
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
export function getOrderTemp(orderID) { }
/**
 * Create a new order
 * @param {*} socid 
 * @returns 
 */
export async function createNewOrder(socid) {
    let wsUrl = wsUrlformel + `orders?DOLAPIKEY=${DOLAPIKEY}`;

    let responsefr = await fetch(wsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            socid: socid,
            date: Math.floor(Date.now() / 1000),
        })
    });
    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("order", JSON.stringify(data));
        // console.log("getOrder  await ok ");
        return (data[0]);

    } else {
        console.log(`getOrder Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getOrder Error message : " + responsefr.status + " " + responsefr.statusText);
    }


}

export function createOrderDeposit(orderID, deposit) { }
export function validateOrderDeposit(depositid, deposit, orderID) { }
export function createCreditnoteForOrder(order, creditNote) { }

export function addOrderLine(order, orderline) { }
export function addOrderLines(orderid, orderlineJson, customer) { }
export async function createOrderLineSync(orderid, linesTab, customer) { }
export function updateOrderLine(orderid, orderLineid, orderline) { }
export function removeOrderLine(orderId, orderLineid) { }
export function validateOrder(orderid) { }

export function createFullinvoiceForOrder(orderId, order) { }
export function getLinesToBeInvoiced(order) { }
export function createPartialinvoiceForOrder(order, diffentsLinesFiltered) { }
export function compareLinesTab(orderLineTab, invoiceslineTab) { }
export function createPaybackinvoiceForOrder(order) { }

export function orderDeleteMeal(order, orderline, breakStartDateParam, breakEndDateParam) { }
export function orderBreakLine(order, orderline, breakDate) { }
export function updateOrderLineandAddOrderline(orderid, orderLineid, orderline, order, addStruct) { }

export function setOrderToDraft(orderid) { }
export function cancelOrder(orderid) { }
export function setOrderToClosed(orderid) { }
export function setOrdersToClosed(orders) { }

export function generateOrderPdfDocument(order, ordermodel) { }
export function getOrderTotalInvoicesLines(order, withValidatedOrders) { }


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

/**
 * Get the starting date of the order course
 * @param {*} orderthe order
 * @returns : if a course is foundn returns  the date, otherwise null
 */
export function getevaluateSessionStartDate(order) {
    let sessionStartDate = null;
    // let otherProducts = [];
    order.lines.forEach((orderLine, index) => {
        if (orderLine.ref) {
            if (orderLine.ref.startsWith('STA')) {
                sessionStartDate = orderLine.array_options.options_lin_datedebut
            }
        }
    });
    return sessionStartDate;
}

/**
 * Get the ending date of an order course
 * @param {*} order 
 * @returns : if a course is foundn returns  the date, otherwise null
 */
export function getevaluateSessionEndDate(order) {
    let sessionStartDate = null;
    // let otherProducts = [];
    order.lines.forEach((orderLine, index) => {
        if (orderLine.ref) {
            if (orderLine.ref.startsWith('STA')) {
                sessionStartDate = orderLine.array_options.options_lin_datefin
            }
        }
    });
    return sessionStartDate;
}

/**
 * Get the request for translation 
 * @param {*} order 
 * @returns : Return the 3 first letters of the label. return '' if no translation 
 */
export function getTranslationRequest(order) {
    let translationString = "";
    // let otherProducts = [];
    let translationLine = order.lines.find((line) => line.ref.startsWith('TRA'));
    if (translationLine)
        translationString = translationLine.product_label.substr(0, 3);

    return translationString;
}
/**
 * Returns true if the invoice is linked with the order
 * @param {*} order 
 * @param {*} invoiceId : the invoice to be searched 
 * @returns {boolean} :  true if an invoice is in the order
 */
export function getevaluateIsInvoiceInThisOrder(order, invoiceId) {
    let inThisOrder = false;
    order.linkedInvoices.forEach((invoice, index) => {
        if (invoice.id === invoiceId) {
            inThisOrder = true;
        }
    });
    return inThisOrder;
}
/**
 * Returns true if the invoice is linked with the order
 * @param {*} order 
 * @param {*} invoiceId : the invoice to be searched 
 * @returns {boolean} :  true if an invoice is in the order
 */
export function getLastInvoiceInThisOrder(order) {
    let inThisOrder = false;
    /*  order.linkedInvoices.sort((invoice, index) => {
       if (invoice.id === invoiceId) {
         inThisOrder = true;
       }
     });
    */
    let sortedInvoices = JSON.parse(JSON.stringify(order.linkedInvoices))
    sortedInvoices.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        let aDate = new Date(a * 1000);
        let bDate = new Date(b * 1000);

        return new Date(b.date) - new Date(a.date);
    });
    if (sortedInvoices.length > 0)
        return sortedInvoices[sortedInvoices.length - 1]
    else
        return null
}

/**
 * Returns true if a booking line is in the order and if a room is set.
 * @param {*} order 
 * @returns {boolean} : Returns true if a booking line is in the order and if a room is set.
 */
export function getOrderRoomNotSet(order) {
    let inThisOrder = null;
    if (order !== undefined && order.lines !== undefined) {
        let bookingLine = order.lines.find((line) => line.ref.startsWith('HEB'));
        if (bookingLine !== undefined) {
            if (bookingLine.array_options.options_lin_room !== undefined && bookingLine.array_options.options_lin_room !== null)
                inThisOrder = true;
            else
                inThisOrder = false;
        }
    }
    return inThisOrder;
}

/**
 * Order consistancy : HEB is consistant with TAX
 * @param {*} order  
 * @returns {boolean}  : return true if a HEB line is in the order and if a taxe line is in the order and if the qty are the same 
 */
export function getOrderhostingtaxesconsistancy(order) {
    let inThisOrder = null;
    if (order !== undefined && order.lines !== undefined) {
        let bookingLine = order.lines.find((line) => line.ref.startsWith('HEB'));
        let taxLine = order.lines.find((line) => line.ref.startsWith('TAX'));
        if (bookingLine !== undefined) {
            if (taxLine !== undefined) {
                if (taxLine.qty === bookingLine.qty) {
                    if ((new Date(bookingLine.array_options.options_lin_datedebut).setHours(0, 0, 0) === new Date(taxLine.array_options.options_lin_datedebut).setHours(0, 0, 0)) &&
                        (new Date(bookingLine.array_options.options_lin_datedebut).setHours(0, 0, 0) === new Date(taxLine.array_options.options_lin_datedebut).setHours(0, 0, 0))) {
                        inThisOrder = true;
                    } else {
                        inThisOrder = false;
                    }
                } else {
                    inThisOrder = false;
                }
            } else {
                inThisOrder = false;// no tax line
            }
        } // No booking line, no computation
    }
    return inThisOrder;
}

/**
 * Order consistancy : HEB, TAX, REP dates are consistant with qty
 * @param {*} order 
 * @param {*} invoiceId 
 * @todo : finish the function
 */
export function getOrderDatesQtyconsistancy(order) {
    let inThisOrder = null;
    if (order !== undefined && order.lines !== undefined) {
        let bookingLine = order.lines.find((line) => line.ref.startsWith('HEB'));
        if (bookingLine !== undefined) {
            let bookingDaysNumber = Math.round((new Date(bookingLine.array_options.options_lin_datefin * 1000) - new Date(bookingLine.array_options.options_lin_datedebut * 1000)) / 86400000);
            if (bookingDaysNumber + 1 === parseInt(bookingLine.qty)) {
                inThisOrder = true;
            } else {
                inThisOrder = false;
                return inThisOrder
            }
        }
        let taxLine = order.lines.find((line) => line.ref.startsWith('TAX'));
        if (taxLine !== undefined) {
            let bookingDaysNumber = Math.round((new Date(taxLine.array_options.options_lin_datefin * 1000) - new Date(taxLine.array_options.options_lin_datedebut * 1000)) / 86400000);
            if (bookingDaysNumber + 1 === parseInt(taxLine.qty)) {
                inThisOrder = true;
            } else {
                inThisOrder = false;
                return inThisOrder
            }
        }
        let mealLines = order.lines.filter((line) => line.ref.startsWith('REP'));
        if (mealLines !== undefined) {
            let newMeallines = [];
            if (!Array.isArray(mealLines)) {
                newMeallines.push(mealLines);
            } else {
                newMeallines = [...mealLines];
            }

            newMeallines.map((mealLine) => {
                let mealLineDaysNumber = Math.round((new Date(mealLine.array_options.options_lin_datefin * 1000) - new Date(mealLine.array_options.options_lin_datedebut * 1000)) / 86400000);
                if (mealLineDaysNumber + 1 === parseInt(mealLine.qty)) {
                    inThisOrder = true;
                } else {
                    inThisOrder = false;
                    return inThisOrder
                }
            });
        }
        /*   let sessionLine = order.lines.find((line) => line.ref.startsWith('STA'));
          if (sessionLine !== undefined) {
            if (sessionLine.array_options.options_lin_datedebut !== null && sessionLine.array_options.options_lin_datefin !== null) {
              let mealLines = order.lines.filter((mealLine) => mealLine.ref.startwiths("REP"));
              mealLines.map((mealLine) => {
                let startOffsetDays = abs(Math.round((new Date(mealLine.array_options.options_lin_datebebut * 1000) - new Date(sessionLine.array_options.options_lin_datedebut * 1000)) / 86400000));
                if (startOffsetDays > 30) {
                  inThisOrder = false;
                }
              })
                
            } else {
              inThisOrder = false;
            }
          } */
    }
    return inThisOrder;
}

/**
 * Order consistancy : test if REP has a rep type
 * @param {*} order 
 * @param {*} invoiceId 
 * @todo : finish the function
 */
export function getOrderRepConsistancy(order) {
    let hasNotMealType = false;
    if (order !== undefined && order.lines !== undefined) {

        let mealLines = order.lines.filter((line) => line.ref.startsWith('REP'));
        if (mealLines !== undefined) {
            mealLines.map((mealLine) => {
                if (mealLine.array_options.options_lin_room === null)
                    hasNotMealType = true;
            }
            )
        };
    }

    return hasNotMealType;
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





/*********************************************************************** */
// *** Needs engine   **************************************************/
/**
  * When the user choose a course, we have to prepare the display of the course checkboses, 
  * all course participation ... 
  * Build the registration data structure
  * @param {*} productTemp the current session
  * @param (*) checkDefaultState : the ckeckboxes default state (true or false).
  * @return : 
  */
export function computeChosenCourse(productTemp, checkDefaultState) {
    // 
    // setlocalError("");
    let registration = {};
    registration.product = productTemp;

    // *** Compute course days number
    registration.datedebutStr = productTemp.array_options['options_sta_datedebut'];
    registration.datefinStr = productTemp.array_options['options_sta_datefin'];
    registration.datedebut = new Date(registration.datedebutStr * 1000);
    registration.datefin = new Date(registration.datefinStr * 1000);
    if (registration.datedebutStr !== '' && registration.datefinStr !== '') {
        registration.nbJoursStage = Math.floor((((registration.datefin).getTime() - (registration.datedebut).getTime()) / (1000 * 3600 * 24)) + 1 + 2);
    } else {
        console.log("Dates de stage invalides");
        // setlocalError("Dates de stage invalides");
        return null;

    }

    registration.datedebut = new Date(registration.datedebut.getTime() - (1000 * 3600 * 24));
    registration.datefin = new Date(registration.datefin.getTime() + (1000 * 3600 * 24));

    // *** Compute day's dates
    registration.tabBusyLigneColonne = new Array(registration.nbJoursStage);
    for (let ligne = 0; ligne < registration.nbJoursStage; ++ligne) {
        let datedebutemp = new Date(registration.datedebut);
        registration.tabBusyLigneColonne[ligne] = new Date(datedebutemp.setDate(registration.datedebut.getDate() + ligne)).getTime();
    }

    // *** participation
    registration.tabBusyParticipation = new Array(registration.nbJoursStage);
    registration.tabBusyParticipation.fill(true);
    registration.tabBusyParticipation[0] = null;
    registration.tabBusyParticipation[registration.tabBusyParticipation.length - 1] = null;

    // *** petit déjeuners
    registration.veggie = checkDefaultState;

    registration.tabBusyBreakfast = new Array(registration.nbJoursStage);
    registration.tabBusyBreakfast.fill(checkDefaultState);
    registration.tabBusyBreakfast[0] = false;


    // *** déjeuner
    registration.tabBusyLunch = new Array(registration.nbJoursStage);
    registration.tabBusyLunch.fill(checkDefaultState);
    registration.tabBusyLunch[0] = false;
    registration.tabBusyLunch[registration.tabBusyLunch.length - 1] = false;
    // *** diner
    registration.tabBusyDiner = new Array(registration.nbJoursStage);
    registration.tabBusyDiner.fill(checkDefaultState);
    registration.tabBusyDiner[registration.tabBusyDiner.length - 1] = false;

    // *** hosting
    registration.tabBusyHosting = new Array(registration.nbJoursStage);
    registration.tabBusyHosting.fill(checkDefaultState);
    registration.tabBusyHosting[registration.tabBusyHosting.length - 1] = false;

    registration.hostingtype = -1;
    // *** Log registration object
    // console.log(JSON.stringify(registration));

    return registration;
    // 

}

/**
 * Compute the registration structure for a session and returns the order lines to be inserted 
 * in the order 
 * @param {*} registration
 * @version 2  
 * @returns : an array of order lines
 */
export function computeRegistrationv2(registration) {

    // *** Check configuration
    if (!getConfigurationValue('MMealDay')
        || !getConfigurationValue('PMealDay')
        || !getConfigurationValue('SMealDay')
        || !getConfigurationValue('RefTaxes')) {
        // setlocalError("Configuration manquante, impossible de calculer, veuillez contacter l'administrateur");
        return null;
    }
    let computedOrderlines = [];
    let startDate = '';
    let endDate = '';

    let computeddintakeplace;
    if (registration.intakeplace !== null && typeof registration.intakeplace === "object")
        computeddintakeplace = registration.intakeplace.rowid;
    else
        computeddintakeplace = '';
    // *** participation  **************************************************
    let startItem = -1;
    registration.tabBusyParticipation.forEach(function (item, index, array) {
        if (item) {
            if (startItem === -1) {
                startItem = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
            }
        } else {
            if (startItem > -1) {
                startDate = registration.tabBusyLigneColonne[startItem] / 1000;
                endDate = registration.tabBusyLigneColonne[index - 1] / 1000;
                let newLine = {
                    "fk_product": registration.product.id,
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": null

                    },
                    "qty": index - startItem,
                    "subprice": registration.product.multiprices_ttc[1]
                }
                computedOrderlines.push(newLine);
                startItem = -1;
            }
        }
    });


    if (startItem > -1) {
        let newLine = {
            "fk_product": registration.product.id,
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
                "options_lin_room": null,
                "lin_intakeplace": computeddintakeplace
            },
            "qty": registration.tabBusyParticipation.length - startItem,
            "subprice": registration.product.multiprices_ttc[1]
        }
        computedOrderlines.push(newLine);
    }

    // *** Repas **************************************************
    // *** Breakfast  
    startItem = -1;
    registration.tabBusyBreakfast.forEach(function (item, index, array) {
        if (item) {
            if (startItem === -1) {
                startItem = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
            }
        } else {
            if (startItem > -1) {
                let newLine = {
                    "fk_product": getConfigurationValue('PMealDay'),
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": registration.mealType.rowid,
                        "lin_intakeplace": computeddintakeplace
                        //, "options_lin_mealtype": null
                    },
                    "qty": index - startItem,
                    "subprice": registration.product.multiprices_ttc[1]
                }
                computedOrderlines.push(newLine);
                startItem = -1;
            }
        }
    });

    if (startItem > -1) {
        let newLine = {
            "fk_product": getConfigurationValue('PMealDay'),
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
                "options_lin_room": registration.mealType.rowid,
                "lin_intakeplace": computeddintakeplace
            },
            "qty": registration.tabBusyParticipation.length - startItem,
            "subprice": registration.product.multiprices_ttc[1]
        }
        computedOrderlines.push(newLine);
    }

    // *** lunch  
    startItem = -1;
    registration.tabBusyLunch.forEach(function (item, index, array) {
        if (item) {
            if (startItem === -1) {
                startItem = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
            }
        } else {
            if (startItem > -1) {
                let newLine = {
                    "fk_product": getConfigurationValue('MMealDay'),
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": registration.mealType.rowid,
                        "lin_intakeplace": computeddintakeplace
                    },
                    "qty": index - startItem,
                    "subprice": registration.product.multiprices_ttc[1]
                }
                computedOrderlines.push(newLine);
                startItem = -1;
            }
        }
    });

    if (startItem > -1) {
        let newLine = {
            "fk_product": getConfigurationValue('MMealDay'),
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
                "options_lin_room": registration.mealType.rowid,
                "lin_intakeplace": computeddintakeplace
            },
            "qty": registration.tabBusyParticipation.length - startItem,
            "subprice": registration.product.multiprices_ttc[1]
        }
        computedOrderlines.push(newLine);
    }

    // *** Diner  
    startItem = -1;
    registration.tabBusyDiner.forEach(function (item, index, array) {
        if (item) {
            if (startItem === -1) {
                startItem = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
            }
        } else {
            if (startItem > -1) {
                let newLine = {
                    "fk_product": getConfigurationValue('SMealDay'),
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": registration.mealType.rowid,
                        "lin_intakeplace": computeddintakeplace
                    },
                    "qty": index - startItem,
                    "subprice": registration.product.multiprices_ttc[1]
                }
                computedOrderlines.push(newLine);
                startItem = -1;
            }
        }
    });

    if (startItem > -1) {
        let newLine = {
            "fk_product": getConfigurationValue('SMealDay'),
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
                "options_lin_room": registration.mealType,
                "lin_intakeplace": computeddintakeplace
            },
            "qty": registration.tabBusyParticipation.length - startItem,
            "subprice": registration.product.multiprices_ttc[1]
        }
        computedOrderlines.push(newLine);
    }


    // *** Hébergement **************************************************
    let startItemHosting = -1;
    registration.tabBusyHosting.forEach(function (item, index, array) {
        if (item) {
            if (startItemHosting === -1) {
                startItemHosting = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
                console.log("Hosting : cas de startItemHosting ===-1, nous n'avons pas prévu de traitement, Est-ce une erreur ?");
            }
        } else {
            if (startItemHosting > -1) {
                // *** Insert hosting
                computedOrderlines.push({
                    "fk_product": registration.hostingType,
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": null, "options_roomid": "0"
                    },
                    "qty": index - startItemHosting
                });


                // *** Insert Taxes
                computedOrderlines.push({
                    "fk_product": getConfigurationValue('RefTaxes'),// '372',
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": null, "options_roomid": "0"
                    },
                    "qty": index - startItemHosting
                });

                startItemHosting = -1;
            }
        }

    });
    if (startItemHosting > -1) {
        // *** Insert hosting
        computedOrderlines.push({
            "fk_product": registration.hostingType,
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
            },
            "qty": registration.tabBusyParticipation.length - startItemHosting
        });


        // *** Insert Taxes
        computedOrderlines.push({
            "fk_product": getConfigurationValue('RefTaxes'),// '372',
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
            },
            "qty": registration.tabBusyParticipation.length - startItemHosting
        });

    }
    // ** Translation language

    if (registration.translationlanguage !== null && typeof registration.translationlanguage === "object") {
        // *** Insert Taxes
        computedOrderlines.push({
            "fk_product": registration.translationlanguage.id,// '372',
            "array_options": {
                "options_lin_datedebut": startDate,
                "options_lin_datefin": endDate,
                "options_lin_room": null
            },
            "qty": 1
        });

    }
    return computedOrderlines;
}

/**
 * Compute the registration structure for a session and returns the order lines
 * @param {*} registration structure
 * @version 1
 * @deprecated
 * @returns : an array of order lines
 * @deprecated
 */
export function computeRegistration(registration) {

    // *** Check configuration
    if (!getConfigurationValue('PMSMealDay')
        || !getConfigurationValue('PMMealDay')
        || !getConfigurationValue('PSMealDay')
        || !getConfigurationValue('MSMealDay')
        || !getConfigurationValue('PMealDay')
        || !getConfigurationValue('MMealDay')
        || !getConfigurationValue('SMealDay')
        || !getConfigurationValue('RefTaxes')) {
        // setlocalError("Configuration manquante, impossible de calculer, veuillez contacter l'administrateur");
        return null;
    }
    let computedOrderlines = [];

    // *** participation  **************************************************
    let startItem = -1;
    registration.tabBusyParticipation.forEach(function (item, index, array) {
        if (item) {
            if (startItem === -1) {
                startItem = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
            }
        } else {
            if (startItem > -1) {
                let newLine = {
                    "fk_product": registration.product.id,
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": null, "options_roomid": "0"
                    },
                    "qty": index - startItem,
                    "subprice": registration.product.multiprices_ttc[1]
                }
                computedOrderlines.push(newLine);
                startItem = -1;
            }
        }
    });
    if (startItem > -1) {
        let newLine = {
            "fk_product": registration.product.id,
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItem] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
                "options_lin_room": null, "options_roomid": "0"
            },
            "qty": registration.tabBusyParticipation.length - startItem,
            "subprice": registration.product.multiprices_ttc[1]
        }
        computedOrderlines.push(newLine);
    }

    // *** Repas **************************************************
    registration.tabBusyLigneColonne.forEach(function (item, index, array) {
        // *** petit déjeuners
        if (registration.tabBusyBreakfast[index] && registration.tabBusyLunch[index] && registration.tabBusyDiner[index]) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('PMSMealDay'), // 371',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });

        } else if (registration.tabBusyBreakfast[index] && registration.tabBusyLunch[index] && !registration.tabBusyDiner[index]) {

            computedOrderlines.push({
                "fk_product": getConfigurationValue('PMMealDay'), // '369',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });

        } else if (registration.tabBusyBreakfast[index] && !registration.tabBusyLunch[index] && registration.tabBusyDiner[index]) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('PSMealDay'), // '370',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });

        } else if (!registration.tabBusyBreakfast[index] && registration.tabBusyLunch[index] && registration.tabBusyDiner[index]) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('MSMealDay'),//'368',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });


        } else if (registration.tabBusyBreakfast[index] && !registration.tabBusyLunch[index] && !registration.tabBusyDiner[index]) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('PMealDay'),//'366',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });

        } else if (!registration.tabBusyBreakfast[index] && registration.tabBusyLunch[index] && !registration.tabBusyDiner[index]) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('MMealDay'),//'365',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });

        } else if (!registration.tabBusyBreakfast[index] && !registration.tabBusyLunch[index] && registration.tabBusyDiner[index]) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('SMealDay'),//'367',
                "array_options": {
                    "options_lin_datedebut": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_datefin": registration.tabBusyLigneColonne[index] / 1000,
                    "options_lin_room": registration.mealType, "options_roomid": "0"
                },
                "qty": 1
            });

        }
    });

    // *** Hébergement **************************************************
    let startItemHosting = -1;
    registration.tabBusyHosting.forEach(function (item, index, array) {
        if (item) {
            if (startItemHosting === -1) {
                startItemHosting = index;
            } else {
                // if (startItem > -1) { //  && index === registration.tabBusyParticipation.length - 1
                //   console.log("Période : " + new Date(registration.tabBusyLigneColonne[startItem]) + " - " + new Date(registration.tabBusyLigneColonne[index - 1]));
                //   startItem = -1;
                //  }
                console.log("Hosting : cas de startItemHosting ===-1, nous n'avons pas prévu de traitement, Est-ce une erreur ?");
            }
        } else {
            if (startItemHosting > -1) {
                // *** Insert hosting
                computedOrderlines.push({
                    "fk_product": registration.hostingType,
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": null, "options_roomid": "0"
                    },
                    "qty": index - startItemHosting
                });


                // *** Insert Taxes
                computedOrderlines.push({
                    "fk_product": getConfigurationValue('RefTaxes'),// '372',
                    "array_options": {
                        "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                        "options_lin_datefin": registration.tabBusyLigneColonne[index - 1] / 1000,
                        "options_lin_room": null, "options_roomid": "0"
                    },
                    "qty": index - startItemHosting
                });

                startItemHosting = -1;
            }
        }

    });
    if (startItemHosting > -1) {
        // *** Insert hosting
        computedOrderlines.push({
            "fk_product": registration.hostingType,
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
            },
            "qty": registration.tabBusyParticipation.length - startItemHosting
        });

        // *** Insert Taxes
        computedOrderlines.push({
            "fk_product": getConfigurationValue('RefTaxes'),// '372',
            "array_options": {
                "options_lin_datedebut": registration.tabBusyLigneColonne[startItemHosting] / 1000,
                "options_lin_datefin": registration.tabBusyLigneColonne[registration.tabBusyParticipation.length - 1] / 1000,
            },
            "qty": registration.tabBusyParticipation.length - startItemHosting
        });

    }
    return computedOrderlines;
}
/**
 * Compute the registration structure for a retreat  and retuns the order lines to be inserted in the order
 * @param {*} registration
 * @param {*} checkDefaultState
 * @returns {*} array of order lines 
 */
export function computeRetreatRegistration(registration, checkDefaultState) {

    let computedOrderlines = [];

    let startDate = new Date(registration.startDate);
    let endDate = new Date(registration.endDate);
    let daysNumber = ((endDate - startDate) / 86400000) + 1;

    // *** CHeck input parameters
    if (!(startDate instanceof Date || isNaN(startDate.valueOf()))) {
        throw new Error("Date de début de période invalide ");
    }

    if (!(endDate instanceof Date || isNaN(endDate.valueOf()))) {
        throw new Error("Date de fin de période invalide ");
    }

    if (startDate > endDate) {
        throw new Error("Outil Prestation complète retraite : erreur date de début supérieure à la date de fin ");
    }

    // *** Check configuration
    if (!getConfigurationValue('PMSMealDay')
        || !getConfigurationValue('PMMealDay')
        || !getConfigurationValue('PSMealDay')
        || !getConfigurationValue('MSMealDay')
        || !getConfigurationValue('PMealDay')
        || !getConfigurationValue('MMealDay')
        || !getConfigurationValue('SMealDay')
        || !getConfigurationValue('RefTaxes')) {
        throw new Error("La configuration des repas dans le fichier de configuration est invalide");

    }

    // *** Insert retreat
    let newLine = {
        "fk_product": registration.product.id,
        "array_options": {
            "options_lin_datedebut": startDate,
            "options_lin_datefin": endDate,
            "options_lin_room": null, "options_roomid": "0"
        },
        "qty": daysNumber,
        "subprice": registration.product.multiprices_ttc[1]
    }
    computedOrderlines.push(newLine);

    // *** Insert meals 
    if (registration.breakfast !== null || registration.lunch !== null || registration.diner !== null) {
        let mealPMSTypeId = ""
        let intakeplace = "";
        // the intake place is the same for all mealtypes
        //    if (registration.intakeplacebreakfast === registration.intakeplacelunch && registration.intakeplacelunch === registration.intakeplacediner) {

        /*      if (registration.breakfast && registration.lunch && registration.diner) {
                mealPMSTypeId = getConfigurationValue('PMSMealDay')
        
              } else if (registration.breakfast && registration.lunch && !registration.diner) {
                mealPMSTypeId = getConfigurationValue('PMMealDay');
        
              } else if (registration.breakfast && !registration.lunch && registration.diner) {
                mealPMSTypeId = getConfigurationValue('PSMealDay');
        
              } else if (!registration.breakfast && registration.lunch && registration.diner) {
                mealPMSTypeId = getConfigurationValue('MSMealDay');
        
              } else if (registration.breakfast && !registration.lunch && !registration.diner) {
                mealPMSTypeId = getConfigurationValue('PMealDay');
        
              } else if (!registration.breakfast && registration.lunch && !registration.diner) {
                mealPMSTypeId = getConfigurationValue('MMealDay');
              } else if (!registration.breakfast && !registration.lunch && registration.diner) {
                mealPMSTypeId = getConfigurationValue('SMealDay');
              }
               computedOrderlines.push({
                "fk_product": mealPMSTypeId, // 371',
                "array_options": {
                  "options_lin_datedebut": startDate,
                  "options_lin_datefin": endDate,
                  "options_lin_room": registration.mealType.rowid,
                  "options_lin_intakeplace": registration.intakeplacediner,
                  // "options_lin_mealtype": registration.mealType
                },
                "qty": daysNumber
              });
         */
        //   } else {
        if (registration.breakfast !== null) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('PMealDay'), // 371',
                "array_options": {
                    "options_lin_datedebut": startDate,
                    "options_lin_datefin": endDate,
                    "options_lin_room": registration.mealType.rowid,
                    "options_lin_intakeplace": registration.intakeplace,
                    // "options_lin_mealtype": registration.mealType
                },
                "qty": daysNumber
            });
        }

        if (registration.lunch !== null) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('MMealDay'), // 371',
                "array_options": {
                    "options_lin_datedebut": startDate,
                    "options_lin_datefin": endDate,
                    "options_lin_room": registration.mealType.rowid,
                    "options_lin_intakeplace": registration.intakeplace,
                    //"options_lin_mealtype": registration.mealType
                },
                "qty": daysNumber
            });
        }

        if (registration.diner !== null) {
            computedOrderlines.push({
                "fk_product": getConfigurationValue('SMealDay'), // 371',
                "array_options": {
                    "options_lin_datedebut": startDate,
                    "options_lin_datefin": endDate,
                    "options_lin_room": registration.mealType.rowid,
                    "options_roomid": "0",
                    "options_lin_intakeplace": registration.intakeplace,
                    // "options_lin_mealtype": registration.mealType
                },
                "qty": daysNumber
            });
        }
        //}
    }

    // *** Insert hosting
    if (registration.hostingType !== null) {
        computedOrderlines.push({
            "fk_product": registration.hostingType.id,
            "array_options": {
                "options_lin_datedebut": startDate,
                "options_lin_datefin": endDate,
                "options_lin_room": null, "options_roomid": "0"
            },
            "qty": daysNumber
        });

        // *** Insert Taxes
        computedOrderlines.push({
            "fk_product": getConfigurationValue('RefTaxes'),
            "array_options": {
                "options_lin_datedebut": startDate,
                "options_lin_datefin": endDate,
                "options_lin_room": null, "options_roomid": "0"
            },
            "qty": daysNumber
        });
    }

    return computedOrderlines;
}




