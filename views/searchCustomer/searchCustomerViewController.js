// *** Component ressources
import { getcustomerSearch } from './searchCustomerService.js'

// *** Shared ressoucres
import { getProducts, getintakeplacesTypesFromAPI, getMealTypesFromAPI } from '../../shared/services/productService.js'
import { headerViewDisplay } from '../../shared/services/headerViewCont.js'//***  shared ressources
import { addMultipleEnventListener, getAppPath } from '../../shared/services/commonFunctions.js'
import { loadTranslations } from '../../shared/services/translationService.js'
import { footerViewDisplay } from '../../shared/services/footerViewCont.js'
/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startSearchCustomerController() {

    try {
        // *** Initialisations
        // await launchInitialisation();
        await loadTranslations();
        await getProducts();
        await getintakeplacesTypesFromAPI();
        await getMealTypesFromAPI();

        headerViewDisplay("#menuSection");

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }

    // const searchParams = new URLSearchParams(window.location.search);
    // console.log(searchParams);

    // if (searchParams.has('searchStr'))
    displaySearchCustomerContent("mainActiveSection")

    footerViewDisplay("#footerDisplay")
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displaySearchCustomerContent(htlmPartId) {

    // *** Build the html string 
    let output = '';

    // *** Display the controller skeleton
    output += `
    <div style="padding-top:10px"><p class="fs-5" style="color:#8B2331">Search customer</p></div><hr/>
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

    <div class="col-md-12 main" style="padding:10px" id="resultDisplay">
    </div >
       <div class="col-md-12 main" style="padding:10px" id="footerDisplay">
    </div >`;

    // *** Display skeleton
    document.querySelector("#" + htlmPartId).innerHTML = output;

    try {

        //***  Actions
        document.querySelector("#searchString").addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                getSearch();
            }
        });

        document.querySelector("#myBtnCompute").onclick = async function () {
            getSearch();
        };

    } catch (except) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br > ${error.stack}  </div > `;
    }
}
/**
 * 
 */
async function getSearch() {

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
                       <div class="col-4"> 
                           ${result.email}
                       </div> 
                       <div class="col-5">   
                           ${result.address}, ${result.zip}, ${result.town}      
                       </div>
                   </div > <hr />`;
    });

    // *** Display the HTML string
    document.querySelector("#resultDisplay").innerHTML = resultDisplay;

    addMultipleEnventListener(".customerLink", function () {
        window.location.href = `${getAppPath()}/views/customer/customer.html?customerID=` + $(this).attr('customerid');
    });

}
