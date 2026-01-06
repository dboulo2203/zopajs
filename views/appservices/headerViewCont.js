// *** Shared ressources
import { getTranslation } from '../../shared/services/translationService.js'
import { threedotsvertical } from '../../shared/assets/constants.js'
// import { loginViewDisplay } from './login/loginViewCont.js'
// import { logout, isCurrentUSerLogged } from '../../shared/services/loginService.js'
// import { getAppPath } from '../../shared/services/commonFunctions.js'

import { leftMenuViewDisplay } from './leftMenuViewCont.js'

// TODO : Manage callback
export function headerViewDisplay(htlmPartId, callbackFunction) {

    let menuString = `
    <div id="menuPart">
        <nav class="navbar fixed-top navbar-light " style="background-color:#F7F7F3;border-bottom:solid 0.15rem #C0C0C0; padding:5px">
            <div class="container-fluid">
                <div class="navbar-brand" style="color:#8B2331" id="mainNav">${getTranslation("brandTitle")}</div>
                <div class="d-flex">

                <a class="btn btn-light" style="margin-left:3px;cursor:pointer"  data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">${threedotsvertical}</a >

                </div>
            </div>
        </nav>
      </div>
    <div id="leftMenu">
    </div>`;

    // *** Display the navbar
    document.querySelector(htlmPartId).innerHTML = menuString;

    // *** Add the off canvas menu
    leftMenuViewDisplay("leftMenu");



}
