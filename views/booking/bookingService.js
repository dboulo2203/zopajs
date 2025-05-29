import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';


export async function getHostingBooking(startDate, endDate, addedOrderId) {

    // TODO : tester la validité des paramètres
    var wsUrl = wsUrlformel + `dklaccueil/booking?DOLAPIKEY=${DOLAPIKEY}`;
    wsUrl += `&start=${startDate}&end=${endDate}&limit=1000`;
    let params = ``;
    let responsefr = await fetch(wsUrl + params, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("bookingdata", JSON.stringify(data));
        console.log("getHostingBooking  await ok ");
        return (data);

    } else {
        console.log(`getHostingBooking Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getHostingBooking Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}


