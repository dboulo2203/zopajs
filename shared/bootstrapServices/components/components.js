/**
 * 
 * @param {*} blocName 
 * @param {*} blocIcon 
 * @returns 
 */
export function getPageTitleDisplay(blocName, blocIcon) {
    let iconString;
    if (!blocIcon || (blocIcon && blocIcon.length == 0))
        iconString = ``
    else
        iconString = `<i class="bi ${blocIcon}"></i>`

    return `        
            <div class="d-flex  justify-content-between" style="margin-top:0px" >
                <span class="fs-4 text-danger-emphasis"  >${iconString} ${blocName}</span>
            </div>
            <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />
                `;
}


/**
 * Bloc header with configurable dropdown menu
 * @param {string} blocLabel - label displayed in the header
 * @param {string} blocIcon - HTML string for the icon (ex: `<i class="bi bi-person"></i>`)
 * @param {Array} menuItems - array of menu items: [{id, label, icon}]
 *   - id: identifier used to attach event listeners
 *   - label: text displayed in the menu
 *   - icon: (optional) bootstrap icon class (ex: "bi-pencil")
 * @returns {string} HTML string
 *
 * Usage:
 *   let menuItems = [
 *       { id: "editBtn", label: "Modifier", icon: "bi-pencil" },
 *       { id: "deleteBtn", label: "Supprimer", icon: "bi-trash" }
 *   ];
 *   let header = getBlocHeaderWithMenu("Mon bloc", `<i class="bi bi-person"></i>`, menuItems);
 */
export function getBlocHeaderWithMenu(blocLabel, blocIcon = "", menuItems = []) {

    let menuHtml = "";
    if (menuItems.length > 0) {
        let menuItemsHtml = menuItems.map(item => {
            let iconHtml = item.icon ? `<i class="bi ${item.icon}"></i> ` : "";
            return `<li><a class="dropdown-item" href="#" id="${item.id}">${iconHtml}${item.label}</a></li>`;
        }).join("");

        menuHtml = `
                    <div class="dropdown">
                        <a href="#" data-bs-toggle="dropdown" aria-expanded="false" class="text-secondary"><i class="bi bi-three-dots-vertical"></i></a>
                        <ul class="dropdown-menu" style="padding:10px">
                            ${menuItemsHtml}
                        </ul>
                    </div>`;
    }

    return `
        <div class="card-title block-title">
            <div class="d-flex justify-content-between">
                <span class="fs-5 text-danger-emphasis block-label">${blocIcon} ${blocLabel}</span>
                <div class="col-8 flex float-right text-end bloc-menu" style="cursor: pointer">
                    ${menuHtml}
                </div>
            </div>
            <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />
        </div>`;
}

/**
 * 
 * @param {*} fieldName 
 * @param {*} fieldValue 
 */
export function getStandardFieldDisplay(fieldName, fieldValue) {

    if (fieldValue !== null && fieldValue !== "")
        return `<div class="col-md-12 main"  > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div>`;
    else
        return `<div class="col-md-12 main" > <span class="fw-light" >${fieldName}</span> : </div > `;
}
//
/**
 * 
 * @param {*} fieldName 
 * @param {*} fieldValue 
 * @param {*} fieldlink 
 * @param {*} entityid 
 * @param {any}  forClass : true if we must tag the class otherwise we tag the id
 * @returns 
 */
export function getStandardFieldDisplayWithLink(fieldName, fieldValue, fieldlink, entityid, forClass = false) {

    let htmlCOntent = this.innerHTML = `<span class="fw-light" style ="cursor:pointer">${fieldName}</span> :`
    if (forClass)
        htmlCOntent += `<span class="text-danger-emphasis ${fieldlink}" style="cursor: pointer" entityid="${entityid}"
        id="${fieldlink}" onpointerenter="this.setAttribute('style', 'cursor: pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid rgb(159, 158, 158)')"
        onpointerleave="this.setAttribute('style', 'color: text-danger-emphasis;')">
            ${fieldValue === null ? '' : fieldValue}
        </span>`;

    else
        htmlCOntent += `<span class="text-danger-emphasis" style="cursor: pointer" entityid="${entityid}"
        id="${fieldlink}" onpointerenter="this.setAttribute('style', 'cursor: pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid rgb(159, 158, 158)')"
        onpointerleave="this.setAttribute('style', 'color: text-danger-emphasis;')">
            ${fieldValue === null ? '' : fieldValue}
        </span>`;
    return htmlCOntent;
}

/**
 * 
 * @param {*} fieldName 
 * @param {*} fieldid 
 * @param {*} fieldvalue 
 * @param {*} fieldMessage 
 * @param {*} fieldPlaceHolder 
 * @returns 
 */
export function getEditField(fieldName, fieldid, fieldvalue, fieldMessage = "", fieldPlaceHolder = "") {

    let htmlCOntent = `<div class="form-group row">
        <label class="fw-light col-sm-2" for="${fieldName}_name">${fieldName}</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" id="${fieldName}_name" aria-describedby="emailHelp" id="${fieldid}" placeholder="${fieldPlaceHolder}">
                <small id="emailHelp" class="form-text text-muted">${fieldMessage}</small>
        </div>
    </div>`

    return htmlCOntent

}