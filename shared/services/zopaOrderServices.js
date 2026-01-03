import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';


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