const htmlContent = `
<div class="container">
    
    <div class="modal fade" id="thisModal" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" id="thismodalCancel">&times;</button>
                    <h4 class="modal-title" style="color:#8B2331"></h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="row modal-body" id="modalbodyLOgin">
                    <div id="modalmessage"></div>
                 
                    <div class="row">

                     </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>
                 </div>
            </div>
        </div>
    </div>
</div>`;

// TODO : Manage callback
export function modalFunctionViewDisplay(htlmPlaceid, params) {

    try {
        // *** Variable that keeps the modal object
        let editModal = null;

        // *** display the mmodal content
        document.querySelector("#" + htlmPlaceid).appendChild(htmlContent);


        // *** Display the content of the modal
        displayModalContent("modalbodyLOgin");

        // *** Actions, Close modal
        document.querySelector("#thismodalCancel").onclick = function () {
            editModal.hide();
        };

        // *** Display modal
        editModal = new bootstrap.Modal(document.querySelector("#thisModal"))
        editModal.show({ backdrop: 'static', keyboard: false });

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}</div > `;
    }
}

/**
 * Display main modal content
 * @param {*} htmlPlaceid 
 */
function displayModalContent(htmlPlaceid) {

    let htmlCOntent = `<div> Modale body example</div>`;

    document.querySelector("#" + htmlPlaceid).innerHTML = htmlCOntent;

}