

import { loadTranslations, getCurrentLanguage } from '../services/translationService.js'
import { currentApplicationPath } from '../assets/constants.js'
/**
 * 
 */
export async function launchInitialisation() {

    // await loadTranslations();
    // await getMealTypesFromAPI();
    // await getLanguages();
}

/**
 * 
 */
export async function launchMainComponent() {

    window.location.href = `${currentApplicationPath}/views/mainpage/mainpage.html`;

}
