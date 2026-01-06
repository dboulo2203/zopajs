/**
 * Display the footer part of the application
 * @param {*} htlmPartId 
 */
export function footerViewDisplay(htlmPartId) {

    let footerString = `
    <div id="footerPart" style="margin-top:40px">
        <hr style="color:grey"></hr>
        <div class="d-flex justify-content-center" style="">
            <small>Powered by Dhagpo Kagyu  - ZopaJS App - v 3.0.1 - 04/01/2026</small>
        </div>
        <hr style="color:grey"></hr>
    </div>
 `;

    // *** Display the navbar
    document.querySelector(htlmPartId).innerHTML = footerString;



}
