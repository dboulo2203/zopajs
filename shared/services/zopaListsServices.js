import { wsUrlformel, DOLAPIKEY } from '../assets/constants.js';



/**
 * Return the List content (json string)
 * @returns 
 */
export function getList(listName) {
    let frBase = sessionStorage.getItem(listName);
    if (frBase)
        return JSON.parse(frBase);
    else
        return null;
}


export function getSelectFromDatabaseList(listName, entityID, entityName, selectValue) {
    let outpuStr = ``;
    getList(listName).map((listentity, index) => {
        if (selectValue && selectValue === listentity[entityID])
            outpuStr += `<option value="${listentity[entityID]}" selected>${listentity[entityName]}</option>`;
        else
            outpuStr += `<option value="${listentity[entityID]}">${listentity[entityName]}</option>`;
    });
    return outpuStr;
}

export function getSelectFromDatabaseListDropdown(listName, entityID, entityName, selectValue) {
    let outpuStr = ``;
    // if (addZeroOption)
    //     outpuStr += `<li><a class="dropdown-item ${listName}_item" selectedId="0" selectedName=""> --- </a> </li>`;

    getList(listName).map((listentity, index) => {
        //  let test1 = entityID.valueOf();
        // let test = listentity[entityID];
        if (selectValue == listentity[entityID])
            outpuStr += `<li ><a  class="dropdown-item ${listName}_item active" selectedId="${listentity[entityID]}" selectedName="${listentity[entityName]}">${listentity[entityName]}</a></li>`;
        else
            outpuStr += `<li><a class="dropdown-item ${listName}_item" selectedId="${listentity[entityID]}" selectedName="${listentity[entityName]}">${listentity[entityName]}</a></li>`;
    });

    // outpuStr += `<li><a class="dropdown-item ${listName}_item" selectedId="${listentity[entityID]}" selectedName="${listentity[entityName]}">${listentity[entityName]}</a></li>`;
    // });
    return outpuStr;
}


/**
 * Translate a string in the current browser language
 * @param {} wordToTranslate 
 * @returns 
 */
export function getvalue(listName, entityID, valueID) {

    // *** Get the database according to the current language in the browser
    let frBase = sessionStorage.getItem(listName);
    let base = JSON.parse(frBase);

    if (!base)
        return "Erreur table " + listName;

    let valeur = base.find((listElem, index) => {
        listElem.rowid == valueID;
    });
    // let foundIndex = Object.keys(base).indexOf(valueID);

    // let valeur = '';
    // if (foundIndex >= 0)
    //     valeur = (Object.values(base)[foundIndex]);
    // else
    //     valeur = '!! Translation not found !! ';

    return valeur;

}

// export function getSelectFromDatabaseList(listName, selectID, entityID, entityName) {
//     let outpuStr = `
//       <div class="col" style="margin:2px">
//       <select class="form-select form-select-sm"  aria-label="Default select example" id="${selectID}">`;
//     getList(listName).map((listentity, index) => {
//         outpuStr += `<option value="${listentity[entityID]}">${listentity[entityName]}</option>`;
//     });
//     outpuStr += `
//         </select> </div>`;
//     return outpuStr;
// }

/** in Yeshe V2 */
export function getDolibarrStatus() { }
export function getConfiguration() { }
export async function loadCivilitiesTable() {

    let frBase = sessionStorage.getItem("civilities");
    let base = JSON.parse(frBase);
    if (base)
        return true;

    var wsUrl = wsUrlformel + `setup/dictionary/civilities?DOLAPIKEY=${DOLAPIKEY}`;
    //let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("civilities", JSON.stringify(data));
        return true;

    } else {
        console.log(`getCustomerCivilitiesTable Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getCustomerCivilitiesTable Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}

export function getCustomerCivilityLabel(civility_id) { }

export async function loadPublipostageTable() {
    let frBase = sessionStorage.getItem("publipostages");
    let base = JSON.parse(frBase);
    if (base)
        return true;

    var wsUrl = wsUrlformel + `dklaccueil/dictionary/publipostagetypes?sortfield=code&sortorder=ASC&limit=100&DOLAPIKEY=${DOLAPIKEY}`;
    //let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("publipostages", JSON.stringify(data));
        return true;

    } else {
        console.log(`getPublipostageTable Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getPublipostageTable Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}
export async function loadIncomeLevelsTable() {
    let frBase = sessionStorage.getItem("incomeLevels");
    let base = JSON.parse(frBase);
    if (base)
        return true;

    var wsUrl = wsUrlformel + `dklaccueil/dictionary/incomeleveltypes?sortfield=code&sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
    //let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("incomeLevels", JSON.stringify(data));
        return true;

    } else {
        console.log(`getIncomesLevelTable Error : ${JSON.stringify(responsefr)}`);
        throw new Error("getIncomesLevelTable Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}
export function getPaymentTypes() { }
export function loadCountriesTable() { }

export async function loadUsersTable() {
    //  console.log("getMealTypesFromAPI Service start");
    var wsUrl = wsUrlformel + `users/?DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&sortorder=ASC&limit=100&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("users", JSON.stringify(data));
        return true;

    } else {
        console.log(`loadUsersFromAPI Error : ${JSON.stringify(responsefr)}`);
        throw new Error("loadUsersFromAPI Error message : " + responsefr.status + " " + responsefr.statusText);
    }
}

export function getUserLoginFromId(id) {
    let basejson = sessionStorage.getItem("users");
    let base = JSON.parse(basejson);

    let foundIndex = Object.keys(base).indexOf(id);
    let valeur = null;
    if (foundIndex >= 0)
        valeur = (Object.values(base)[foundIndex].login);


    return valeur;

}
export function getintakeplaces() {


}

export function getmealTypesDirect() { }
export function getmealTypes() { }

// /**
//  * 
//  * @returns 
//  */
// export async function getintakeplacesTypes() {
//     // TODO : à replacer ddans un service globallists
//     // console.log("intakePlaces Service start");

//     // is intakeplaces already loaded
//     let frBase = sessionStorage.getItem("intakePlaces");
//     let base = JSON.parse(frBase);
//     if (base)
//         return true;

//     var wsUrl = wsUrlformel + `dklaccueil/dictionary/intakeplaces?DOLAPIKEY=${DOLAPIKEY}`;
//     let params = `&sortorder=ASC&limit=100&active=1`;
//     let responsefr = await fetch(wsUrl + params);

//     if (responsefr.ok) {
//         // *** Get the data and save in the sessionStorage
//         const data = await responsefr.json();
//         sessionStorage.setItem("intakePlaces", JSON.stringify(data));

//         return true;
//         return (data);

//     } else {
//         console.log(`intakePlaces Error : ${JSON.stringify(responsefr)}`);
//         throw new Error("getProdintakePlacesucts Error message : " + responsefr.status + " " + responsefr.statusText);
//     }
// }

/**
 * 
 * @returns 
 */
export async function loadintakeplacesTable() {

    var wsUrl = wsUrlformel + `dklaccueil/dictionary/intakeplaces?DOLAPIKEY=${DOLAPIKEY}`;
    let params = `&active=1`;
    let responsefr = await fetch(wsUrl + params);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        sessionStorage.setItem("intakeplaces", JSON.stringify(data));

        return (data);

    } else {
        throw new Error("loadintakeplacesTable Error message : " + responsefr.status + " " + responsefr.statusText);
    }

    let placesJson = sessionStorage.getItem("intakePlaces");
    let places = JSON.parse(placesJson);

    return places;
}

/**
 * 
 * @returns 
 */
export async function loadMealsTable() {
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
export async function TableIncomeLevelsTable() {
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

// /**
//  *
//  * @returns
//  */
// export async function loadPublipostageTable() {
//     // TODO : à replacer ddans un service globallistsdictionary/?sortorder=ASC&limit=100&active=1
//     // console.log("getPublipostageTypesFromAPI Service start");
//     var wsUrl = wsUrlformel + `dklaccueil/dictionary/publipostagetypes?sortfield=code&sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
//     let params = `&sortorder=ASC&limit=100&active=1`;
//     let responsefr = await fetch(wsUrl + params);

//     if (responsefr.ok) {
//         // *** Get the data and save in the sessionStorage
//         const data = await responsefr.json();
//         sessionStorage.setItem("publipostageTypes", JSON.stringify(data));

//         // console.log("getPublipostageTypesFromAPI  ok ");
//         return (data);

//     } else {
//         console.log(`getPublipostageTypesFromAPI Error : ${JSON.stringify(responsefr)}`);
//         throw new Error("getPublipostageTypesFromAPI Error message : " + responsefr.status + " " + responsefr.statusText);
//     }
// }


// getCustomerCivilitiesTable
// setup/dictionary/civilities?sortfield=code&sortorder=ASC&limit=100&active=1


// getCountriesTable
// setup/dictionary/countries?sortfield=label&sortorder=ASC&sqlfilters=(active:=:1)