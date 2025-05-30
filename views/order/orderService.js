import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';


export async function getOrder(orderID) {

    // TODO : tester la validité des paramètres

    let wsUrl = wsUrlformel + `dklaccueil/fullorders?sortorder=ASC&limit=1&sqlfilters=t.rowid%3D${orderID}&DOLAPIKEY=${DOLAPIKEY}`

    let responsefr = await fetch(wsUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("order", JSON.stringify(data[0]));
        console.log("getOrder  await ok ");
        return (data[0]);

    } else {
        console.log(`getOrder Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getOrder Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}