// *** Component ressources
import { getcustomerSearch } from './searchCustomerService.js'

// *** Shared ressoucres

import { headerViewDisplay } from '../../../shared/zopaAppservices/headerViewCont.js'
import { addMultipleEnventListener, getAppPath } from '../../../shared/services/commonFunctions.js'
import { footerViewDisplay } from '../../../shared/zopaAppservices/footerViewCont.js'
import { launchInitialisation } from '../../../shared/zopaAppservices/initialisationService.js'
import { searchIcon } from '../../../shared/assets/constants.js'
import { isCurrentUSerLogged } from '../../../shared/zopaServices/zopaLoginServices.js'
import { getPageTitleDisplay } from '../../../shared/bootstrapServices/components/components.js'


/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startSearchCustomerController() {

    try {
        // *** Initialisations
        await launchInitialisation();
        headerViewDisplay("#menuSection");

        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");

        await displaySearchCustomerContent("mainActiveSection")

        footerViewDisplay("#footerDisplay")


    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:60px" role = "alert" > ${error} </div > `;
    }

}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displaySearchCustomerContent(htlmPartId) {


    try {
        // *** Build the html string 
        let output = '';

        // *** Display the controller skeleton
        output += `
        <div style="margin-top:60px">
  
            ${getPageTitleDisplay("Search customer", "bi-person")}
             <div id='componentMessage'></div>
            <div class="col-6">
                <div class="row">  
                    <div class="col-8" style="margin:2px">
                        <input type="text" class="form-control " name="searchString" id="searchString" placeholder="" value=""/>
                    </div>
                    <div class="col-2" style="margin:2px">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="myBtnCompute">Chercher</button>
                    </div>
                </div>
            </div>

        </div> 
   
        <div class="col-md-12 main" style="padding:10px" id="resultDisplay">
        </div >
        <div class="col-md-12 main" style="padding:10px" id="footerDisplay">
        </div >`;

        // *** Display skeleton
        document.querySelector("#" + htlmPartId).innerHTML = output;

        // try {

        //***  Actions
        document.querySelector("#searchString").addEventListener("keypress", async function (event) {
            try {
                if (event.keyCode === 13) {
                    await getSearch();
                }
            } catch (error) {
                document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:60px" role = "alert" > ${error} </div > `;
            }

        });

        document.querySelector("#myBtnCompute").onclick = async function () {
            try {
                await getSearch();
            } catch (error) {
                document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:60px" role = "alert" > ${error} </div > `;
            }

        };

    } catch (except) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }
}
/**
 * 
 */
async function getSearch() {

    // try {
    // *** Search customers
    let searchString = document.querySelector("#searchString").value;
    let searchResults = await getcustomerSearch(searchString, 'name');

    // *** Display customers list
    let resultDisplay = '';
    searchResults.map((result, index) => {
        resultDisplay += `
        <div class="row" >
            <div class="col-3" > 
                <span class="customerLink" customerid="${result.id}" style="cursor: pointer">${result.name}</span>
            </div> 
            <div class="col-3  "> 
                ${result.email}
            </div> 
            <div class="col-6 ">   
                ${result.address}, ${result.zip}, ${result.town}      
            </div>
        </div >
         <hr />`;
    });

    // *** Display the HTML string
    document.querySelector("#resultDisplay").innerHTML = resultDisplay;

    addMultipleEnventListener(".customerLink", function (event) {
        window.location.href = `${getAppPath()}/views/manageCustomer/customer/customer.html?customerID=` + event.currentTarget.getAttribute('customerid');
    });
    // } catch (except) {
    //     document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    // }

}
