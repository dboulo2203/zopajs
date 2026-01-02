import { wsUrlformel, DOLAPIKEY } from '../../shared/assets/constants.js';

/**
 * Load the language list from the database
 * the languages list is saved in the sessionStorage 
 */
export async function getcustomerSearch(searchString, searchType) {

    console.log("getcustomerSearch Service start");

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

    var wsUrl = wsUrlformel + ``;
    let params = `thirdparties?sqlfilters=${searchStringBuild}&DOLAPIKEY=${DOLAPIKEY}`;

    let responseWS = await fetch(wsUrl + params);

    if (responseWS.ok) {
        // *** Get the data and save in the sessionStorage
        let data = await responseWS.json();

        console.log("getcustomerSearch ok ");
        return (data);

    } else {
        console.log(`getcustomerSearch Error : ${JSON.stringify(responseWS)}`);
        throw new Error("getcustomerSearch Error message : " + responseWS.status + " " + responseWS.statusText);
    }

}
