

import { wsUrlformel } from '../../assets/constants.js';

/**
 * Load a person from the database, 
 * the person is saved in the localStorage
 * @param { } personId 
 * @param {*} callback 
 * @returns notice in JSON 
 */
export async function getLogin(userEmail, userPassword) {

    console.log("getLogin Service start");

    localStorage.setItem("loggedUSer", "");

    var wsUrl = wsUrlformel + `user/${userEmail}?logUser=user_email&password=${userPassword}`;

    let responsefr = await fetch(wsUrl);

    if (responsefr.ok) {
        // *** Get the data and save in the localstorage
        const data = await responsefr.json();
        localStorage.setItem("loggedUSer", JSON.stringify(data.content));

        console.log("getLogin  await ok ");
        return (data.content);

    } else {
        console.log(`getLogin Error : ${JSON.stringify(responsefr)}`);
        localStorage.setItem("loggedUSer", "");
        return (false);
        // throw new Error("getLogin Error message : " + responsefr.status + " " + responsefr.statusText);
    }

}


export function logout() {

    localStorage.setItem("loggedUSer", "");

}

/**
 * 
 * @returns 
 */
export function getLoggedUserPseudo() {

    let loggedUser = localStorage.getItem("loggedUSer");

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

    let loggedUser = localStorage.getItem("loggedUSer");

    if (loggedUser)
        if (loggedUser.urlt_level > requiredLevel)
            return "hidden";
        else
            return "";
    else
        return "hidden";

}

// https://catalogue.bibliotheque-dhagpo-kagyu.org/yeshe/api/user/d.boulore@vipassana.fr?logUser=user_email&password=thomas4
