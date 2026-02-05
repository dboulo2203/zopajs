import { getConfigurationValue } from '../../shared/services/configurationService.js';

const DOLAPIKEY = 'OpK1D8otonWg690PIoj570KdHSCqCc04';

// Récupérer les produits stages depuis l'API (ref commence par "STA" et tosell = 1)
// Retourne un objet { ids: [...], products: { id: { id, ref, label, ... }, ... } }
export async function fetchStageProducts() {
    try {
        const wsUrlformel = getConfigurationValue("wsUrlformel");
        const apiUrl = `${wsUrlformel}products?DOLAPIKEY=${DOLAPIKEY}&sqlfilters=(t.ref:like:'STA%') AND (t.tosell:=:1)`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Aucun produit stage trouvé dans l\'API');
        }
        const ids = data.map(product => product.id);
        const products = {};
        data.forEach(product => {
            // Extraire les prix (multiprices contient les différents tarifs)
            const prices = [];
            if (product.multiprices) {
                Object.values(product.multiprices).forEach(p => {
                    const val = parseFloat(p);
                    if (val > 0) prices.push(val.toFixed(2) + ' €');
                });
            }
            products[product.id] = {
                id: product.id,
                ref: product.ref,
                label: product.label || product.ref,
                nbmax: product.array_options?.options_sta_nbmax || null,
                fullattend: product.array_options?.options_sta_fullattend === '1',
                hostingclosed: product.array_options?.options_sta_hostingclosed === '1',
                published: product.array_options?.options_sta_published === '1',
                place: product.array_options?.options_sta_place || null,
                analcompta: product.array_options?.options_analcompta || '',
                prices: prices
            };
        });
        return { ids, products };
    } catch (error) {
        console.error('Erreur lors du chargement des produits stages:', error);
        throw error;
    }
}

// Charger les données de stages pour une période donnée
export async function getStagesData(startDate, endDate, stageProductIds, signal) {
    const wsUrlformel = getConfigurationValue("wsUrlformel");
    // Construire le filtre SQL - trouver les inscriptions qui chevauchent la plage de dates
    const productIdsStr = stageProductIds.join(',');
    const sqlFilter = `llx_commandedet.fk_product in (${productIdsStr}) and (lin_datedebut is not null) and (lin_datedebut <= '${endDate} 23:59:59' and lin_datefin >= '${startDate} 00:00:00')`;
    const apiUrl = `${wsUrlformel}dklaccueil?DOLAPIKEY=${DOLAPIKEY}&sortfield=rowid&sortorder=ASC&sqlfilters=${encodeURIComponent(sqlFilter)}`;

    const response = await fetch(apiUrl, { signal });
    // L'API retourne 404 quand aucun résultat n'est trouvé
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) throw new Error('Erreur API');
    return await response.json();
}
