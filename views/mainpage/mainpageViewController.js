// *** shared services
import { currentApplicationPath } from '../../shared/assets/constants.js'
import { launchInitialisation } from '../../shared/services/initialisationService.js'
import { headerViewDisplay } from '../../shared/components/global/headerViewCont.js'

// *** Menu string
const mainStringPage = ` 
            <div class="container-fluid"> 
            <img src="${currentApplicationPath}/shared/assets/main_picture.jpg" width="100%">
    </div>
`;

export async function startMainPageController() {

    try {
        // *** Init app
        await launchInitialisation();

        // *** Display menu
        headerViewDisplay("#menuSection", null);


    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}</div > `;
    }
}
