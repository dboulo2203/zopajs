import { getAppPath } from '../services/commonFunctions.js'
import { bedIcon, personIcon, loginIcon, logoutIcon } from '../../shared/assets/constants.js'
import { isCurrentUSerLogged } from '../../shared/zopaServices/zopaLoginServices.js'
import { logout } from '../../shared/zopaServices/zopaLoginServices.js'
import { toogleTheme } from '../../shared/bootstrapServices/bootstrapTheme.js'
import { loginViewDisplay } from './loginViewCont.js'
//***
// catalog
//  -> categories
//  -> categoriyContent
// 
// basket
// 
//  */
// *** Menu string
const leftmenuString = ` 
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
       <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel" style="color:#8B2331">Zopa V3 JS</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div> 
        <div class="offcanvas-body">
            <!--     <div>
                    Présentation du menu principal de l'application        
                </div>-->
            <hr/>
            ${!isCurrentUSerLogged() ? `<div  style="margin-bottom:10px;cursor:pointer"  ><span class="fs-6" id="myBtnLogin" >${loginIcon} Login</span></div>` : ``}
             ${isCurrentUSerLogged() ? `<div  style="margin-bottom:10px;cursor:pointer"  ><span class="fs-6" id="myBtnLogout">${logoutIcon} Logout</span ></div > ` : ``}
            ${isCurrentUSerLogged() ? `<div  style="margin-bottom:10px;cursor:pointer"  ><span class="fs-6" id="btnSwitchTheme" >${loginIcon} Theme</span></div>` : ``}
 
             
             <hr/>       
             ${isCurrentUSerLogged() ? `<div id="searchCustomer" style="margin-bottom:10px;cursor:pointer" ><span class="fs-6">${personIcon} Adhérents</span></div>` : ``}
             ${isCurrentUSerLogged() ? `<div id="Hosting" style="margin-bottom:10px;cursor:pointer" ><span class="fs-6">${bedIcon} Hôtellerie</span></div>` : ``}
             ${isCurrentUSerLogged() ? `<div id="Restaurant" style="margin-bottom:10px;cursor:pointer" ><span class="fs-6">${bedIcon} Restaurant</span></div>` : ``}
          
           </div>
    </div>
 `;

// $(function () {
// TODO : Manage callback
export function leftMenuViewDisplay(htlmPartId) {


    // *** Display left menu
    document.querySelector("#" + htlmPartId).innerHTML = leftmenuString;

    if (!isCurrentUSerLogged())
        document.querySelector("#myBtnLogin").onclick = async function () {
            await loginViewDisplay("mainActiveSection")
        };

    // // *** Actions
    if (isCurrentUSerLogged())
        document.querySelector("#myBtnLogout").onclick = function () {
            //  console.log("annule clicked");
            //  editModal.hide();
            logout()
            window.location.href = `${getAppPath()}/views/mainpage/mainpage.html`
        };


    if (isCurrentUSerLogged())
        document.querySelector("#Hosting").onclick = function () {
            window.location.href = `${getAppPath()}/views/booking/booking.html`;
        };
    if (isCurrentUSerLogged())
        document.querySelector("#Restaurant").onclick = function () {
            window.location.href = `${getAppPath()}/views/restaurant/index.html`;
        };

    if (isCurrentUSerLogged())
        document.querySelector("#searchCustomer").onclick = function () {
            window.location.href = `${getAppPath()}/views/manageCustomer/searchCustomer/searchCustomer.html`;
        };


    if (isCurrentUSerLogged())
        document.querySelector("#btnSwitchTheme").onclick = function () {
            // document.getElementById('#btnSwitch').addEventListener('click', () => {
            // if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
            //     document.documentElement.setAttribute('data-bs-theme', 'light')
            // }
            // else {
            //     document.documentElement.setAttribute('data-bs-theme', 'dark')
            // }
            toogleTheme();
        }
}
