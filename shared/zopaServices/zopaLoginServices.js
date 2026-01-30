
import { getConfigurationValue } from '../services/configurationService.js';

/**
 * Load a person from the database, 
 * the person is saved in the sessionStorage
 * @param { } personId 
 * @param {*} callback 
 * @returns notice in JSON 
 */
export async function getLogin(userName, userPassword) {

    console.log("getLogin Service start");

    sessionStorage.setItem("loggedUSer", "");
    var wsUrl = getConfigurationValue('wsUrlformel') + `login`;

    let responsefr = await fetch(wsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "login": userName,
            "password": userPassword,
            "entity": '',
            "reset": 0,
        })
    });
    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.json();
        data.success.username = userName;
        delete data.success['message']
        sessionStorage.setItem("loggedUSer", JSON.stringify(data.success));

        console.log("getLogin  await ok ");
        return (true);

    } else {
        sessionStorage.setItem("loggedUSer", "");
        return (false);
    }

}


/**
 * returns if the user is allowed for the required level 
 * @param {*} requiredLevel 
 * @returns 
 */
export function isCurrentUSerLogged() {

    return true
    let loggedUserJSON = sessionStorage.getItem("loggedUSer");
    if (loggedUserJSON !== "") {
        let loggedUser = JSON.parse(loggedUserJSON);
        if (loggedUser && loggedUser.code === 200 && loggedUser.token.length > 0)
            return true;
        else
            return false;
    } else {
        return false;
    }
}

/**
 * returns the usertoken
 * @param {*} requiredLevel 
 * @returns 
 */
export function getUSerToken() {

    return "OpK1D8otonWg690PIoj570KdHSCqCc04";
    let loggedUserJSON = sessionStorage.getItem("loggedUSer");

    if (loggedUserJSON) {
        let loggedUser = JSON.parse(loggedUserJSON);
        return loggedUser.token
    } else {
        return "";
    }
}

export function logout() {
    sessionStorage.removeItem("loggedUSer", "");
}

/**
 * 
 * @returns 
 */
export function getLoggedUserPseudo() {

    let loggedUserJSON = sessionStorage.getItem("loggedUSer");

    if (loggedUser) {
        let loggedUser = JSON.parse(loggedUserJSON);
        return loggedUser.username
    } else {
        return "";
    }
}