
export function displayField(fieldName, fieldValue) {
    return `<div class="col-md-12 main"  > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div>`;
}
export function addslashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}


/**
 * Bloc title component 
 * with attribute change
 */
export class BlocTitleDisplay extends HTMLElement {
    constructor() {
        super();
        this.username = '';
        this.usericon = '';
        // this.shadow = null;
        // this.shadow = this.attachShadow({ mode: 'closed' });
    }
    // component attributes
    static get observedAttributes() {
        return ['username', 'usericon'];
    }
    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {

        if (oldValue === newValue) return;

        this[property] = newValue;
        //  this.updateDisplay()

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
                ${this.oldInner}
            </div>
        </div>
        <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    }
}

//  < !--  < div class="dropdown" >${this.oldInner}
//         <a href="#" class="btn" data-bs-toggle="dropdown" aria-expanded="false" color:grey>${threedotsvertical}  </a>

//         <ul class="dropdown-menu bg-light-subtle" style="padding:10px;background-color:#F7F7F3">
//             <li id="deleteLine">Supprimer ligne</li>
//             <li>Editer ligne</li>
//             <li>Scinder ligne</li>
//             <li><hr class="dropdown-divider"></li>
//             <li>Supprimer repas</li>
//         </ul>
//     </div > -->

/**
 * 
 */
export class BlocTitleDisplaywithMenu extends HTMLElement {
    connectedCallback() {
        let iconString;
        let userName = this.getAttribute("userName");
        let userIcon = this.getAttribute("userIcon");
        if (userIcon.length == 0)
            iconString = ''
        else
            iconString = eval(userIcon);
        this.innerHTML = `< div style = "margin-top:10px" > <span class="fs-5" style="color:#8B2331">` + iconString + ' ' + userName + `</span></div >
            <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;
    }
}


export class StandardFieldDisplay extends HTMLElement {
    connectedCallback() {

        let fieldName = this.getAttribute("fieldName");
        let fieldValue = this.getAttribute("fieldValue");
        this.innerHTML = `< div class="col-md-12 main" > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div > `;
    }
}

export class StandardFieldNotNullDisplay extends HTMLElement {
    connectedCallback() {

        let fieldName = this.getAttribute("fieldName");
        let fieldValue = this.getAttribute("fieldValue");
        if (fieldValue !== null && fieldValue !== "")
            this.innerHTML = `< div class="col-md-12 main" > <span class="fw-light" >${fieldName}</span> : ${fieldValue}</div > `;
    }
}



class HelloWorld extends HTMLElement {

    constructor() {
        super();
        this.name = '';
    }
    // component attributes
    static get observedAttributes() {
        return ['name'];
    }
    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {

        if (oldValue === newValue) return;
        this[property] = newValue;
        // this.innerHTML = `!`;
        this.updateDisplay()

    }
    // connect component
    connectedCallback() {
        this.updateDisplay()
    }

    updateDisplay() {
        this.innerHTML = `< div style = "margin-top:10px" > <span class="fs-4" style="color:#8B2331">Hello ${this.name} </span></div >
            <hr style="margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />`;

    }

}

export function initWebComponents() {
    customElements.define('dob-bloctitle', BlocTitleDisplay);
    customElements.define('dob-stdfield', StandardFieldDisplay);
    customElements.define('dob-stdnotnullfield', StandardFieldNotNullDisplay);
    customElements.define('hello-world', HelloWorld);
}
// export class blocTitleDisplay extends HTMLElement {
//     connectedCallback() {
//         let titleText = this.getAttribute("titleText");
//         let titleIcon = this.getAttribute("fieldValue");

//         connectedCallback() {
//             this.innerHTML = `
// <div class="d-flex" style="padding-top:0px">
//                 <div class="flex-grow-1"><span class="fs-5" style="color:#8B2331">${titleIcon} ${title}</span></div>
//                 <div class="" style="cursor: pointer">
//                      <!-- <div class="dropdown">
//                       <a class="btn" href="#" data-bs-toggle="dropdown" aria-expanded="false" role="button">${threedotsvertical}  </a>
//                         <ul class="dropdown-menu bg-light-subtle" style="padding:10px;width:250px">
//                             <li id=""><span>${addOrderIcon} Outil prestation stage</span></li>
//                             <li id=""><span>${addOrderIcon} Outil prestation retraite</span></li>
//                             <li><hr class="dropdown-divider"></li>
//                             <li id=""><span>${bedIcon} Ajouter un hébergement</span></li>
//                             <li id=""><span>${mealIcon} Ajouter un repas</span></li>
//                             <li id=""><span>${addOrderIcon} Ajouter une adhésion</span></li>
//                             <li><hr class="dropdown-divider"></li>
//                             <li id=""><span>${plussquareIcon} Ajouter un produit</span></li>
//                         </ul>
//                     </div> -->
//                 </div>
//             </div>
//             <hr style = "margin-block-start:0.3rem;margin-block-end:0.3rem;margin-top:0px" />';

//     }
// }
