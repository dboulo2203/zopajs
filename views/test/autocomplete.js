import { AutocompleteSelector } from "../../shared/bootstrapServices/components/autocomplete-selector-plain.js";



export function startAutocompleteViewcontroller() {

    let output = `
    <h2> Test d'auto complete</h2>
    <div id ="autocomplete1"></div>`;

    document.querySelector("#mainActiveSection").innerHTML = output;


    let autocomplete1 = new AutocompleteSelector('#autocomplete1', {
        apiUrl: 'https://kusala.fr/dolibarr/api/index.php/products',
        apiKey: 'OpK1D8otonWg690PIoj570KdHSCqCc04',
        placeholder: 'Tapez pour rechercher un produit...'
    });

}
