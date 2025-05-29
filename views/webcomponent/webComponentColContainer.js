class ColContainer extends HTMLElement {

    constructor() {
        super();
        // this.innerHTML = "test";

        //  const cols = this.querySelectorAll('div');

        // this.style.display = "grid";
        // this.style.color = 'grey';
        //  this.style.backgroundColor = 'red;'
        //  this.style.gridTemplateColumns = `repeat(${cols.length},1fr)`
        this.name = 'World';
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'closed' });

        shadow.innerHTML = `
          <style>
            p {
              text-align: center;
              font-weight: normal;
              padding: 1em;
              margin: 0 0 2em 0;
              background-color: #eee;
              border: 1px solid #666;
            },
              
          </style>
      
          <p>Hello ${this.name}!</p>`;

    }
    // components attributes
    static get observedAttributes() {
        return ['name'];
    }

    // attribut change
    attributeChangedCallback(property, oldValue, newValue) {

        if (oldValue === newValue) return;
        this[property] = newValue;

    }
}

window.customElements.define('col-container', ColContainer);

// ** Modifi d'attribut par javasccript
// document.querySelector('hello-world').setAttribute('name', 'Everyone') ;