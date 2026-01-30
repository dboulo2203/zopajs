import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';

/**
 * Load the products from the database
 * the products list is saved in the sessionStorage 
 */
export async function loadProducts() {

    var wsUrl = wsUrlformel + `products?DOLAPIKEY=${DOLAPIKEY}`;
    let params = ``;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        let data = await responsefr.json();
        sessionStorage.setItem("products", JSON.stringify(data));
        return (data);

    } else {
        console.log(`getProducts Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getProducts Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}

/**
 * 
 * @returns 
 */
export function getAllProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products;
}

/**
 * 
 * @returns 
 */
export function getAllActiveProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.status === '1');
};

/**
 * 
 * @returns 
 */
export function getResourceProducts() {

    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("RES") && product.status === '1');
}

/**
 * 
 * @returns 
 */
export function getTranslationProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("TRA") && product.status === '1');
}

/**
 * 
 * @returns 
 */
export function getHostingProducts() {

    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("HEB"));
}

/**
 * 
 * @returns 
 */
export function getHostingActiveProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("HEB") && product.status === '1');
}
/**
 * 
 * @returns 
 */
export function getMealProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("REP"));

}
/**
 * 
 * @returns 
 */
export function getMealActiveProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("REP") && product.status === '1');
}

/**
 * 
 * @returns 
 */
export function getSubscriptionProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("ADH"));

}

/**
 * 
 * @returns 
 */
export function getSubscriptionActiveProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("ADH") && product.status === '1');

}
/**
 * 
 */
export function getRestaurantProducts() { }

/**
 * 
 * @returns 
 */
export function getSessionProducts() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("TRA") && product.status === '1' && (new Date(product.array_options.options_sta_datefin * 1000).setHours(0, 0, 0, 0) >= tomorrow.setHours(0, 0, 0, 0)));


}
/**
 * 
 * @returns 
 */
export function getSessionProductswithoutFilter() {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("TRA"));

}
/**
 * 
 * @param {*} ref 
 * @returns 
 */
export function getProductFromRef(ref) {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref === ref);
}
/**
 * 
 * @param {*} id 
 * @returns 
 */
export function getProductFromId(id) {
    let productsJson = sessionStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.id === id);

}

