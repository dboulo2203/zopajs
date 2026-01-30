

import { getAppPath } from '../../shared/services/commonFunctions.js'
import { getConfigurationFromJson } from '../../shared/services/configurationService.js'
import { loadProducts } from '../../shared/zopaServices/zopaProductServices.js'
import {
    loadintakeplacesTable, loadMealsTable,
    loadUsersTable,
    loadCivilitiesTable, loadPublipostageTable, loadIncomeLevelsTable
} from '../../shared/zopaServices/zopaListsServices.js'

import { initWebComponents } from '../../shared/bootstrapServices/components.js'
import { setTheme } from '../../shared//bootstrapServices/bootstrapTheme.js'

import { loadTranslations } from '../../shared/services/translationService.js'

/**
 * 
 */
export async function launchInitialisation() {

    await getConfigurationFromJson();
    initWebComponents();
    setTheme();
    await loadTranslations();
    await loadUsersTable();
    await loadProducts();
    await loadintakeplacesTable();
    await loadMealsTable();
    await loadCivilitiesTable();
    await loadPublipostageTable();
    await loadIncomeLevelsTable();
    await loadintakeplacesTable()
}

/**
 *
 */
// export async function launchMainComponent() {
//     window.location.href = `${getAppPath()}/views/mainpage/mainpage.html`;
// }
