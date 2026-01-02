import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';

/**
 * Load the language list from the database
 * the languages list is saved in the sessionStorage 
 */
export async function getProducts() {

    // console.log("getProducts Service start");
    var wsUrl = wsUrlformel + `products?DOLAPIKEY=${DOLAPIKEY}`;
    // let params = `&start=${startDate}&end=${endDate}&DOLAPIKEY=49eb4728329c67eb31fd794fedbb43215a33fb3b&limit=1000`;
    let params = ``;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        let data = await responsefr.json();
        sessionStorage.setItem("products", JSON.stringify(data));

        // console.log("getHostingBooking  await ok ");
        return (data);

    } else {
        console.log(`getProducts Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getProducts Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}
export function getAllProducts() { }

export function getResourceProducts() {

    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("RES") && product.status === '1');
}

export function getTranslationProducts() { }

export function getHostingProducts() {

    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("HEB"));
}
export function getHostingActiveProducts() { }
export function getMealProducts() { }
export function getMealActiveProducts() { }
export function getSubscriptionProducts() { }
export function getSubscriptionActiveProducts() { }
export function getRestaurantProducts() { }
export function getSessionProducts() { }
export function getSessionProductswithoutFilter() { }
export function getProductFromRef(ref) { }
export function getProductFromId(id) { }

