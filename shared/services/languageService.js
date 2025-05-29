import { wsUrlformel } from '../assets/constants.js';

/**
 * Load the language list from the database
 * the languages list is saved in the localStorage 
 */
export async function getLanguages() {

    var wsUrl = wsUrlformel + `list/bdd_language`;

    let responseWS = await fetch(wsUrl);

    if (responseWS.ok) {
        // *** Get the data and save in the localstorage
        const data = await responseWS.json();
        localStorage.setItem("languages", JSON.stringify(data.content));
        return true;
    } else {
        console.log(`getLanguages Error : }`);
        throw new Error("getLanguages Error : " + JSON.stringify(responseWS));
    }
}

/**
 * Return the language list (json string)
 * @returns 
 */
export function getLanguagesList() {
    let frBase = localStorage.getItem("languages");
    if (frBase)
        return JSON.parse(frBase);
    else
        return null;

}