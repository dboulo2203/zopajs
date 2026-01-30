// *** shared services
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js'
import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js'
import { getAppPath } from '../../shared/services/commonFunctions.js';
import { isCurrentUSerLogged } from '../../shared/zopaServices/zopaLoginServices.js'
import { footerViewDisplay } from '../../shared/zopaAppservices/footerViewCont.js'
// *** Menu string
const mainStringPage = ` 
            <div class="container-fluid" style="margin-top:60px"> 
            <img src="${getAppPath()}/shared/assets/main_picture.jpg" width="100%">
    </div>
`;

export async function startMainPageController() {

    try {
        // *** Init app
        await launchInitialisation();

        // *** Display menu
        headerViewDisplay("#menuSection", null);

        document.querySelector("#mainActiveSection").innerHTML = mainStringPage;
        footerViewDisplay("#footerSection");
        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");


    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:60px" role = "alert" > ${error}</div > `;
    }

}
