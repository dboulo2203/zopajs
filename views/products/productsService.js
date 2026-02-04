import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';

// Rechercher des produits par chaîne de recherche
export async function searchProducts(searchString) {
    try {
        // Construire le filtre SQL pour rechercher dans label et ref
        const sqlFilters = `(t.label:like:'%25${encodeURIComponent(searchString)}%25') OR (t.ref:like:'%25${encodeURIComponent(searchString)}%25')`;
        const apiUrl = `${wsUrlformel}products?sqlfilters=${sqlFilters}&DOLAPIKEY=${DOLAPIKEY}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        throw error;
    }
}
