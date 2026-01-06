

import { wsUrlformel } from '../assets/constants.js';

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

    var wsUrl = wsUrlformel + `login`;

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
        console.log(`getLogin Error : ${JSON.stringify(responsefr)}`);
        sessionStorage.setItem("loggedUSer", "");
        return (false);
        // throw new Error("getLogin Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}


/**
 * returns if the user is allowed for the required level 
 * @param {*} requiredLevel 
 * @returns 
 */
export function isCurrentUSerLogged() {

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

export function logout() {

    sessionStorage.removeItem("loggedUSer", "");

}

/**
 * 
 * @returns 
 */
export function getLoggedUserPseudo() {

    let loggedUser = sessionStorage.getItem("loggedUSer");

    if (loggedUser)
        return loggedUser.user_pseudo
    else
        return "";
}


/**
 * returns if the user is allowed for the required level 
 * @param {*} requiredLevel 
 * @returns 
 */
export function getCurrentUSerRightLevel(requiredLevel) {

    let loggedUser = sessionStorage.getItem("loggedUSer");

    if (loggedUser)
        if (loggedUser.urlt_level > requiredLevel)
            return "hidden";
        else
            return "";
    else
        return "hidden";

}

// https://catalogue.bibliotheque-dhagpo-kagyu.org/yeshe/api/user/d.boulore@vipassana.fr?logUser=user_email&password=thomas4
