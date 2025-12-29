/**
 * Display the footer part of the application
 * @param {*} htlmPartId 
 */
export function footerViewDisplay(htlmPartId) {

    let footerString = `
    <div id="footerPart" style="margin-top:40px">
        <hr style="color:grey"></hr>
        <div class="d-flex justify-content-center" style="">
            <small>Powered by Dhagpo Kagyu  - ZopaJS App - v 0.0.1 - 29/12/2025</small>
        </div>
        <hr style="color:grey"></hr>
    </div>
 `;

    // *** Display the navbar
    document.querySelector(htlmPartId).innerHTML = footerString;



}
