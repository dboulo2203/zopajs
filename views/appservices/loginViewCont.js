
// import { getLogin } from '../../shared/services/loginService.js'
import { getLogin, logout } from '../../shared/services/loginService.js'
import { getAppPath } from '../../shared/services/commonFunctions.js'

const editModaleString = `
<div class="container">
    <div class="modal fade" id="myModalLogin" role="dialog" data-bs-backdrop="static"
            data-bs-keyboard="false" >
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> -->
                    <h5 class="modal-title" style="color:#8B2331">Login</h5>
                           <button type="button" id="myBtnCancel" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                </div>
                <div class="row modal-body" id="modalbodyLOgin">
                    <p>Some text in the modal.</p>

                </div>
                <div class="modal-footer">
                    <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal" >Cancel</button> -->
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id="btnLogin">Login</button>
                </div>
            </div>

        </div>
    </div>
</div>`;

// TODO : Manage callback
export async function loginViewDisplay(htlmPartId) {

    // *** Variable that keeps the modal object
    let editModal = null;

    try {
        // *** Display main part of the page
        // document.getElementById(htlmPartId).innerHTML = ;
        jQuery("#" + htlmPartId).append(editModaleString);


        let outpuStr = '';
        outpuStr = `
        <div id="modalmessage"></div>
        <div class="row">
            <label for="userEmailInput" class="form-label col-2">Nom </label>
            <div class="col" style="margin:2px">
                <input type="text" class="form-control  col-sm-10 " name="userEmailInput" id="userEmailInput" placeholder=""
                    value=""/> 
            </div>
        </div>
        <div class="row">
            <label for="userPasswordInput" class="form-label col-2">Password </label>
            <div class="col" style="margin:2px">
                <input type="password" class="form-control  col-sm-10 " name="userPasswordInput" id="userPasswordInput" placeholder=""
                    value=""/>
            </div>
        </div>
            `;
        // *** Display string
        document.querySelector("#modalbodyLOgin").innerHTML = outpuStr;



        // *** Actions
        document.querySelector("#myBtnCancel").onclick = function () {
            //  console.log("annule clicked");
            //  editModal.hide();
            window.location.href = `${getAppPath()}/views/mainpage/mainpage.html`
        };



        // TODO : put the 2 functions in one process
        $('#modalbodyLOgin').on('keydown', async function (event) {
            if (event.keyCode === 13) {
                console.log("Save clicked");
                let userEmail = document.querySelector("#userEmailInput").value;
                let userPassword = document.querySelector("#userPasswordInput").value;

                // try {
                let retour = await getLogin(userEmail, userPassword)

                if (!retour)
                    document.querySelector("#modalmessage").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" >Nom, password invalides</div> `;
                else
                    document.querySelector("#modalmessage").innerHTML = `<div class="alert alert-success" style = "margin-top:30px" role = "alert" >Bienvenue ${retour.user_pseudo}</div> `;
            }
        });

        document.querySelector("#btnLogin").onclick = async function (event) {
            console.log("Save clicked");
            let userEmail = document.querySelector("#userEmailInput").value;
            let userPassword = document.querySelector("#userPasswordInput").value;

            // try {
            let retour = await getLogin(userEmail, userPassword)

            if (!retour)
                document.querySelector("#modalmessage").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" >Nom, password invalides</div> `;
            else
                window.location.href = `${getAppPath()}/views/mainpage/mainpage.html`
        };

        // *** Initialisation
        $(document).ready(function () {
            editModal = new bootstrap.Modal(document.querySelector("#myModalLogin"))
            editModal.show({ backdrop: 'static', keyboard: false });
        });


    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}</div > `;
    }


}
