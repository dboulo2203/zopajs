
import { currentApplicationPath } from '../assets/constants.js'
import { bedIcon, personIcon } from '../assets/constants.js'
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
            <div id="searchCustomer" style="margin-bottom:10px;cursor:pointer" ><span class="fs-6">${personIcon} Adhérents</span></div>
            <div id="Hosting" style="margin-bottom:10px;cursor:pointer" ><span class="fs-6">${bedIcon} Hôtellerie</span></div>
           </div>
    </div>
 `;
// 
// 

// $(function () {
// TODO : Manage callback
export function leftMenuViewDisplay(htlmPartId) {


    // *** Display left menu
    document.querySelector("#" + htlmPartId).innerHTML = leftmenuString;


    document.querySelector("#Hosting").onclick = function () {
        window.location.href = `${currentApplicationPath}/views/booking/booking.html`;
    };

    document.querySelector("#searchCustomer").onclick = function () {
        window.location.href = `${currentApplicationPath}/views/searchCustomer/searchCustomer.html`;
    };
}
