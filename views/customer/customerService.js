import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';


export async function getCustomer(customerID) {

    // TODO : tester la validité des paramètres
    var wsUrl = wsUrlformel + `thirdparties/${customerID}?DOLAPIKEY=${DOLAPIKEY}`;
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
        localStorage.setItem("customer", JSON.stringify(data));
        console.log("getCustomer  await ok ");
        return (data);

    } else {
        console.log(`getCustomer Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getCustomer Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

export async function getCustomerOrders(customerID) {

    // TODO : tester la validité des paramètres
    var wsUrl = wsUrlformel + `dklaccueil/fullorders?thirdparty_ids=${customerID}&DOLAPIKEY=${DOLAPIKEY}`;


    let responsefr = await fetch(wsUrl
        //     , {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     params: {
        //         sortfield: "datec",
        //         sortorder: "DESC",
        //         limit: "400"
        //     },
        // }
    );

    // ***no order for this customer
    if (responsefr.ok == false)
        if (responsefr.status == '404')
            return null;


    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        if (responsefr.status == '404')
            return null;
        const data = await responsefr.json();
        localStorage.setItem("customerOrders", JSON.stringify(data));
        console.log("getCustomerOrders  await ok ");
        return (data);

    } else {
        console.log(`getCustomerOrders Error: ${JSON.stringify(responsefr)
            } `);
        throw new Error("getCustomerOrders Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}




///****************************************************************
// DRAFTS */
export async function getPaymentsByAccountCode(customerID) {

    // TODO : tester la validité des paramètres
    //    var wsUrl = wsUrlformel + `dklaccueil/fullorders?thirdparty_ids="${customerID}&DOLAPIKEY=${DOLAPIKEY}`;

    // var wsUrl = wsUrlformel + `dklaccueil/fullorders?thirdparty_ids="${customerID}&DOLAPIKEY=${DOLAPIKEY}`;

    var wsUrl = wsUrlformel + `dklaccueil/getPaymentsByAccountCode?startDate=2024-10-01 00:00+&endDate=2024-10-30 23:59&userId=0&DOLAPIKEY=${DOLAPIKEY}`;

    let responsefr = await fetch(wsUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            sortfield: "date_creation",
            sortorder: "DESC",
            limit: "500"
        },
    });

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("customerOrders", JSON.stringify(data));
        console.log("getCustomerOrders  await ok ");
        return (data);

    } else {
        console.log(`getCustomerOrders Error: ${JSON.stringify(responsefr)
            } `);
        throw new Error("getCustomerOrders Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}


