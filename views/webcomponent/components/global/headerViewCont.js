// *** Shared ressources
import { getTranslation } from '../../../services/translationService.js'
// import { currentApplicationPath } from '../../assets/constants.js'
import { getAppPath } from '../../../functions/commonFunctions.js'
import { loginViewDisplay } from '../../../components/login/loginViewCont.js'

import { leftMenuViewDisplay } from './leftMenuViewCont.js'
// import { getLoggedUserPseudo, logout } from '../../components/login/zopaLoginServices.js'

// TODO : Manage callback
export function headerViewDisplay(htlmPartId) {

    let menuString = `
    <div id="menuPart">
            <nav class="navbar fixed-top navbar-light " style="background-color:#F7F7F3;border-bottom:solid 0.15rem #C0C0C0; padding:5px">
                <div class="container-fluid">
                    <div class="navbar-brand" style="color:#8B2331" id="mainNav">${getTranslation("brandTitle")}</div>
                    <div class="d-flex">
                   <a class="btn btn-secondary" style="margin-right:3px" id="LoginBtn" href="#" >
                        Login
                    </a>
  
                    <a class="btn btn-secondary" style="margin-right:3px" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                        Menu
                    </a>
                        <input class="text" type="search" style="margin-right:2px" placeholder="" id="searchInputString" aria-label="Search">
                            <button class="btn btn-secondary" id="searchBtn" >${getTranslation("search")}</button>
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

    document.querySelector("#searchInputString").addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            window.location.href = `${getAppPath()}/views/search/search.html?searchStr=` + $("#searchInputString").val();
        }
    });

    // *** Actions
    document.querySelector("#searchBtn").onclick = function () {
        window.location.href = `${getAppPath()}/views/search/search.html?searchStr=` + $("#searchInputString").val();
    };

    document.querySelector("#mainNav").onclick = function () {
        window.location.href = `${getAppPath()}/index.html`;
    };

    document.querySelector("#LoginBtn").onclick = function () {
        loginViewDisplay("mainActiveSection")
    };
    document.querySelector("#LoginBtn").onclick = function () {
        loginViewDisplay("mainActiveSection")
    };

}
