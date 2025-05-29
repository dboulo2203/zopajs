
import { currentApplicationPath } from '../../constants.js'

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
            <h5 class="offcanvas-title" id="offcanvasExampleLabel" style="color:#8B2331">Yeshe 5</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <hr/>
        <div class="offcanvas-body">
                <div>
                    Présentation du menu principal de l'application        
                </div>
            <hr/>
            <div id="newNoticeButton">New Notice</div>
            <div id="newPersonButton">New Person</div>            
            <div id="newKeywordButton">New Keyword</div>
            <div id="newPublisherButton">New Publisher</div>
            <div id="newPrinterButton">New Printer</div>
            <hr/>
            <div id="newPrinterButton">Utilisateurs</div>
            <div id="newPrinterButton">Prêts</div>
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


    document.querySelector("#newPersonButton").onclick = function () {
        window.location.href = `${currentApplicationPath}/views/person/person.html`;
    };
}
