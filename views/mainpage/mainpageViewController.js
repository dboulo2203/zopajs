// *** shared services
import { launchInitialisation } from '../appservices/initialisationService.js'
import { headerViewDisplay } from '../appservices/headerViewCont.js'
import { getAppPath } from '../../shared/services/commonFunctions.js';
import { isCurrentUSerLogged } from '../../shared/services/zopaLoginServices.js'
import { footerViewDisplay } from '../appservices/footerViewCont.js'
// *** Menu string
const mainStringPage = ` 
            <div class="container-fluid"> 
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
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}</div > `;
    }

}
