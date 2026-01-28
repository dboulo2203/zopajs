

import { getAppPath } from '../../shared/services/commonFunctions.js'
import { getConfigurationFromJson } from '../../shared/services/configurationService.js'
import { loadProducts } from '../../shared/services/zopaProductServices.js'
import { initWebComponents } from '../../shared/services/webComponents.js'
import { setTheme } from '../../shared/services/bootstrapTheme.js'
import {
    loadintakeplacesTable, loadMealsTable,
    loadUsersTable,
    loadCivilitiesTable, loadPublipostageTable, loadIncomeLevelsTable
} from '../../shared/services/zopaListsServices.js'
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
