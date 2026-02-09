const htmlContent = `
<div class="container">
    <div class="modal fade" id="thisModal" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title fs-5 text-danger-emphasis" >Modal title</span>
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
        let container = document.createElement('div');
        container.innerHTML = htmlContent;
        let node = container.firstElementChild;
        document.querySelector("#" + htlmPlaceid).appendChild(node);


        // *** Display the content of the modal
        displayModalContent("modalbodyLOgin");

        // *** Actions, Close modal
        // document.querySelector("#thismodalCancel").onclick = function () {
        //     editModal.hide();
        // };

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