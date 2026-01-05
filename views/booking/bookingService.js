import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';

/**
 * Get the hosting data fro a period
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} addedOrderId 
 * @returns 
 */
export async function getHostingBooking(startDate, endDate, addedOrderId) {

    // TODO : tester la validité des paramètres
    var wsUrl = wsUrlformel + `dklaccueil/booking?DOLAPIKEY=${DOLAPIKEY}`;
    wsUrl += `&start=${startDate}&end=${endDate}`;
    // let params = ``;
    let responsefr = await fetch(wsUrl, {
        method: "GET",
        redirect: "follow"
    });

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("bookingdata", JSON.stringify(data));
        console.log("getHostingBooking  await ok ");
        return (data);

    } else {
        console.log(`getHostingBooking Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getHostingBooking Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}


/**
 * 
 * @returns Copy hosting data to clipboard
 */
export function copyToClipboard(tabFullResult, bookingLines) {
    var textToCopy = "";
    if (tabFullResult[0] === undefined) {
        confirm({
            description: "Veuillez sélectionner une période d'analyse",
            title: 'Copie tableau dans le clipboard',
            cancellationText: "",
            confirmationButtonProps: { autoFocus: true }
        })
        return;
    }
    // ** Copy day names
    tabFullResult[0].map((dayName, index) => (
        textToCopy += dayName + "\t"
    ));
    textToCopy += "\n";
    // Copy room lines    
    tabFullResult.map((resultline, index) => {
        if (index > 0) {
            resultline.map((cellule, indexCell) => {
                if (cellule === 0 || cellule === 'x0') {
                    textToCopy += '' + "\t"
                } else {
                    if (indexCell > 0) {
                        let cellulemod = cellule;
                        if (cellulemod.substring(0, 1) === 'x')
                            cellulemod = cellulemod.substring(1, cellulemod.length);

                        if (cellulemod.substring(cellulemod.indexOf('|') + 1, cellulemod.length) == '0') {
                            let orderID = cellulemod.substring(0, cellulemod.indexOf('|'));
                            let bookingLineFound = bookingLines[0].find((bookingLine) => bookingLine.fk_commande == orderID);
                            textToCopy += '*' + bookingLineFound.customername + "\t";

                        } else {
                            let orderID = cellulemod.substring(0, cellule.indexOf('|'));
                            let bookingLineFound = bookingLines[0].find((bookingLine) => bookingLine.fk_commande == orderID);
                            if (bookingLineFound)
                                textToCopy += '' + bookingLineFound.customername + "\t";
                            else
                                textToCopy += 'Order not found' + "\t";
                        }
                    } else {
                        textToCopy += cellule.label + "\t"
                    }
                }
            })
            textToCopy += "\n"
        }
    });
    navigator.clipboard.writeText(textToCopy);
    // confirm({
    //     description: "Le tableau d'occupation a été copié dans le clipboard",
    //     title: 'Copie tableau dans le clipboard',
    //     cancellationText: "",
    //     confirmationButtonProps: { autoFocus: true }
    // })
};




