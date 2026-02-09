// import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';
import { getConfigurationValue } from '../../../shared/services/configurationService.js';
import { getUSerToken } from '../../../shared/zopaServices/zopaLoginServices.js'
/**
 * Load the language list from the database
 * the languages list is saved in the sessionStorage 
 */
export async function getcustomerSearch(searchString, searchType) {

    searchString = searchString.replace("'", "\\'");
    let searchStringBuild = "";
    switch (searchType) {
        case 'name':
            searchStringBuild = "(t.nom:like:%27%25" + searchString + "%25%27) ";
            break;
        case 'email':
            searchStringBuild = "(t.email:like:%27%25" + searchString + "%25%27)";
            break;
        case 'address':
            searchStringBuild = "(t.town:like:%27%25" +
                searchString +
                "%25%27)" +
                " OR " +
                " (t.address:like:%27%25" +
                searchString +
                "%25%27)" +
                " OR " +
                "(t.zip:like:%27%25" +
                searchString +
                "%25%27)";
            break;
        case 'phone':
            searchStringBuild = "(t.phone:like:%27%25" + searchString + "%25%27) ";
            break;
        default:
            searchStringBuild = "t.nom like%27%25" + searchString + "%25%27 ";
    }

    var wsUrl = getConfigurationValue('wsUrlformel')
    let params = `thirdparties?sqlfilters=${searchStringBuild}&DOLAPIKEY=${getUSerToken()}&sortfield=t.nom&sortorder=ASC`;

    let responseWS = await fetch(wsUrl + params);

    if (responseWS.ok) {
        // *** Get the data and save in the sessionStorage
        let data = responseWS.json();

        // console.log("getcustomerSearch ok ");
        return (data);

    } else {
        console.log(`getcustomerSearch Error : ${JSON.stringify(responseWS)}`);
        throw new Error("getcustomerSearch Error message : " + responseWS.status + " " + responseWS.statusText);
    }

}
