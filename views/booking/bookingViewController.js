// *** Component ressources
import { getHostingBooking } from './bookingService.js';
// *** Shared ressoucres
import { getProducts, getResourceProducts, getHostingProducts, getintakeplacesTypesFromAPI, getintakeplacesTypes, getMealTypesFromAPI } from '../../shared/services/productService.js'
// import { launchInitialisation } from '../../shared/services/initialisationService.js'
import { headerViewDisplay } from '../../shared/components/global/headerViewCont.js'//***  shared ressources
import { loadTranslations } from '../../shared/services/translationService.js'
// import { currentApplicationPath, imagePath } from '../../shared/assets/constants.js'
import { bookIcon, personIcon, keyIcon, printerIcon, publisherIcon, questionIcon } from '../../shared/assets/constants.js'

/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startBookingController() {

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

    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams);

    // if (searchParams.has('searchStr'))
    displayBookingContent("mainActiveSection");
}

/**
 * Display 
 * @param {*} htlmPartId 
 * @param {*} searchString : the string to searched in the database 
 */
export async function displayBookingContent(htlmPartId) {

    // *** Build the html string 
    let output = '';

    // *** Display the controller skeleton
    output += `
    <div style="padding-top:10px"><p class="fs-5" style="color:#8B2331">Display hosting booking</p></div><hr/>
    <div id='componentMessage'></div>
    <div class="col-6">
        <div class="row">    
            <label for="startDate" class="form-label col-3">Start date </label>
            <div class="col" style="margin:2px">
                <input type="date" class="form-control" name="startDate" id="startDate" placeholder="" value=""/>
            </div>
        </div>
        <div class="row">
            <label for="endDate" class="form-label col-3">End date</label>
            <div class="col" style="margin:2px">
                <input type="date" class="form-control " name="endDate" id="endDate" placeholder="" value=""/>
            </div>
        </div>
        <div class="row">
            <div class="col" style="margin:2px">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" id="myBtnCompute">Calculer</button>
            </div>
        </div>
    </div> 

    <div class="col-md-12 main" style="padding:10px" id="resultDisplay">
    </div >`;

    // *** Display skeleton
    document.querySelector("#" + htlmPartId).innerHTML = output;

    try {

        //***  Actions
        document.querySelector("#myBtnCompute").onclick = async function () {
            console.log("Compute button ");

            let startDate = document.querySelector("#startDate").value;
            let endDate = document.querySelector("#endDate").value;


            // TODO : voir ce dernier paramètre de getHostingBooking
            // *** Load order list
            let bookinglines = await getHostingBooking(startDate, startDate, null);

            // *** Analyse order list and build array
            let bookingresults = bookinglines[0];
            let bookingunavailables = bookinglines[1];

            // TODO : l'original comportait un second filtre
            let filteredResults = bookingresults.filter((orderline) => (orderline.order.statut > '0'));

            let tabFullResult = buildHostingTable(filteredResults, bookingunavailables, startDate, endDate);
            let tableView = getTableView(tabFullResult);
            let resultDisplay = tableView;

            // *** Display the HTML string
            document.querySelector("#resultDisplay").innerHTML = resultDisplay;

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
                output += `<Td style=" font-Size:1rem; padding:0; border-Left:1px solid #CACAC8" id=${index + "-" + indexCell} align="center" key=${indexCell}>`;
                if (cellule[0] === 'x')
                    output += ` X`;

                output += `</Td >`;
            } else {
                if (indexCell > 0) {
                    if (cellule.substring(cellule.indexOf('|') + 1, cellule.length) == '0') {
                        //                 /* // ** first day of a reservation */
                        output += `<Td class="fst-normal fw-light" style="padding:0;background-color:#D9D583;cursor:pointer" id="${cellule}" onClick={handleGridClick}
                                 align="center" key=${indexCell}>`;
                        if (cellule[0] === 'x') {
                            output += ` X`;
                        }
                        output += `</Td>`;
                    } else {
                        output += `<Td class="fst-normal fw-light" style="padding:0;background-Color: #FCF8A2;cursor:pointer" id="${cellule}" onClick={handleGridClick}
                                                align="center" key=${indexCell}>`;
                        if (cellule[0] === 'x') {
                            output += ` X`;
                        }
                        output += `</Td>`;
                    }
                } else {
                    output += `<Td class="fst-normal fw-light" style="padding:0; padding-Left:5px;border-Left:1px solid #CACAC8 " align="left" key="{indexCell}">${cellule.place + " - " + cellule.label}
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
