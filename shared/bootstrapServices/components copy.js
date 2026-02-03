
import { addMultipleEnventListener } from '../../shared/services/commonFunctions.js'
export function displayField(fieldName, fieldValue) {
    return `<div class="col-md-12 main"  > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div>`;
}
// export function addslashes(str) {
//     return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
// }

/**
 * Return the List content of a sessionstorage list (json string)
 * @returns 
 */
export function getListFromSessionstorage(listName) {
    let frBase = sessionStorage.getItem(listName);
    if (frBase)
        return JSON.parse(frBase);
    else
        return null;
}

/**
 * 
 */
export class BlocTitleDisplay extends HTMLElement {
    connectedCallback() {
        let iconString;
        let userName = this.getAttribute("userName");
        let userIcon = this.getAttribute("userIcon");
        if (!userIcon || (userIcon && userIcon.length == 0))
            iconString = ''
        else
            iconString = eval(userIcon);
        this.innerHTML = `<div style="margin-top:10px"><span class="fs-5" style="color:#8B2331">` + iconString + ' ' + userName + `</span></div>
        <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    }
}

/**
 * Bloc title component 
 * with attribute change
 */
export class BlocTitleDisplayv1 extends HTMLElement {
    constructor() {
        super();
        this.username = '';
        this.usericon = '';
    }
    // component attributes
    static get observedAttributes() {
        return ['username', 'usericon'];
    }
    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {

        if (oldValue === newValue) return;

        this[property] = newValue;
    }

    // connect component
    connectedCallback() {
        this.oldInner = this.innerHTML;
        this.updateDisplay()
    }

    updateDisplay() {
        let buildIcon = "";
        if (this.usericon !== "")
            buildIcon = `<i class="bi ${this.usericon}"></i>`
        this.innerHTML = `
        <div class="d-flex " style="padding-top:0px" >
            <div class="flex-grow-1"><span class="fs-5 text-danger-emphasis"  > ${buildIcon} ${this.username}</span></div>
            <div class=" " >
                <div class="dropdown">
                    <a href="#" class="btn" data-bs-toggle="dropdown" aria-expanded="false" style="padding:0px;margin:0px"><i
                        class="bi bi-three-dots-vertical" ></i>
                    </a>
                    ${this.oldInner}
                </div>
            </div>
        </div>
        <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    }
}

/**
 * 
 */
export class BlocTitleDisplaywithMenu extends HTMLElement {
    connectedCallback() {
        let iconString;
        let userName = this.getAttribute("userName");
        let userIcon = this.getAttribute("userIcon");
        if (userIcon && userIcon.length == 0)
            iconString = ''
        else
            iconString = eval(userIcon);
        this.innerHTML = `< div style = "margin-top:10px" > <span class="fs-5" style="color:#8B2331">` + iconString + ' ' + userName + `</span></div >
            <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    }
}

/**
 * Standard field with field  label and field value
 */
export class StandardFieldDisplay extends HTMLElement {
    connectedCallback() {

        let fieldName = this.getAttribute("fieldName");
        let fieldValue = this.getAttribute("fieldValue");
        if (fieldValue !== null && fieldValue !== "")
            this.innerHTML = `<div class="col-md-12 main"  > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div>`;
        else
            this.innerHTML = `<div class="col-md-12 main" > <span class="fw-light" >${fieldName}</span> : </div > `;
    }
}

/**
 * Standard field with field  label and field value.
 * Hide the whole component if the field value is null
 */
export class StandardFieldNotNullDisplay extends HTMLElement {
    connectedCallback() {

        let fieldName = this.getAttribute("fieldName");
        let fieldValue = this.getAttribute("fieldValue");
        if (fieldValue !== null && fieldValue !== "")
            this.innerHTML = `<div class="col-md-12 main"  > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div>`;
        else
            this.innerHTML = ``
    }
}

/**
 * Display a standard field  : The field value is clickable. The field type is unique
 * * means the fieldlink is the id of the component
 * @param : fieldName : visible label
 * @param : fieldValue : visible value
 * @param : fieldlink : the id of the component (should be used to add a listener)
 * @param : entityid : the id of the entity linked 
 * for example fieldlink='noticeButton' entityid='10061' means we want a link to the notice witch id is '10061'
 */
export class StandardFieldDisplayWithLink extends HTMLElement {
    connectedCallback() {

        let fieldName = this.getAttribute("fieldName");
        let fieldValue = this.getAttribute("fieldValue");
        let fieldlink = this.getAttribute("fieldlink");
        let entityid = this.getAttribute("entityid");
        this.innerHTML = `<span class="fw-light" style ="cursor:pointer">${fieldName}</span> :`;

        this.innerHTML += `<span class="text-danger-emphasis" style="cursor: pointer" entityid="${entityid}"
        id="${fieldlink}" onpointerenter="this.setAttribute('style', 'cursor: pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid rgb(159, 158, 158)')"
        onpointerleave="this.setAttribute('style', 'color: text-danger-emphasis;')">
            ${fieldValue === null ? '' : fieldValue}
        </span>`;
    }
}

/**
 * Display a standard field  : The field value is clickable, the field type is not unique (is within a list of StandardFieldWithLinkClass)
 * means the fieldlink is the class of the component
 * @param : fieldName : visible label
 * @param : fieldValue : visible value
 * @param : fieldlink : the id of the component (should be used to add a listener)
 * @param : entityid : the id of the entity linked 
 * for example fieldlink='noticeButton' entityid='10061' means we want a link to the notice witch id is '10061'
 */
export class StandardFieldWithLinkClass extends HTMLElement {
    connectedCallback() {

        let fieldName = this.getAttribute("fieldName");
        let fieldValue = this.getAttribute("fieldValue");
        let fieldlink = this.getAttribute("fieldlink");
        let entityid = this.getAttribute("entityid");
        if (fieldName !== "")
            this.innerHTML = `<span class="fw-light" style ="cursor:pointer">${fieldName}</span> : `;

        this.innerHTML += `<span class="text-danger-emphasis ${fieldlink}" style="cursor: pointer" entityid="${entityid}"
         onpointerenter="this.setAttribute('style', 'cursor: pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid rgb(159, 158, 158)')"
        onpointerleave="this.setAttribute('style', 'color: text-danger-emphasis;')">
            ${fieldValue === null ? '' : fieldValue}
        </span>`;
    }
}

/**
 * DropDown choice
 * The data list is taken from the session storage
 * the selecteditemid attribute give access to the user choice
 * 
 * @param : <dob-dropdownchoice id="intakeplaces_id" listlabel="intakeplaces" listname="intakeplaces" listitemid="rowid"
            listitemname="label" listselecteditemid="2" >
        </dob-dropdownchoice>
 * @param : id of the component 
 */
export class DropdownChoice extends HTMLElement {
    constructor() {

        super();
        // this.div = document.createElement('div');
        // this.div.id = "divid";
        // this.appendChild(this.div);
    }

    // connect component
    connectedCallback() {

        this.id = this.getAttribute("id");
        this.listname = this.getAttribute("listname");
        this.listitemid = this.getAttribute("listitemid");
        this.listitemname = this.getAttribute("listitemname");
        this.listselecteditemidInit = this.getAttribute("listselecteditemid");
        this.selecteditemid = this.getAttribute("listselecteditemid");
        this.listlabel = this.getAttribute("listlabel");
        // this.getfunction = this.getAttribute("getfunction");

        this.selectedItemName = ''

        // *** Display the component
        this.updateDisplay();
    }
    /**
     * handle the choice of the user 
     */
    handleClickChangeChoice(id, name) {
        this.selecteditemid = id
        this.selectedItemLabel = name
        this.updateDisplay();
    }
    /**
     * the user remove the choice
     */
    handleClickRemove() {
        this.selecteditemid = ''
        this.selectedItemLabel = ''
        this.updateDisplay();
    }

    /**
     * Get the selected id and selected label
     * @readonly
     * @type {*}
     */
    get selectedID() {
        return this.selecteditemid;
    }
    get selectedLabel() {
        return this.selectedItemLabel;
    }


    /**
     *  Internal function used to define the attribute that can be changed
     * Observe the "selecteditemid" attribute
     * @static
     * @readonly
     * @type {{}}
     */
    static get observedAttributes() {
        return ['selecteditemid'];
    }

    /**
     * Internal function used to change the value of an attribute
     * @param {} name 
     * @param {*} oldValue 
     * @param {*} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selecteditemid' && oldValue !== newValue) {
            this.selecteditemid = newValue;
            this.updateDisplay();
        }
    }

    /**
     * Main display update 
     */
    updateDisplay() {
        let listlabel = this.listlabel
        let listName = this.listname
        let entityID = this.listitemid
        let entityName = this.listitemname
        // let addZeroOption = false
        let selectedId = this.selecteditemid
        // let getfunction = this.getfunction;

        let outpuStr = ``;
        outpuStr = `
           <div class="form-group row" style="margin-bottom:5px">
               <label for="exampleInputPassword1" class="col-sm-3 col-form-label" >
                   ${listlabel}
               </label>
               <div class="col-sm-8 ">                 
                       ${this.getDropdownContent(listName, entityID, entityName, selectedId, getListFromSessionstorage(listName))}
               </div >
                <div class="col-sm-1 ">    
                       <span id="delete_${listName}" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Remove">
                  <i class="bi bi-x"></i>           
               </div >
           </div >`;

        this.innerHTML = outpuStr;

        // ** Event Handler click on the list
        // Use arrow function to preserve `this`

        addMultipleEnventListener(`.${listName}_item`, (event) => {

            //  ❌ If you use a normal function, `this` will be undefined or point to the button
            this.handleClickChangeChoice(event.target.attributes['selectedId'].nodeValue, event.target.attributes['selectedName'].nodeValue);
        })

        document.querySelector(`#delete_${listName}`).addEventListener('click', (event) => {
            //  ❌ If you use a normal function, `this` will be undefined or point to the button
            this.handleClickRemove();
        });
        //    document.querySelector("#toDKLLibraryButton").onclick = function () {
        //     };

        // $(document).on('click', '.allow-focus .dropdown-menu', function (e) {
        //     $('.dropdown-menu, #overlay').toggleClass('show')
        //     e.stopPropagation();
        // });


    }

    getDropdownContent(listName, entityID, entityName, selectedId, getfunction) {
        let outpuStr = `<ul class="dropdown-menu" id="">`;
        let selectedItem = null
        // if (addZeroOption)
        //     outpuStr += `<li><a class="dropdown-item ${listName}_item" selectedId="0" selectedName=""> --- </a> </li>`;

        // TODO : Check if eval(function ) is ok
        let list = eval(getfunction);
        list.map((listentity, index) => {
            if (listentity[entityID] == selectedId) {
                selectedItem = listentity;
                this.selecteditemid = listentity[entityID];
                this.selectedItemLabel = listentity[entityName];

            }
            outpuStr += `<li><a class="dropdown-item ${listName}_item " selectedId="${listentity[entityID]}" selectedName="${listentity[entityName]}">${listentity[entityName]}</a></li>`;
        });
        outpuStr += '</ul >'
        if (selectedId) {
            if (selectedItem !== null)
                outpuStr += `<span class="dropdown-toggle" type="button" style="width:100%;border-bottom:solid 0.05rem #e9e8e8" type="button" 
                    data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId="${selectedItem[entityID]}">${selectedItem[entityName]} </span>`
            else
                outpuStr += `<span class="dropdown-toggle" type="button" style="width:100%;border-bottom:solid 0.05rem #e9e8e8" type="button" 
                    data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId=""> </span>`
        } else {
            outpuStr += `<span class="dropdown-toggle" type="button" style="width:100%;border-bottom:solid 0.05rem #e9e8e8" type="button" 
                data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId=""> </span>`
        }
        return outpuStr;
    }
}



/**
 * DropDown choice
 * The data list is taken from the session storage
 * the selecteditemid attribute give access to the user choice
 * 
 * @param : <dob-dropdownchoice id="intakeplaces_id" listlabel="intakeplaces" listname="intakeplaces" listitemid="rowid"
            listitemname="label" listselecteditemid="2" >
        </dob-dropdownchoice>
 * @param : id of the component 
 */
export class DropdownPredictiveChoice extends HTMLElement {
    constructor() {

        super();
        // this.div = document.createElement('div');
        // this.div.id = "divid";
        // this.appendChild(this.div);
    }

    // connect component
    connectedCallback() {

        this.id = this.getAttribute("id");
        this.listname = this.getAttribute("listname");
        this.listitemid = this.getAttribute("listitemid");
        this.listitemname = this.getAttribute("listitemname");
        this.listselecteditemidInit = this.getAttribute("listselecteditemid");
        this.selecteditemid = this.getAttribute("listselecteditemid");
        this.listlabel = this.getAttribute("listlabel");
        this.searchString = "";
        // this.getfunction = this.getAttribute("getfunction");

        this.selectedItemName = ''

        // *** Display the component
        this.updateDisplay();
    }
    /**
     * handle the choice of the user 
     */
    handleClickChangeChoice(id, name) {
        this.selecteditemid = id
        this.selectedItemLabel = name
        this.updateDisplay();
    }
    /**
     * the user remove the choice
     */
    handleClickRemove() {
        this.selecteditemid = ''
        this.selectedItemLabel = ''
        this.updateDisplay();
    }

    /**
     * Get the selected id and selected label
     * @readonly
     * @type {*}
     */
    get selectedID() {
        return this.selecteditemid;
    }
    get selectedLabel() {
        return this.selectedItemLabel;
    }


    /**
     *  Internal function used to define the attribute that can be changed
     * Observe the "selecteditemid" attribute
     * @static
     * @readonly
     * @type {{}}
     */
    static get observedAttributes() {
        return ['selecteditemid'];
    }

    /**
     * Internal function used to change the value of an attribute
     * @param {} name 
     * @param {*} oldValue 
     * @param {*} newValue 
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selecteditemid' && oldValue !== newValue) {
            this.selecteditemid = newValue;
            this.updateDisplay();
        }
    }

    /**
     * Main display update 
     */
    updateDisplay() {
        let listlabel = this.listlabel
        let listName = this.listname
        let entityID = this.listitemid
        let entityName = this.listitemname
        // let addZeroOption = false
        let selectedId = this.selecteditemid
        let searchString = this.searchString;

        let outpuStr = ``;
        outpuStr = `
           <div class="form-group row" style="margin-bottom:5px">
               <label for="exampleInputPassword1" class="col-sm-3 col-form-label" >
                   ${listlabel}
               </label>
               <div class="col-sm-8 ">  
               <ul class="dropdown-menu" id="${listName}_dp" data-bs-config='{"autoClose":false}'>
               </ul >
               <input class="dropdown-toggle" type="text" style="width:100%" type="button"
                    data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId="" value="${searchString}"> </input>
              
               </div >
            </div >`;

        this.innerHTML = outpuStr;

        //                 <div class="col-sm-1 ">    
        // <span id="delete_${listName}" style="cursor: pointer" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Remove">
        //     <i class="bi bi-x"></i>
        // </div >
                       ${ this.getDropdownContent(listName, entityID, entityName, selectedId, getListFromSessionstorage(listName), searchString) }
        // 

        // ** Event Handler click on the list
        // Use arrow function to preserve `this`
        //  ❌ If you use a normal function, `this` will be undefined or point to the button
        addMultipleEnventListener(`.${listName}_item`, (event) => {
            this.handleClickChangeChoice(event.target.attributes['selectedId'].nodeValue, event.target.attributes['selectedName'].nodeValue);
        })

        document.querySelector(`#delete_${listName}`).addEventListener('click', (event) => {
            this.handleClickRemove();
        });

        // *** the user fill the serach input
        if (document.querySelector(`#${listName}_inputspan`))
            document.querySelector(`#${listName}_inputspan`).addEventListener('input', (event) => {
                console.log(event.target.value);
                let searchString = event.target.value;
                if (searchString.length > 0) {

                    let listlabel = this.listlabel
                    let listName = this.listname
                    let entityID = this.listitemid
                    let entityName = this.listitemname
                    // let addZeroOption = false
                    let myDropdown = document.getElementById(`${listName}_dp`)
                    let selectedId = this.selecteditemid
                    // let searchString = this.searchString;
                    // 
                    let output = this.getDropdownContentInternal(myDropdown, listName, entityID, entityName, selectedId, getListFromSessionstorage(listName), searchString);

                    const dropdownJS = new bootstrap.Dropdown(myDropdown);
                    dropdownJS.show();


                } else {
                    const elementsToRemove = document.querySelectorAll(`.${listName}_item`);
                    elementsToRemove.forEach(element => {
                        element.remove();
                    });

                }
                //   event.stopPropagation();
            });
    }

       /**
     * Fill the dropdown with possible choices
     * @param {} listName 
     * @param {*} entityID 
     * @param {*} entityName 
     * @param {*} selectedId 
     * @param {*} getfunction 
     * @returns 
     */
    getDropdownContentInternal(ulparentElement, listName, entityID, entityName, selectedId, getfunction, searchString) {
        //  let outpuStr = `<ul class="dropdown-menu" id="${listName}_dp" data-bs-config='{"autoClose":false}'>`;
        let outpuStr = ``
        let selectedItem = null

        // *** Get the data list
        let list = null
        if (searchString != '') {
            let list1 = eval(getfunction);
            list = list1.filter((eleme) => eleme.label.toLowerCase().includes(searchString.toLowerCase()));
        } else
            list = eval(getfunction);

        // ** remove old values
        const elementsToRemove = document.querySelectorAll(`.${listName}_item`);
        elementsToRemove.forEach(element => {
            element.remove();
        });

        // *** fill with new values
        list.map((listentity, index) => {
            if (listentity[entityID] == selectedId) {
                selectedItem = listentity;
                this.selecteditemid = listentity[entityID];
                this.selectedItemLabel = listentity[entityName];

            }
            const listItem = document.createElement("li");
            // listItem.classList.add("dropdown-item ${listName}_item");
            const link = document.createElement("a");
            link.classList.add("dropdown-item");
            link.classList.add(`${listName}_item`);
            link.href = "#";
            link.textContent = listentity[entityName];
            link.selectedId = listentity[entityID]
            link.selectedName = listentity[entityName]
            listItem.appendChild(link);
            ulparentElement.appendChild(listItem);
        });
     }
}

export function initWebComponents() {
    customElements.define('dob-bloctitle', BlocTitleDisplay);
    customElements.define('dob-stdfieldwithlink', StandardFieldDisplayWithLink);
    customElements.define('dob-stdfieldwithlinkclass', StandardFieldWithLinkClass);

    customElements.define('dob-stdfield', StandardFieldDisplay);
    customElements.define('dob-stdnotnullfield', StandardFieldNotNullDisplay);

    customElements.define('dob-dropdownchoice', DropdownChoice);
    customElements.define('dob-dropdownpredictivechoice', DropdownPredictiveChoice);




    // customElements.define('dob-stdfieldClass', HelloWorld);
}



 // /**
    //  * Fill the dropdown with possible choices
    //  * @param {} listName 
    //  * @param {*} entityID 
    //  * @param {*} entityName 
    //  * @param {*} selectedId 
    //  * @param {*} getfunction 
    //  * @returns 
    //  */
    // getDropdownContent(listName, entityID, entityName, selectedId, getfunction, searchString) {
    //     let outpuStr = `<ul class="dropdown-menu" id="${listName}_dp" data-bs-config='{"autoClose":false}'>`;
    //     let selectedItem = null

    //     // *** Fill the list with the data
    //     // let list = null
    //     // if (searchString != '') {
    //     //     let list1 = eval(getfunction);
    //     //     list = list1.filter((eleme) => eleme.label.toLowerCase().includes(searchString.toLowerCase()));

    //     // } else
    //     //     list = eval(getfunction);

    //     // list.map((listentity, index) => {
    //     //     if (listentity[entityID] == selectedId) {
    //     //         selectedItem = listentity;
    //     //         this.selecteditemid = listentity[entityID];
    //     //         this.selectedItemLabel = listentity[entityName];

    //     //     }
    //     //     //  outpuStr += `<li><a class="dropdown-item ${listName}_item " selectedId="${listentity[entityID]}" selectedName="${listentity[entityName]}">${listentity[entityName]}</a></li>`;
    //     // });
    //     outpuStr += '</ul >'
    //     // if (selectedId) {
    //     //     if (selectedItem !== null)
    //     //         outpuStr += `<input class="dropdown-toggle" type="text" style="width:100%" type="button" 
    //     //             data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId="${selectedItem[entityID]}">${selectedItem[entityName]} </input>`
    //     //     else
    //     outpuStr += `<input class="dropdown-toggle" type="text" style="width:100%" type="button" 
    //                 data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId="" value="${searchString}"> </input>`
    //     // } else {
    //     //     outpuStr += `<input class="dropdown-toggle" type="text" style="width:100%;border-bottom:solid 0.05rem #e9e8e8" type="button" 
    //     //         data-bs-toggle="dropdown" id="${listName}_inputspan" selectedId=""> </input>`
    //     // }
    //     return outpuStr;
    // }
      // document.querySelector(`ul.dropdown-menu`).on("click", function (event) {
        //     e.stopPropagation();
        // });
        // let droptdownElement = document.querySelector(`ul.dropdown-menu`);
        // let bootstrapDrop = new bootstrap.Dropdown(droptdownElement);
        // bootstrapDrop.show()
        // //  bootstrapDrop.toggle()
        //   bootstrapDrop.toggle()

        // const myDropdown = document.getElementById(`${listName}_dp`)
        // myDropdown.addEventListener('show.bs.dropdown', event => {
        //     console.log("dropdown showned")
        // })

        // var powerOptions = document.getElementById(`${listName}_dp`);
        // var dropdown = new bootstrap.Dropdown(powerOptions);

        // powerOptions.addEventListener('show.bs.dropdown', function (event) {
        //     dropdown.update();
        // });