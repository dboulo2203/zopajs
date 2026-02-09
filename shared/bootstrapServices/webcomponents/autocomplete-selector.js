/**
 * AutocompleteSelector Web Component
 * An autocomplete dropdown selector using Bootstrap dropdown component
 * The dropdown is triggered by typing at least one character in an input field
 *
 * Attributes:
 * - api-url: URL of the API to fetch data
 * - api-key: API key for authentication
 * - selected-id: ID of the item to pre-select
 * - label-field: Field name to use as label (default: 'label')
 * - value-field: Field name to use as value (default: 'id')
 * - placeholder: Placeholder text for the input
 * - min-chars: Minimum characters to trigger dropdown (default: 1)
 *
 * Methods:
 * - getValue(): Returns the selected item's value
 * - getSelectedItem(): Returns the complete selected item object
 * - setValue(value): Sets the selected value programmatically
 * - clear(): Clears the selection and input
 *
 * Events:
 * - change: Fired when selection changes
 * - input: Fired when user types in the input
 */
class AutocompleteSelector extends HTMLElement {
    constructor() {
        super();
        this.items = [];
        this.filteredItems = [];
        this.selectedItem = null;
        this.labelField = 'label';
        this.valueField = 'id';
        this.minChars = 1;
        this.dropdownInstance = null;
    }

    static get observedAttributes() {
        return ['api-url', 'api-key', 'selected-id', 'label-field', 'value-field', 'placeholder', 'min-chars'];
    }

    connectedCallback() {
        // Get attributes
        this.apiUrl = this.getAttribute('api-url');
        this.apiKey = this.getAttribute('api-key');
        this.selectedId = this.getAttribute('selected-id');
        this.labelField = this.getAttribute('label-field') || 'label';
        this.valueField = this.getAttribute('value-field') || 'id';
        this.placeholder = this.getAttribute('placeholder') || 'Tapez pour rechercher...';
        this.minChars = parseInt(this.getAttribute('min-chars')) || 1;

        // Render initial UI
        this.render();

        // Setup event listeners
        this.setupEventListeners();

        // Load data from API
        if (this.apiUrl) {
            this.loadData();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case 'api-url':
                    this.apiUrl = newValue;
                    if (newValue) this.loadData();
                    break;
                case 'api-key':
                    this.apiKey = newValue;
                    break;
                case 'selected-id':
                    this.selectedId = newValue;
                    this.selectById(newValue);
                    break;
                case 'label-field':
                    this.labelField = newValue || 'label';
                    break;
                case 'value-field':
                    this.valueField = newValue || 'id';
                    break;
                case 'placeholder':
                    this.placeholder = newValue || 'Tapez pour rechercher...';
                    if (this.input) this.input.placeholder = this.placeholder;
                    break;
                case 'min-chars':
                    this.minChars = parseInt(newValue) || 1;
                    break;
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="autocomplete-wrapper position-relative">
                <input
                    type="text"
                    class="form-control"
                    placeholder="${this.placeholder}"
                    autocomplete="off"
                    id="autocompleteInput-${this.id || 'default'}"
                >
                <div class="dropdown-menu w-100" style="max-height: 300px; overflow-y: auto; display: none;">
                    <div class="dropdown-item text-center text-muted">
                        Tapez au moins ${this.minChars} caractère${this.minChars > 1 ? 's' : ''} pour rechercher...
                    </div>
                </div>
            </div>
        `;

        this.input = this.querySelector('input');
        this.menu = this.querySelector('.dropdown-menu');
    }

    setupEventListeners() {
        if (!this.input || !this.menu) return;

        // Input event - trigger filtering
        this.input.addEventListener('input', (e) => {
            const value = e.target.value.trim();

            if (value.length >= this.minChars) {
                this.filterItems(value);
                this.showDropdown();
            } else {
                this.hideDropdown();
            }

            // Dispatch input event
            this.dispatchEvent(new CustomEvent('input', {
                detail: { value },
                bubbles: true
            }));
        });

        // Focus event - show dropdown if there's text
        this.input.addEventListener('focus', () => {
            const value = this.input.value.trim();
            if (value.length >= this.minChars) {
                this.filterItems(value);
                this.showDropdown();
            }
        });

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                this.hideDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    async loadData() {
        try {
            // Construct URL
            let url = this.apiUrl;
            if (this.apiKey) {
                const separator = url.includes('?') ? '&' : '?';
                url += `${separator}DOLAPIKEY=${this.apiKey}`;
            }

            // Fetch data
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.items = Array.isArray(data) ? data : [];

            // Select initial item if specified
            if (this.selectedId) {
                this.selectById(this.selectedId);
            }

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Erreur de chargement des données');
        }
    }

    showError(message) {
        if (this.menu) {
            this.menu.innerHTML = `
                <div class="dropdown-item text-center text-danger">${message}</div>
            `;
        }
    }

    filterItems(searchTerm) {
        if (!searchTerm || searchTerm.length < this.minChars) {
            this.filteredItems = [];
            return;
        }

        const term = searchTerm.toLowerCase();
        this.filteredItems = this.items.filter(item => {
            const label = (item[this.labelField] || '').toLowerCase();
            const ref = (item.ref || '').toLowerCase();
            return label.includes(term) || ref.includes(term);
        });

        this.renderFilteredItems();
    }

    renderFilteredItems() {
        if (!this.menu) return;

        if (this.filteredItems.length === 0) {
            this.menu.innerHTML = `
                <div class="dropdown-item text-center text-muted">Aucun résultat trouvé</div>
            `;
            return;
        }

        // Render filtered items
        const itemsHtml = this.filteredItems.map(item => {
            const value = item[this.valueField];
            const label = item[this.labelField] || 'Sans titre';
            const ref = item.ref ? `<small class="text-muted d-block">${item.ref}</small>` : '';

            return `
                <a class="dropdown-item" href="#" data-value="${value}">
                    ${ref}
                    ${label}
                </a>
            `;
        }).join('');

        this.menu.innerHTML = itemsHtml;

        // Add click listeners to items
        this.menu.querySelectorAll('a.dropdown-item[data-value]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const value = link.getAttribute('data-value');
                this.selectByValue(value);
                this.hideDropdown();
            });
        });
    }

    showDropdown() {
        if (this.menu) {
            this.menu.style.display = 'block';
        }
    }

    hideDropdown() {
        if (this.menu) {
            this.menu.style.display = 'none';
        }
    }

    selectByValue(value) {
        // Find item by value
        const item = this.items.find(i => String(i[this.valueField]) === String(value));
        if (item) {
            this.selectedItem = item;
            this.updateInputValue();
            this.dispatchChangeEvent();
        }
    }

    selectById(id) {
        this.selectByValue(id);
    }

    updateInputValue() {
        if (this.input && this.selectedItem) {
            const label = this.selectedItem[this.labelField] || 'Sans titre';
            const ref = this.selectedItem.ref ? `${this.selectedItem.ref} - ` : '';
            this.input.value = ref + label;
        }
    }

    dispatchChangeEvent() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.getValue(),
                item: this.getSelectedItem()
            },
            bubbles: true
        }));
    }

    // Public methods
    getValue() {
        return this.selectedItem ? this.selectedItem[this.valueField] : null;
    }

    getSelectedItem() {
        return this.selectedItem;
    }

    setValue(value) {
        this.selectByValue(value);
    }

    clear() {
        this.selectedItem = null;
        if (this.input) {
            this.input.value = '';
        }
        this.hideDropdown();
        this.dispatchChangeEvent();
    }

    setItems(items) {
        this.items = Array.isArray(items) ? items : [];
    }
}

// Register the custom element
customElements.define('autocomplete-selector', AutocompleteSelector);
