import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';

// Récupérer les noms des lieux depuis l'API
export async function fetchIntakePlaces() {
    try {
        const apiUrl = `${wsUrlformel}dklaccueil/dictionary/intakeplaces?sortorder=ASC&limit=100&active=1&DOLAPIKEY=${DOLAPIKEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const places = {};
        data.forEach(item => {
            places[item.rowid] = item.label;
        });
        return places;
    } catch (error) {
        console.error('Erreur lors du chargement des lieux:', error);
        return {};
    }
}

// Récupérer les IDs des produits repas depuis l'API (ref commence par "REP" et tosell = 1)
export async function fetchMealProductIds() {
    try {
        const apiUrl = `${wsUrlformel}products?DOLAPIKEY=${DOLAPIKEY}&sqlfilters=(t.ref:like:'REP%') AND (t.tosell:=:1)`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Aucun produit repas trouvé dans l\'API');
        }
        return data.map(product => product.id);
    } catch (error) {
        console.error('Erreur lors du chargement des produits repas:', error);
        throw error;
    }
}

// Charger les données de repas pour une période donnée
export async function getRestaurantData(startDate, endDate, mealProductIds, signal) {
    // Construire le filtre SQL - trouver les inscriptions qui chevauchent la plage de dates
    const productIdsStr = mealProductIds.join(',');
    const sqlFilter = `llx_commandedet.fk_product in (${productIdsStr}) and (lin_datedebut is not null) and (lin_datedebut <= '${endDate}' and lin_datefin >= '${startDate}')`;
    const apiUrl = `${wsUrlformel}dklaccueil?DOLAPIKEY=${DOLAPIKEY}&sortfield=rowid&sortorder=ASC&sqlfilters=${encodeURIComponent(sqlFilter)}`;

    const response = await fetch(apiUrl, { signal });
    if (!response.ok) throw new Error('Erreur API');
    return await response.json();
}
