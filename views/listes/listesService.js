import { getConfigurationValue } from '../../shared/services/configurationService.js';

const DOLAPIKEY = 'OpK1D8otonWg690PIoj570KdHSCqCc04';

// Récupérer la liste des utilisateurs actifs
export async function fetchUsers() {
    try {
        const wsUrlformel = getConfigurationValue("wsUrlformel");
        const apiUrl = `${wsUrlformel}users/?DOLAPIKEY=${DOLAPIKEY}&sortorder=ASC&limit=100&active=1`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const users = {};
        data.forEach(item => {
            const firstname = (item.firstname && item.firstname !== 'null') ? item.firstname : '';
            const lastname = (item.lastname && item.lastname !== 'null') ? item.lastname : '';
            const fullName = `${firstname} ${lastname}`.trim();
            users[item.id] = fullName;
        });
        return users;
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return {};
    }
}

// Récupérer les commandes via le endpoint custom dklaccueil/fullorders
export async function fetchOrders(searchOption, userId, signal) {
    const wsUrlformel = getConfigurationValue("wsUrlformel");

    // Construire le filtre SQL (format SQL brut pour endpoint custom)
    let sqlfilters = '';
    switch (searchOption) {
        case 'orders_draft':
            sqlfilters = '(t.fk_statut=0)';
            break;
        case 'orders_inprogress':
            sqlfilters = '(t.fk_statut=1)';
            break;
        case 'orders_closed':
            sqlfilters = '(t.fk_statut=3)';
            break;
        case 'orders_cancelled':
            sqlfilters = '(t.fk_statut=-1)';
            break;
        default:
            sqlfilters = '(t.fk_statut=0)';
    }

    // Ajouter le filtre utilisateur si un utilisateur spécifique est sélectionné
    if (userId && userId !== '0') {
        sqlfilters += ` and (t.fk_user_author=${userId})`;
    }

    const apiUrl = `${wsUrlformel}dklaccueil/fullorders?DOLAPIKEY=${DOLAPIKEY}&sqlfilters=${encodeURIComponent(sqlfilters)}&sortfield=t.rowid&sortorder=ASC&limit=100`;

    const response = await fetch(apiUrl, { signal });
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error('Erreur API fullorders');
    }
    return await response.json();
}

// Récupérer les factures via le endpoint standard invoices
export async function fetchInvoices(searchOption, userId, signal) {
    const wsUrlformel = getConfigurationValue("wsUrlformel");

    // Construire le filtre SQL (format colon pour endpoint standard Dolibarr)
    let sqlfilters = '';
    switch (searchOption) {
        case 'invoices_pending':
            sqlfilters = '(t.fk_statut:=:1) and (t.paye:=:0)';
            break;
        case 'invoices_draft':
            sqlfilters = '(t.fk_statut:=:0)';
            break;
        case 'invoices_avoir':
            sqlfilters = '(t.type:=:2)';
            break;
        default:
            sqlfilters = '(t.fk_statut:=:0)';
    }

    // Ajouter le filtre utilisateur si un utilisateur spécifique est sélectionné
    if (userId && userId !== '0') {
        sqlfilters += ` and (t.fk_user_author:=:${userId})`;
    }

    const apiUrl = `${wsUrlformel}invoices?DOLAPIKEY=${DOLAPIKEY}&sqlfilters=${encodeURIComponent(sqlfilters)}&sortfield=t.ref&sortorder=ASC&limit=100`;

    const response = await fetch(apiUrl, { signal });
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error('Erreur API invoices');
    }
    return await response.json();
}
