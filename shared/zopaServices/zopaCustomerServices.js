import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';



/**
 * 
 * @param {*} customerID 
 * @returns 
 */
export async function getCustomer(customerID) {

    // TODO : tester la validité des paramètres
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
        console.log(`getCustomer Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getCustomer Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}
/**
 * 
 * @param {*} customerID 
 * @returns 
 */
export async function getCustomerOrders(customerID) {

    // TODO : tester la validité des paramètres
    var wsUrl = wsUrlformel + `dklaccueil/fullorders?thirdparty_ids=${customerID}&DOLAPIKEY=${DOLAPIKEY}`;


    let responsefr = await fetch(wsUrl
        , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    // ***no order for this customer
    if (responsefr.ok == false)
        if (responsefr.status == '404')
            return null;

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        if (responsefr.status == '404')
            return null;
        const data = responsefr.json();

        sessionStorage.setItem("customerOrders", JSON.stringify(data));
        // console.log("getCustomerOrders  await ok ");
        return (data);

    } else {
        console.log(`getCustomerOrders Error: ${JSON.stringify(responsefr)
            } `);
        throw new Error("getCustomerOrders Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

/**
 * 
 * @param {*} customerID 
 * @returns 
 */
export async function getCustomerInvoices(customerID) {

    // TODO : tester la validité des paramètres
    var wsUrl = wsUrlformel + `invoices?thirdparty_ids=${customerID}&DOLAPIKEY=${DOLAPIKEY}&sortfield=datec&sortorder=DESC
`;


    let responsefr = await fetch(wsUrl
        , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
            // params: JSON.stringify({
            //     sortfield: "datec",
            //     sortorder: "DESC",
            //     limit: "500"
            // })

            // // params: {
            // // }
            // ,
        }
    );

    // ***no order for this customer
    if (responsefr.ok == false)
        if (responsefr.status == '404')
            return null;

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        if (responsefr.status == '404')
            return null;
        const data = responsefr.json();
        sessionStorage.setItem("customerInvoices", JSON.stringify(data));
        // console.log("getCustomerOrders  await ok ");
        return (data);

    } else {
        console.log(`getCustomerOrders Error: ${JSON.stringify(responsefr)
            } `);
        throw new Error("getCustomerOrders Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}


export function evaluateCustomerSubscriptionStatus(customerOrders) {


    let computedSubscription = {
        subscriptionStatus: false,
        subscriptionLabel: "",
        subscriptionLevel: "",
        startSubscriptionDate: "",
        endSubscriptionDate: "",
        orderID: -1
    };
    // let customerOrders = store.getState().customerReducer.orders;
    customerOrders.forEach((order, index) => {
        // if (order.statut === '1' || order.statut === '3' || order.id === currentOrderId) {
        if (order.statut === '1' || order.statut === '3') {
            order.lines.forEach((orderLine, index) => {
                if (orderLine.ref) {
                    if (orderLine.ref.startsWith('ADH_')) {
                        if (new Date(orderLine.array_options.options_lin_datefin).getTime() > Date.now() / 1000) {
                            computedSubscription =
                            {
                                subscriptionStatus: true,
                                subscriptionLevel: orderLine.ref,
                                subscriptionLabel: orderLine.libelle,
                                startSubscriptionDate: orderLine.array_options.options_lin_datedebut,
                                endSubscriptionDate: orderLine.array_options.options_lin_datefin,
                                orderId: order.id
                            }
                        }
                    }
                }
            });
        }
    });
    return computedSubscription;
}
///****************************************************************
// DRAFTS */
// export async function getPaymentsByAccountCode(customerID) {

//     // TODO : tester la validité des paramètres
//     //    var wsUrl = wsUrlformel + `dklaccueil/fullorders?thirdparty_ids="${customerID}&DOLAPIKEY=${DOLAPIKEY}`;

//     // var wsUrl = wsUrlformel + `dklaccueil/fullorders?thirdparty_ids="${customerID}&DOLAPIKEY=${DOLAPIKEY}`;

//     var wsUrl = wsUrlformel + `dklaccueil/getPaymentsByAccountCode?startDate=2024-10-01 00:00+&endDate=2024-10-30 23:59&userId=0&DOLAPIKEY=${DOLAPIKEY}`;

//     let responsefr = await fetch(wsUrl, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         params: {
//             sortfield: "date_creation",
//             sortorder: "DESC",
//             limit: "500"
//         },
//     });

//     if (responsefr.ok) {
//         // *** Get the data and save in the sessionStorage
//         const data = await responsefr.json();
//         sessionStorage.setItem("customerOrders", JSON.stringify(data));
//         console.log("getCustomerOrders  await ok ");
//         return (data);

//     } else {
//         console.log(`getCustomerOrders Error: ${JSON.stringify(responsefr)
//             } `);
//         throw new Error("getCustomerOrders Error message : " + responsefr.status + " " + responsefr.statusText);
//     }

// }


