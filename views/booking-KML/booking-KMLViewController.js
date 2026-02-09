// *** Component ressources
import { getHostingBooking, copyToClipboard } from './booking-KMLService.js';
// *** Shared ressoucres
import { getResourceProducts, getHostingProducts } from '../../shared/zopaServices/zopaProductServices.js'
import { getList } from '../../shared/zopaServices/zopaListsServices.js'
import { isCurrentUSerLogged } from '../../shared/zopaServices/zopaLoginServices.js'

import { headerViewDisplay } from '../../shared/zopaAppservices/headerViewCont.js'//***  shared ressources
import { launchInitialisation } from '../../shared/zopaAppservices/initialisationService.js'
import { bedIcon, copyIcon } from '../../shared/assets/constants.js'
import { addMultipleEnventListener } from '../../shared/services/commonFunctions.js'
import { displayToast } from '../../shared/bootstrapServices/bootstrapCommon.js'


import { orderExtractViewDisplay } from './orderExtract/orderExtractViewCont.js'
import { getPageTitleDisplay } from '../../shared/bootstrapServices/components/components.js';

// Grid constants
const CELL_WIDTH = 50;
const ROW_HEIGHT = 40;
const LABEL_WIDTH = 220;

/**
 * when called from the url
 * get the parameters and launch the controller
 */
export async function startBookingKMLController() {

    try {
        // *** Initialisations
        await launchInitialisation();
        headerViewDisplay("#menuSection");

        if (!isCurrentUSerLogged())
            throw new Error("Veuillez vous authentifier");

        displayBookingContent("mainActiveSection");

    } catch (error) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error} - ${error.fileName}</br>${error.stack}  </div > `;
    }
}

/**
 * Display
 * @param {*} htlmPartId
 */
export async function displayBookingContent(htlmPartId) {

    try {

        let tabFullResult = null;
        let bookinglines = null;

        let startDateInput = new Date();
        let endDateinput = new Date();
        endDateinput.setDate(endDateinput.getDate() + 20);

        let output = '';
        output += `
            <div class="d-flex  justify-content-between" style="margin-top:60px"   >
            ${getPageTitleDisplay("Display hosting booking (KML)",)}
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
                        <button type="button"  style="margin-top:5px" class="btn btn-secondary" data-dismiss="modal" id="myBtnCompute">Calculer</button>
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

                // *** Load order list
                bookinglines = await getHostingBooking(startDate, endDate, null);

                // *** Analyse order list and build array
                let bookingresults = bookinglines[0];
                let bookingunavailables = bookinglines[1];

                let filteredResults = bookingresults.filter((orderline) => (orderline.order.statut > '0'));

                tabFullResult = buildHostingTable(filteredResults, bookingunavailables, startDate, endDate);

                // *** Build and display the interactive grid
                let resultDisplay = getInteractiveGridView(tabFullResult, bookinglines);
                document.querySelector("#resultDisplay").innerHTML = resultDisplay;

                // *** Setup drag & drop and click handlers
                setupDragAndDrop(tabFullResult);
                setupBarClickHandlers();

            } catch (error) {
                document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${error}  </div > `;
            }
        };

    } catch (except) {
        document.querySelector("#messageSection").innerHTML = `<div class="alert alert-danger" style = "margin-top:30px" role = "alert" > ${except} - ${except.fileName}</br>${except.stack}  </div > `;
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

    let dateDebut = new Date(startDate);
    let dateFin = new Date(endDate);
    let nbJour = Math.round((dateFin - dateDebut) / 86400000);

    const tabTempResult = new Array(productRessources.length).fill(0).map(() => new Array(nbJour + 1).fill(0));

    // *** iterate booking lines and Fill resultTable with
    hosting.forEach(function (item, index, array) {
        var roomItem = item.array_options.options_lin_room;
        var dateDebutItem = new Date(item.array_options.options_lin_datedebut * 1000);
        var dateFinItem = new Date(item.array_options.options_lin_datefin * 1000);
        var startOffsetDays = Math.round((dateDebutItem - dateDebut) / 86400000);
        var nbJours = Math.round(((dateFinItem - dateDebutItem) / 86400000) + 1);
        let currentline = productRessources.findIndex((product) => product.id === roomItem)

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

        roomItem = roomItem.id;
        var dateDebutItem = new Date(item.datep * 1000);
        var dateFinItem = new Date(item.datef * 1000);
        var startOffsetDays = Math.round((dateDebutItem - dateDebut) / 86400000);
        var nbJours = ((dateFinItem - dateDebutItem) / 86400000) + 1;
        let currentline = productRessources.findIndex((product) => product.id == roomItem)

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

    // *** build data table for display
    let tabFullResult = [];
    let tabTitleLine = [];
    tabTitleLine.push("Title");
    for (let ligne = 0; ligne <= nbJour; ++ligne) {
        var datedebutemp = new Date(dateDebut);
        var tempDate = new Date(datedebutemp.setDate(dateDebut.getDate() + ligne));
        tabTitleLine.push(tempDate.getDate() + "/" + (tempDate.getMonth() + 1));
    }
    tabFullResult.push(tabTitleLine);

    const intakeplaces = getList("intakeplaces");

    for (let ligne = 0; ligne < productRessources.length; ++ligne) {
        let tabDataLine = [];
        let place = "";
        let test = intakeplaces.find(option => option.rowid == productRessources[ligne].array_options.options_sta_place);
        if (intakeplaces.find(option => option.rowid == productRessources[ligne].array_options.options_sta_place) !== undefined)
            place = intakeplaces.find(option => option.rowid === productRessources[ligne].array_options.options_sta_place).label;

        productRessources[ligne].place = place;
        tabDataLine.push(productRessources[ligne]);

        for (let colonne = 0; colonne <= nbJour; ++colonne) {
            tabDataLine.push(tabTempResult[ligne][colonne]);
        }
        tabFullResult.push(tabDataLine);
    }

    return tabFullResult;
}


/**
 * Extract reservation bars from the 2D grid data
 * @param {*} tabFullResult - the 2D array [headers, ...roomRows]
 * @param {*} bookingLines - raw booking data from API
 * @returns Array of bar objects
 */
function extractReservationBars(tabFullResult, bookingLines) {
    const bars = [];
    const tabData = tabFullResult.slice(1); // skip header row
    const bookingResults = bookingLines[0];

    tabData.forEach((roomRow, roomIndex) => {
        let col = 1; // skip first column (room object)
        const nbCols = roomRow.length;

        while (col < nbCols) {
            const cell = roomRow[col];

            if (cell === 0 || cell === 'x0') {
                col++;
                continue;
            }

            // Check if this is a string cell with order data
            if (typeof cell === 'string') {
                let cleanCell = cell;
                let isUnavailable = false;
                if (cleanCell.startsWith('x')) {
                    cleanCell = cleanCell.substring(1);
                    isUnavailable = true;
                }

                const pipeIndex = cleanCell.indexOf('|');
                if (pipeIndex > 0) {
                    const orderId = cleanCell.substring(0, pipeIndex);
                    const dayOffset = parseInt(cleanCell.substring(pipeIndex + 1));

                    // Only start a bar at dayOffset === 0 (first day of reservation)
                    if (dayOffset === 0) {
                        const startDay = col - 1; // col-1 because col starts at 1 (col 0 is room obj)
                        let duration = 1;

                        // Count consecutive cells with the same orderId
                        let nextCol = col + 1;
                        while (nextCol < nbCols) {
                            let nextCell = roomRow[nextCol];
                            if (typeof nextCell === 'string') {
                                let cleanNext = nextCell;
                                if (cleanNext.startsWith('x')) cleanNext = cleanNext.substring(1);
                                const nextPipe = cleanNext.indexOf('|');
                                if (nextPipe > 0 && cleanNext.substring(0, nextPipe) === orderId) {
                                    duration++;
                                    nextCol++;
                                } else {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }

                        // Find customer name from booking data
                        let customerName = 'Réservation';
                        const bookingLine = bookingResults.find(bl => bl.fk_commande == orderId);
                        if (bookingLine) {
                            customerName = bookingLine.customername || 'Réservation';
                        }

                        bars.push({
                            orderId,
                            roomIndex,
                            startDay,
                            duration,
                            customerName,
                            isUnavailable
                        });

                        col = nextCol;
                        continue;
                    }
                }
            }

            col++;
        }
    });

    return bars;
}


/**
 * Build the interactive grid HTML from the booking data
 * @param {*} tabFullResult - the 2D array
 * @param {*} bookingLines - raw booking data from API
 * @returns HTML string
 */
export function getInteractiveGridView(tabFullResult, bookingLines) {
    const headers = tabFullResult[0]; // ["Title", "1/5", "2/5", ...]
    const tabData = tabFullResult.slice(1);
    const nbDays = headers.length - 1;
    const nbRooms = tabData.length;
    const totalGridWidth = LABEL_WIDTH + (nbDays * CELL_WIDTH);
    const headerHeight = 32;
    const totalGridHeight = headerHeight + (nbRooms * ROW_HEIGHT);

    // Extract reservation bars
    const bars = extractReservationBars(tabFullResult, bookingLines);

    let output = '';

    // Main container with overflow for scrolling
    output += `<div style="overflow-x:auto">`;
    output += `<div class="position-relative border" id="schedulerGrid" style="width:${totalGridWidth}px; height:${totalGridHeight}px">`;

    // === Header row ===
    output += `<div class="d-flex border-bottom bg-light" style="height:${headerHeight}px">`;
    output += `<div class="fw-bold small d-flex align-items-center px-1 border-end text-truncate" style="min-width:${LABEL_WIDTH}px; width:${LABEL_WIDTH}px">Chambres</div>`;
    for (let d = 1; d <= nbDays; d++) {
        output += `<div class="text-center fw-bold small d-flex align-items-center justify-content-center border-end" style="min-width:${CELL_WIDTH}px; width:${CELL_WIDTH}px">${headers[d]}</div>`;
    }
    output += `</div>`;

    // === Room rows (background grid) ===
    tabData.forEach((roomRow, roomIndex) => {
        const roomObj = roomRow[0];
        const roomLabel = roomObj.place + " - " + roomObj.label;

        output += `<div class="d-flex border-bottom" style="height:${ROW_HEIGHT}px" data-room-index="${roomIndex}">`;
        // Room label
        output += `<div class="small d-flex align-items-center px-1 border-end text-truncate" style="min-width:${LABEL_WIDTH}px; width:${LABEL_WIDTH}px">${roomLabel}</div>`;
        // Day cells
        for (let d = 1; d <= nbDays; d++) {
            const cell = roomRow[d];
            let cellContent = '';
            let cellClasses = 'border-end';
            // Mark unavailable cells
            if (typeof cell === 'string' && cell.startsWith('x')) {
                cellContent = '<span class="text-danger fw-bold">X</span>';
                cellClasses += ' bg-light';
            }
            output += `<div class="${cellClasses} d-flex align-items-center justify-content-center" style="min-width:${CELL_WIDTH}px; width:${CELL_WIDTH}px">${cellContent}</div>`;
        }
        output += `</div>`;
    });

    // === Reservation bars overlay ===
    output += `<div class="position-absolute" id="barsContainer" style="top:${headerHeight}px; left:${LABEL_WIDTH}px; width:${nbDays * CELL_WIDTH}px; height:${nbRooms * ROW_HEIGHT}px">`;

    bars.forEach((bar, barIndex) => {
        const left = bar.startDay * CELL_WIDTH;
        const top = bar.roomIndex * ROW_HEIGHT + 4;
        const width = bar.duration * CELL_WIDTH - 2;
        const height = ROW_HEIGHT - 8;

        // Different colors: use Bootstrap bg classes
        const bgClass = bar.isUnavailable ? 'bg-secondary bg-opacity-50' : 'bg-warning bg-opacity-75';

        output += `<div class="position-absolute ${bgClass} rounded-1 text-truncate small d-flex align-items-center px-1 border border-warning-subtle"
            style="left:${left}px; top:${top}px; width:${width}px; height:${height}px; cursor:grab; z-index:10; user-select:none"
            data-order-id="${bar.orderId}"
            data-room-index="${bar.roomIndex}"
            data-start-day="${bar.startDay}"
            data-duration="${bar.duration}"
            data-bar-index="${barIndex}"
            draggable="false">${bar.customerName}</div>`;
    });

    output += `</div>`; // barsContainer
    output += `</div>`; // schedulerGrid
    output += `</div>`; // overflow container

    return output;
}


/**
 * Setup drag & drop behavior on reservation bars using mouse events
 * @param {*} tabFullResult - for calculating grid bounds
 */
function setupDragAndDrop(tabFullResult) {
    const barsContainer = document.getElementById('barsContainer');
    if (!barsContainer) return;

    const nbRooms = tabFullResult.length - 1;
    const nbDays = tabFullResult[0].length - 1;

    let draggedBar = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isDragging = false;

    barsContainer.addEventListener('mousedown', function (e) {
        const bar = e.target.closest('[data-order-id]');
        if (!bar) return;

        isDragging = true;
        draggedBar = bar;

        const rect = bar.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        draggedBar.style.cursor = 'grabbing';
        draggedBar.style.zIndex = '100';
        draggedBar.style.opacity = '0.7';

        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging || !draggedBar) return;

        const containerRect = barsContainer.getBoundingClientRect();
        let newLeft = e.clientX - containerRect.left - dragOffsetX;
        let newTop = e.clientY - containerRect.top - dragOffsetY;

        // Constrain within container bounds
        const barDuration = parseInt(draggedBar.dataset.duration);
        const maxLeft = (nbDays - barDuration) * CELL_WIDTH;
        const maxTop = (nbRooms - 1) * ROW_HEIGHT;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        draggedBar.style.left = newLeft + 'px';
        draggedBar.style.top = newTop + 'px';

        e.preventDefault();
    });

    document.addEventListener('mouseup', function (e) {
        if (!isDragging || !draggedBar) return;

        // Snap to grid
        const barDuration = parseInt(draggedBar.dataset.duration);
        const currentLeft = parseFloat(draggedBar.style.left);
        const currentTop = parseFloat(draggedBar.style.top);

        let newStartDay = Math.round(currentLeft / CELL_WIDTH);
        let newRoomIndex = Math.round(currentTop / ROW_HEIGHT);

        // Clamp values
        newStartDay = Math.max(0, Math.min(newStartDay, nbDays - barDuration));
        newRoomIndex = Math.max(0, Math.min(newRoomIndex, nbRooms - 1));

        // Snap position
        draggedBar.style.left = (newStartDay * CELL_WIDTH) + 'px';
        draggedBar.style.top = (newRoomIndex * ROW_HEIGHT + 4) + 'px';

        // Update data attributes
        draggedBar.dataset.startDay = newStartDay;
        draggedBar.dataset.roomIndex = newRoomIndex;

        // Restore style
        draggedBar.style.cursor = 'grab';
        draggedBar.style.zIndex = '10';
        draggedBar.style.opacity = '1';

        isDragging = false;
        draggedBar = null;
    });
}


/**
 * Setup click handlers on bars to show order details
 */
function setupBarClickHandlers() {
    const barsContainer = document.getElementById('barsContainer');
    if (!barsContainer) return;

    let mouseDownPos = null;

    barsContainer.addEventListener('mousedown', function (e) {
        mouseDownPos = { x: e.clientX, y: e.clientY };
    });

    barsContainer.addEventListener('mouseup', function (e) {
        if (!mouseDownPos) return;

        // Only trigger click if the mouse didn't move much (not a drag)
        const dx = Math.abs(e.clientX - mouseDownPos.x);
        const dy = Math.abs(e.clientY - mouseDownPos.y);

        if (dx < 5 && dy < 5) {
            const bar = e.target.closest('[data-order-id]');
            if (bar) {
                const orderId = bar.dataset.orderId;
                orderExtractViewDisplay("modaleSection", orderId);
            }
        }

        mouseDownPos = null;
    });
}
