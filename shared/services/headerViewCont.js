// *** Shared ressources
import { getTranslation } from './translationService.js'
import { loginViewDisplay } from './login/loginViewCont.js'
import { logout } from './login/loginService.js'
import { getAppPath } from './commonFunctions.js'

import { leftMenuViewDisplay } from './leftMenuViewCont.js'
import { isCurrentUSerLogged } from './login/loginService.js'

// TODO : Manage callback
export function headerViewDisplay(htlmPartId, callbackFunction) {

    let menuString = `
    <div id="menuPart">
        <nav class="navbar fixed-top navbar-light " style="background-color:#F7F7F3;border-bottom:solid 0.15rem #C0C0C0; padding:5px">
            <div class="container-fluid">
                <div class="navbar-brand" style="color:#8B2331" id="mainNav">${getTranslation("brandTitle")}</div>
                <div class="d-flex">
                <a class="btn btn-secondary ${!isCurrentUSerLogged() ? 'visible' : 'invisible'}  style="cursor:pointer" id="LoginBtn" href="#" >Login </a>
                <a class="btn btn-secondary ${isCurrentUSerLogged() ? 'visible' : 'invisible'}  style="cursor:pointer" id="myBtnLogout" href="#" >Logout </a>
                ${isCurrentUSerLogged() ? '<a class="btn btn-secondary" style="margin-left:3px;cursor:pointer"  data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">Menu</a >' : ''}

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

    document.querySelector("#LoginBtn").onclick = async function () {
        await loginViewDisplay("mainActiveSection")

    };

    // *** Actions
    document.querySelector("#myBtnLogout").onclick = function () {
        //  console.log("annule clicked");
        //  editModal.hide();
        logout()
        window.location.href = `${getAppPath()}/views/mainpage/mainpage.html`
    };


}
