import { getOrder, getevaluateSession, getevaluateOrderGlobalStatus } from '../../../shared/services/zopaOrderServices.js'
import { getAppPath } from '../../../shared/services/commonFunctions.js'

const editModaleString = `
    <div class="container">
        <div class="modal fade" id="myModalLogin" role="dialog" data-bs-backdrop="static"
                data-bs-keyboard="false" >
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <!-- <button type="button" class="close" data-dismiss="modal">&times;</button> 
                        <h4 class="modal-title">Résumé de la commande</h4> -->
                        <span class="fs-5" style="color:#8B2331">Résumé de la commande</span>
                    </div>
                    <div class="row modal-body" id="modalbodyLOgin">
                        <p>Some text in the modal.</p>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="myBtnCancel">Cancel</button>
                    <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal" id="myBtnLogin">Login</button>
                        -->
                    </div>
                </div>

            </div>
        </div>
    </div>`;

// TODO : Manage callback
export async function orderExtractViewDisplay(htlmPartId, orderId) {

    // *** Variable that keeps the modal object
    let editModal = null;

    try {
        // *** Display main part of the page
        // document.getElementById(htlmPartId).innerHTML = ;
        jQuery("#" + htlmPartId).append(editModaleString);

        let order = await getOrder(orderId);
        let orderExtract = getevaluateSession(order, true);

        let outpuStr = '';
        outpuStr = `
        <div id="modalmessage"></div>
        <div >
            <span class="fw-light" style ="color:grey"> Adhérent :</span> ${order.customer.name}<br/>
            <span class="fw-light" style ="color:grey"> </span> ${orderExtract} <br/>
            <span class="fw-light " style ="color:grey">Commande : </span><span class="orderLink" style ="cursor:pointer;color:#8B2331">  ${order.ref}</span><br/>
            <span class="fw-light" style ="color:grey">Statut commande:</span> ${getevaluateOrderGlobalStatus(order)}</br>
         </div>
            `;
        // *** Display string
        document.querySelector("#modalbodyLOgin").innerHTML = outpuStr;


        // *** Actions
        document.querySelector("#myBtnCancel").onclick = function () {
            console.log("annule clicked");
            editModal.hide();
        };

        // TODO : put the 2 functions in one process
        // *** Initialisation
        $(document).ready(function () {
            editModal = new bootstrap.Modal(document.querySelector("#myModalLogin"))
            editModal.show({ backdrop: 'static', keyboard: false });
        });

        document.querySelector(".orderLink").onclick = function (event) {
            // getLinkWithctrl(`${getAppPath()}/views/simpleEntity/simpleEntity.html?simpleEntityID=${notice.matt_id}&simpleEntitytype=36`, event.ctrlKey);;
            window.location.href = `${getAppPath()}/views/order/order.html?orderID=` + orderId + `&indep=false`;

        };



    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}</div > `;
    }


}
