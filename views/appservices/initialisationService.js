

import { getAppPath } from '../../shared/services/commonFunctions.js'
import { getProducts } from '../../shared/services/zopaProductServices.js'
import {
    getintakeplacesTypesFromAPI, getMealTypesFromAPI,
    getIncomeLevelsTypesFromAPI, getPublipostageTypesFromAPI, loadUsersFromAPI
} from '../../shared/services/zopaListsServices.js'
import { loadTranslations } from '../../shared/services/translationService.js'

/**
 * 
 */
export async function launchInitialisation() {

    // await loadTranslations();
    // await getMealTypesFromAPI();
    // await getLanguages();
    await loadTranslations();
    await loadUsersFromAPI();
    await getProducts();
    await getintakeplacesTypesFromAPI();
    await getMealTypesFromAPI();
    await getIncomeLevelsTypesFromAPI();
    await getPublipostageTypesFromAPI();

}

/**
 * 
 */
export async function launchMainComponent() {

    window.location.href = `${getAppPath()}/views/mainpage/mainpage.html`;

}
