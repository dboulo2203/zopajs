import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';

/** in Yeshe V2 */
export function getDolibarrStatus() { }
export function getConfiguration() { }
export function getCustomerCivilitiesTable() { }
export function getCustomerCivilityLabel(civility_id) { }
export function getPublipostageTable() { }
export function getIncomesLevelTable() { }
export function getPaymentTypes() { }
export function getCountriesTable() { }
export function getUsers() { }
export function getUserLoginFromId(id) { }
export function getintakeplaces() { }
export function getIntakePlacesTypesDirect() { }
export function getmealTypesDirect() { }
export function getmealTypes() { }

/**
 * 
 * @returns 
 */
export async function getintakeplacesTypesFromAPI() {
    // TODO : à replacer ddans un service globallists
    // console.log("intakePlaces Service start");

    // is intakeplaces already loaded
    let frBase = sessionStorage.getItem("intakePlaces");
    let base = JSON.parse(frBase);
    if (base)
        return true;

    var wsUrl = wsUrlformel + `dklaccueil/dictionary/intakeplaces?DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("intakePlaces", JSON.stringify(data));

        return true;
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
export function getintakeplacesTypes() {

    let placesJson = sessionStorage.getItem("intakePlaces");
    let places = JSON.parse(placesJson);

    return places;
}

/**
 * 
 * @returns 
 */
export async function getMealTypesFromAPI() {
    // TODO : à replacer ddans un service globallistsdictionary/?sortorder=ASC&limit=100&active=1
    //  console.log("getMealTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/mealtypes?DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("mealtypes", JSON.stringify(data));

        console.log("getMealTypesFromAPI  ok ");
        return (data);

    } else {
        console.log(`getMealTypesFromAPI Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getMealTypesFromAPI Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}


/**
 * 
 * @returns 
 */
export async function getIncomeLevelsTypesFromAPI() {
    // TODO : à replacer ddans un service globallistsdictionary/?sortorder=ASC&limit=100&active=1
    // console.log("getIncomeLevelsTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/incomeleveltypes?sortfield=code&sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("mealtypes", JSON.stringify(data));

        //  console.log("getIncomeLevelsTypesFromAPI  ok ");
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
    // console.log("getPublipostageTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `dklaccueil/dictionary/publipostagetypes?sortfield=code&sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("publipostageTypes", JSON.stringify(data));

        // console.log("getPublipostageTypesFromAPI  ok ");
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