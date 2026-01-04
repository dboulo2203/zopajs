import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';

export async function getInvoice(invoiceID) {
    let wsUrl = wsUrlformel + `invoices/${invoiceID}?DOLAPIKEY=${DOLAPIKEY}`

    let responsefr = await fetch(wsUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("invoice", JSON.stringify(data));
        return (data);

    } else {
        console.log(`getInvoice Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getInvoice Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

export function getInvoiceLines(invoiceID) { }

export function validateInvoice(invoiceid) { }

export function cancelInvoice(invoiceid) { }

export function setToDraftInvoice(invoiceid) { }

export function getCustomerFixedAmountDiscounts(customerId) { }

export function createInvoicePayment(invoice, paymentType, paymentAmount, paymentIssuer, arrayOfAmounts) {
}

export async function getInvoicePayments(invoiceID) {
    let wsUrl = wsUrlformel + `invoices/${invoiceID}/payments?DOLAPIKEY=${DOLAPIKEY}`

    let responsefr = await fetch(wsUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("invoice", JSON.stringify(data));
        return (data);

    } else {
        console.log(`getInvoice Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getInvoice Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

export function putUseFixedAmountDiscount(invoiceid, discountId) { }

export function generateInvoicePdfDocument(invoice) { }

export function createCreditnoteForInvoice(invoice, creditNote) { }

export function markAsCreditAvailable(invoiceid) { }


export function setInvoiceToZero(invoiceID, orderId) { }

export function sendPaymentRequest(requestData) { }











