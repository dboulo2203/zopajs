import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';


export async function getcomponentFrame(customerID) {

    // TODO : tester la validité des paramètres

    // *** Call the web service
    var wsUrl = wsUrlformel + `thirdparties/${customerID}?DOLAPIKEY=${DOLAPIKEY}`;
    let params = ``;
    let responsefr = await fetch(wsUrl + params, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        params: {
            sortfield: "name",
            limit: 500,
        }

    });
    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("customer", JSON.stringify(data));
        console.log("getCustomer  await ok ");
        return (data);

    } else {
        // *** Manage errors
        console.log(`getCustomer Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getCustomer Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}
