import { getConfigurationValue } from '../../shared/services/configurationService.js';
import { getUSerToken } from '../../shared/zopaServices/zopaLoginServices.js';

// Récupérer la liste des utilisateurs actifs
export async function fetchUsers() {
    try {
        const wsUrlformel = getConfigurationValue("wsUrlformel");
        const apiUrl = `${wsUrlformel}users/?DOLAPIKEY=${getUSerToken()}&sortorder=ASC&limit=100&active=1`;
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

// Récupérer les paiements par mode de paiement
export async function getPaymentsByMode(startDate, endDate, userId, signal) {
    const wsUrlformel = getConfigurationValue("wsUrlformel");
    const apiUrl = `${wsUrlformel}dklaccueil/getPaymentsByMode?startDate=${startDate} 00:00&endDate=${endDate} 23:59&userId=${userId}&DOLAPIKEY=${getUSerToken()}`;

    const response = await fetch(apiUrl, { signal });
    if (!response.ok) {
        if (response.status === 404) {
            return []; // Pas de données pour cette période
        }
        throw new Error('Erreur API getPaymentsByMode');
    }
    return await response.json();
}

// Récupérer les paiements par code comptable
export async function getPaymentsByAccountCode(startDate, endDate, userId, signal) {
    const wsUrlformel = getConfigurationValue("wsUrlformel");
    const apiUrl = `${wsUrlformel}dklaccueil/getPaymentsByAccountCode?startDate=${startDate} 00:00&endDate=${endDate} 23:59&userId=${userId}&DOLAPIKEY=${getUSerToken()}`;

    const response = await fetch(apiUrl, { signal });
    if (!response.ok) {
        if (response.status === 404) {
            return []; // Pas de données pour cette période
        }
        throw new Error('Erreur API getPaymentsByAccountCode');
    }
    return await response.json();
}

// Récupérer les factures avec paiements
export async function getInvoicesWithPayments(startDate, endDate, userId, signal) {
    const wsUrlformel = getConfigurationValue("wsUrlformel");

    // Construire le filtre SQL selon l'utilisateur sélectionné
    let sqlfilters;
    if (userId > 0) {
        sqlfilters = `(t.paye=1) and (t.date_closing>='${startDate} 00:00') and (t.date_closing<='${endDate} 23:59') and t.fk_user_closing=${userId}`;
    } else {
        sqlfilters = `(t.paye=1) and (t.date_closing>='${startDate} 00:00') and (t.date_closing<='${endDate} 23:59')`;
    }

    const apiUrl = `${wsUrlformel}dklaccueil/invoiceswithpayments?DOLAPIKEY=${getUSerToken()}&sqlfilters=${encodeURIComponent(sqlfilters)}&sortfield=datec&sortorder=DESC&limit=400`;

    const response = await fetch(apiUrl, { signal });
    if (!response.ok) {
        if (response.status === 404) {
            return []; // Pas de données pour cette période
        }
        throw new Error('Erreur API invoiceswithpayments');
    }
    return await response.json();
}
