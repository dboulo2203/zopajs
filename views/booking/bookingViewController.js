// *** Component ressources
import { getHostingBooking, copyToClipboard } from './bookingService.js';
// *** Shared ressoucres
import { getResourceProducts, getHostingProducts } from '../../shared/services/zopaProductServices.js'
import { getintakeplacesTypes } from '../../shared/services/zopaListsServices.js'
import { headerViewDisplay } from '../appservices/headerViewCont.js'//***  shared ressources
import { launchInitialisation } from '../appservices/initialisationService.js'
import { bedIcon, copyIcon } from '../../shared/assets/constants.js'
import { addMultipleEnventListener, displayToast } from '../../shared/services/commonFunctions.js'
import { isCurrentUSerLogged } from '../../shared/services/loginService.js'

import { orderExtractViewDisplay } from './orderExtract/orderExtractViewCont.js'
/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startBookingController() {

    try {
        // *** Initialisations
        await launchInitialisation();
        headerViewDisplay("#menuSection");

        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");

        // if (searchParams.has('searchStr'))
        displayBookingContent("mainActiveSection");

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayBookingContent(htlmPartId) {

    try {

        // *** Display the initial screen
        // let =Date();
        let tabFullResult = null;
        let bookinglines = null;

        let startDateInput = new Date();
        let endDateinput = new Date();
        endDateinput.setDate(endDateinput.getDate() + 20);

        let output = '';
        output += `
            <div class="d-flex  justify-content-between" style="padding-top:45px"   >
                <span class="fs-5" style="color:#8B2331">${bedIcon} Display hosting booking</span>
                <span id="extractButton" style="cursor: pointer">   ${copyIcon}</span>
            </div>
            <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem"  / >
            <div id='componentMessage'></div>
            <div class="col-6">
                <div class="row">    
                    <label for="startDate" class="form-label ">Start date </label>
                    <div class="col" >
                        <input type="date" class="form-control" name="startDate" id="startDate" placeholder="" value="${startDateInput.toISOString().split('T')[0]}"/>
                    </div>
                </div>
                <div class="row">
                    <label for="endDate" class="form-label ">End date</label>
                    <div class="col-12">
                        <input type="date" class="form-control " name="endDate" id="endDate" placeholder="" value="${endDateinput.toISOString().split('T')[0]}"/>
                    </div>
                </div>
                <div class="row" >
                    <div class="col" >
                        <button type="button"  class="btn btn-secondary" data-dismiss="modal" id="myBtnCompute">Calculer</button>
                    </div>
                </div>
            </div> 

            <div class="col-md-12 main" style="padding:10px" id="resultDisplay">
            </div >
`;

        document.querySelector("#" + htlmPartId).innerHTML = output;


        //*************************  Actions
        // *** Copy to clipboard
        document.querySelector("#extractButton").onclick = async function () {
            try {
                copyToClipboard(tabFullResult, bookinglines);
                displayToast("messageSection", "Copy booking", "Contenu copié dans le presse-papier")
            } catch (error) {
                document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}  </div > `;
            }
        };

        // ***  display the period booking
        document.querySelector("#myBtnCompute").onclick = async function () {
            try {

                document.querySelector("#messageSection").innerHTML = ``;

                let startDate = document.querySelector("#startDate").value;
                let endDate = document.querySelector("#endDate").value;


                // TODO : voir ce dernier paramètre de getHostingBooking
                // *** Load order list
                bookinglines = await getHostingBooking(startDate, endDate, null);

                // *** Analyse order list and build array
                let bookingresults = bookinglines[0];
                let bookingunavailables = bookinglines[1];

                // TODO : l'original comportait un second filtre
                let filteredResults = bookingresults.filter((orderline) => (orderline.order.statut > '0'));

                tabFullResult = buildHostingTable(filteredResults, bookingunavailables, startDate, endDate);
                let tableView = getTableView(tabFullResult);
                let resultDisplay = tableView;

                // *** Display the HTML string
                document.querySelector("#resultDisplay").innerHTML = resultDisplay;

                addMultipleEnventListener(".gridCellOrder", function (event) {
                    // getLinkWithctrl(`${getAppPath()}/views/simpleEntity/simpleEntity.html?simpleEntityID=` + event.currentTarget.getAttribute('searid') + `&simpleEntitytype=33`, event.ctrlKey)
                    console.log("Clicked");
                    let orderIdraw = event.currentTarget.getAttribute('id')
                    let orderID = orderIdraw.substring(0, orderIdraw.indexOf('|'));
                    orderExtractViewDisplay("modaleSection", orderID);

                });

            } catch (error) {
                document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}  </div > `;
            }


        };

    } catch (except) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }

}


/**
 * Internal function : build the booking array from the order list
 * @param {*} hosting : order list 
 * @param {*} bookingunavailables : unvailable rooms
 * @param {*} startDate 
 * @param {*} endDate 
 * @return Array
 */
export function buildHostingTable(hosting, bookingunavailables, startDate, endDate) {

    // *** Initialisations 
    if (startDate.length < 1 || endDate.length < 1 || Date(endDate) < Date(startDate))
        throw new Error("Invalid dates");

    // *** Get the rooms details, sort the rooms by place and room label
    let productRessourcestemp = getResourceProducts();
    let productRessources = productRessourcestemp.sort(
        (p1, p2) => (p1.array_options.options_sta_place + "-" + p1.label > p2.array_options.options_sta_place + "-" + p2.label) ? 1 : (p1.array_options.options_sta_place + "-" + p1.label < p2.array_options.options_sta_place + "-" + p2.label) ? -1 : 0);

    let hostingProducts = getHostingProducts();
    //let hosting = json.data;

    /// let hosting = [];
    // if (lines !== [])
    //  hosting = [...lines];
    let dateDebut = new Date(startDate);
    let dateFin = new Date(endDate);
    let nbJour = Math.round((dateFin - dateDebut) / 86400000);

    const tabTempResult = new Array(productRessources.length).fill(0).map(() => new Array(nbJour + 1).fill(0));

    // *** iterate booking lines and Fill resultTable with 
    hosting.forEach(function (item, index, array) {
        var roomItem = item.array_options.options_lin_room;
        var dateDebutItem = new Date(item.array_options.options_lin_datedebut * 1000);
        var dateFinItem = new Date(item.array_options.options_lin_datefin * 1000);
        var startOffsetDays = Math.round((dateDebutItem - dateDebut) / 86400000); // The offset between the start of the line and the start of the analysed period
        var nbJours = Math.round(((dateFinItem - dateDebutItem) / 86400000) + 1); // The # days of the line
        // let startDateMoment = moment(item.array_options.options_lin_datedebut * 1000).format("YYYY-MM-DD");
        // *** Get the room line
        let currentline = productRessources.findIndex((product) => product.id === roomItem)

        /**  for each orderLine */
        if (currentline < 0) {
            console.log("La chambre n'a pas été trouvée dans la base de données - ligne de commande : " + index);
        } else {
            for (let i = 0; i <= nbJours - 1; i++) {
                if (!(startOffsetDays > nbJour))
                    if (!(i + startOffsetDays < 0))
                        tabTempResult[parseInt(currentline)][i + startOffsetDays] = item.fk_commande + '|' + i;
                    else
                        console.log("Erreur de rang colonne" + startOffsetDays + " - " + index);
            }
        }
        dateFinItem = new Date(item.array_options.options_lin_datefin * 1000);
    });

    // *** iterate unavailable rooms lines and add an x before the cell data of the resultTable
    bookingunavailables.forEach(function (item, index, array) {
        var roomItem = {};
        try {
            roomItem = JSON.parse(item.note_private.replace(/&quot;/g, '"'));
        } catch (err) {
            throw new Error(" Erreur d'analyse des données JSON de l'événement d'agenda, veuillez modifier l'événement dans Dolibarr");
        }

        // var roomItem = JSON.parse(item.note_private.replace(/&quot;/g, '"'));
        // var roomItem = JSON.parse(item.note_private);
        roomItem = roomItem.id;
        var dateDebutItem = new Date(item.datep * 1000);
        var dateFinItem = new Date(item.datef * 1000);
        var startOffsetDays = Math.round((dateDebutItem - dateDebut) / 86400000); // The offset between the start of the line and the start of the analysed period
        var nbJours = ((dateFinItem - dateDebutItem) / 86400000) + 1; // The # days of the line
        // let startDateMoment = moment(item.array_options.options_lin_datedebut * 1000).format("YYYY-MM-DD");
        // *** Get the room line
        let currentline = productRessources.findIndex((product) => product.id == roomItem)

        // *** for each orderLine
        if (currentline < 0) {
            console.log("La chambre n'a pas été trouvée dans la base de données - ligne de commande : " + index);
        } else {
            for (let i = 0; i <= nbJours - 1; i++) {
                if (!(startOffsetDays > nbJour))
                    if (!(i + startOffsetDays < 0)) {
                        tabTempResult[parseInt(currentline)][i + startOffsetDays] = "x" + tabTempResult[parseInt(currentline)][i + startOffsetDays];
                    }
            }
        }
        dateFinItem = new Date(item.array_options.options_lin_datefin * 1000);
    });

    // *** build data table for JSX display
    let tabFullResult = [];
    let tabTitleLine = [];
    tabTitleLine.push("Title");
    for (let ligne = 0; ligne <= nbJour; ++ligne) {
        var datedebutemp = new Date(dateDebut);
        var tempDate = new Date(datedebutemp.setDate(dateDebut.getDate() + ligne));
        tabTitleLine.push(tempDate.getDate() + "/" + (tempDate.getMonth() + 1)); // '%d-%b-%Y'
    }
    tabFullResult.push(tabTitleLine);

    /** Insert the room labels, Sort the rooms by place */
    /* let productRessourcesSorted = productRessources.sort(
      (p1, p2) => (p1.array_options.options_sta_place > p2.array_options.options_sta_place) ? 1 : (p1.array_options.options_sta_place < p2.array_options.options_sta_place) ? -1 : 0);
   */
    const intakeplaces = getintakeplacesTypes();

    for (let ligne = 0; ligne < productRessources.length; ++ligne) {
        let tabDataLine = [];
        /** insert the place name */
        let place = "";
        let test = intakeplaces.find(option => option.rowid == productRessources[ligne].array_options.options_sta_place);
        if (intakeplaces.find(option => option.rowid == productRessources[ligne].array_options.options_sta_place) !== undefined)
            place = intakeplaces.find(option => option.rowid === productRessources[ligne].array_options.options_sta_place).label;


        productRessources[ligne].place = place;
        tabDataLine.push(productRessources[ligne]);

        for (let colonne = 0; colonne <= nbJour; ++colonne) {
            // if (parseInt(tabTempResult[ligne][colonne]) > 0)
            tabDataLine.push(tabTempResult[ligne][colonne]);
            // else
            //    tabDataLine.push(0);
        }
        tabFullResult.push(tabDataLine);
    }

    // *** Get the error lines
    // let tabError = json.data.filter(line => line.array_options.options_lin_room === null);
    // let tabError = lines;
    return tabFullResult;

}

/**
 * Build the html string to be displayed from the booking array 
 * @param {*} tabFullResult 
 * @returns html string
 */
export function getTableView(tabFullResult) {

    let output = '';
    const tabData = tabFullResult.slice(1);

    output += `<Table class='table'>`;

    // ** Display horizontal titles 
    if (tabFullResult && tabFullResult.length > 0) {
        output += `<Thead><Tr key="0" style=" padding: 0 ">`;
        tabFullResult[0].map((dayName, index) => (
            output += `<Td style="padding:1px;border-Left: 1px solid #CACAC8; background-Color: #E6E5E5 " align="center" key="${index}"> ${dayName}</Td>`
        ));
        output += `</Tr></Thead>`;
    }

    // *** Display data lines */ 
    tabData.map((tabdataline, index) => {
        output += `<Tr key={index} >`;
        tabdataline.map((cellule, indexCell) => {
            if (cellule === 0 || cellule === 'x0') {
                //         ? /* // Nothing in the cell to display */
                output += `<Td style=" padding:0; border-Left:1px solid #CACAC8" id=${index + "-" + indexCell} align="center" key=${indexCell}>`;
                if (cellule[0] === 'x')
                    output += ` X`;

                output += `</Td >`;
            } else {
                if (indexCell > 0) {
                    if (cellule.substring(cellule.indexOf('|') + 1, cellule.length) == '0') {
                        //                 /* // ** first day of a reservation */
                        output += `<Td class="gridCellOrder" style="padding:0;background-color:#D9D583;cursor:pointer" id="${cellule}" 
                                 align="center" key=${indexCell}>`;
                        if (cellule[0] === 'x') {
                            output += ` X`;
                        }
                        output += `</Td>`;
                    } else {
                        output += `<Td class="gridCellOrder" style="padding:0;background-Color: #FCF8A2;cursor:pointer" id="${cellule}" 
                                                align="center" key=${indexCell}>`;
                        if (cellule[0] === 'x') {
                            output += ` X`;
                        }
                        output += `</Td>`;
                    }
                } else {
                    output += `<Td class="gridCellOrder" style="padding:0; padding-Left:5px;border-Left:1px solid #CACAC8 " align="left" key="{indexCell}">${cellule.place + " - " + cellule.label}
                        </Td>`;
                }
            }
            output += `</Td>`;
        });
        output += ` </Tr>`;
    });

    output += `</Table >`;
    return output;
}
