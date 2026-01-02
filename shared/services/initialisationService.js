

import { currentApplicationPath } from '../assets/constants.js'
import { getProducts } from './zopaProductServices.js'
import {
    getintakeplacesTypesFromAPI, getMealTypesFromAPI,
    getIncomeLevelsTypesFromAPI, getPublipostageTypesFromAPI
} from './zopaListsServices.js'
import { loadTranslations } from './translationService.js'

/**
 * 
 */
export async function launchInitialisation() {

    // await loadTranslations();
    // await getMealTypesFromAPI();
    // await getLanguages();
    await loadTranslations();
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

    window.location.href = `${currentApplicationPath}/views/mainpage/mainpage.html`;

}
