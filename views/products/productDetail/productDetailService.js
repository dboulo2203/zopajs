import { getConfigurationValue } from '../../../shared/services/configurationService.js';
import { fetchOrders } from '../../../shared/zopaServices/zopaBusinesslistsService.js';
import { getUSerToken } from '../../../shared/zopaServices/zopaLoginServices.js';
// import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';

// Récupérer les détails d'un produit par son ID
export async function fetchProductDetails(productId) {
    try {
        const apiUrl = `${getConfigurationValue("wsUrlformel")}products/${productId}?DOLAPIKEY=${getUSerToken()}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Erreur lors du chargement des détails du produit:', error);
        throw error;
    }
}

// Récupérer la liste des commandes inscrites à un stage/produit
export async function fetchRegisteredPersons(productId) {
    try {
        const apiUrl = `${getConfigurationValue("wsUrlformel")}dklaccueil/${productId}/registered?DOLAPIKEY=${getUSerToken()}`;
        const response = await fetch(apiUrl);

        // L'API retourne 404 quand aucun résultat n'est trouvé
        if (response.status === 404) {
            return [];
        }

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();

        // ** Build the orders id list
        let resultTab = data.map(element => element.fk_commande).join(',');

        // *** Get the orders data
        let dataEnd = fetchOrders("", 'commandeorderidslist', 0, null, null, resultTab);

        return dataEnd || [];
    } catch (error) {
        console.error('Erreur fetchRegisteredPersons :', error);
        throw error;
    }
}
