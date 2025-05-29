import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';

/**
 * Load the language list from the database
 * the languages list is saved in the localStorage 
 */
export async function getProducts() {

    console.log("getProducts Service start");
    var wsUrl = wsUrlformel + `products?DOLAPIKEY=${DOLAPIKEY}`;
    // let params = `&start=${startDate}&end=${endDate}&DOLAPIKEY=49eb4728329c67eb31fd794fedbb43215a33fb3b&limit=1000`;
    let params = ``;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        let data = await responsefr.json();
        localStorage.setItem("products", JSON.stringify(data));

        // console.log("getHostingBooking  await ok ");
        return (data);

    } else {
        console.log(`getProducts Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getProducts Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

export function getResourceProducts() {

    let productsJson = localStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("RES") && product.status === '1');
}



export function getHostingProducts() {

    let productsJson = localStorage.getItem("products");
    let products = JSON.parse(productsJson);

    return products.filter(product => product.ref.startsWith("HEB"));
}

/**
 * 
 * @returns 
 */
export async function getintakeplacesTypesFromAPI() {
    // TODO : à replacer ddans un service globallists
    console.log("intakePlaces Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/intakeplaces?DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("intakePlaces", JSON.stringify(data));

        // console.log("getHostingBooking  await ok ");
        return (data);

    } else {
        console.log(`intakePlaces Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getProdintakePlacesucts Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}


/**
 * 
 * @returns 
 */
export async function getMealTypesFromAPI() {
    // TODO : à replacer ddans un service globallistsdictionary/?sortorder=ASC&limit=100&active=1
    console.log("getMealTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/mealtypes?DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("mealtypes", JSON.stringify(data));

        console.log("getMealTypesFromAPI  ok ");
        return (data);

    } else {
        console.log(`getMealTypesFromAPI Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getMealTypesFromAPI Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}

export function getintakeplacesTypes() {

    let placesJson = localStorage.getItem("intakePlaces");
    let places = JSON.parse(placesJson);

    return places;
}

// return axios.get(
//     CONST_APIURLKUSALA +
//     "dklaccueil/dictionary/intakeplaces?sortorder=ASC&limit=100&active=1" +
//     "&DOLAPIKEY=" +
//     getUserToken(),
// )




/**
 * 
 * @returns 
 */
export async function getIncomeLevelsTypesFromAPI() {
    // TODO : à replacer ddans un service globallistsdictionary/?sortorder=ASC&limit=100&active=1
    console.log("getIncomeLevelsTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/incomeleveltypes?sortfield=code&sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("mealtypes", JSON.stringify(data));

        console.log("getIncomeLevelsTypesFromAPI  ok ");
        return (data);

    } else {
        console.log(`getIncomeLevelsTypesFromAPI Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getIncomeLevelsTypesFromAPI Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}

/**
 * 
 * @returns 
 */
export async function getPublipostageTypesFromAPI() {
    // TODO : à replacer ddans un service globallistsdictionary/?sortorder=ASC&limit=100&active=1
    console.log("getPublipostageTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/publipostagetypes?sortfield=code&sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("publipostageTypes", JSON.stringify(data));

        console.log("getPublipostageTypesFromAPI  ok ");
        return (data);

    } else {
        console.log(`getPublipostageTypesFromAPI Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getPublipostageTypesFromAPI Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}


// getCustomerCivilitiesTable
// setup/dictionary/civilities?sortfield=code&sortorder=ASC&limit=100&active=1


// getCountriesTable
// setup/dictionary/countries?sortfield=label&sortorder=ASC&sqlfilters=(active:=:1)