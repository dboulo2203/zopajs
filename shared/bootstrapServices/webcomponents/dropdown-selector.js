/**
 * DropdownSelector Web Component
 * A custom dropdown selector using Bootstrap dropdown component
 *
 * Attributes:
 * - api-url: URL of the API to fetch data
 * - api-key: API key for authentication
 * - selected-id: ID of the item to pre-select
 * - label-field: Field name to use as label (default: 'label')
 * - value-field: Field name to use as value (default: 'id')
 * - placeholder: Placeholder text when nothing is selected
 *
 * Methods:
 * - getValue(): Returns the selected item's value
 * - getSelectedItem(): Returns the complete selected item object
 * - setValue(value): Sets the selected value programmatically
 *
 * Events:
 * - change: Fired when selection changes
 */
class DropdownSelector extends HTMLElement {
    constructor() {
        super();
        this.items = [];
        this.selectedItem = null;
        this.labelField = 'label';
        this.valueField = 'id';
    }

    static get observedAttributes() {
        return ['api-url', 'api-key', 'selected-id', 'label-field', 'value-field', 'placeholder'];
    }

    connectedCallback() {
        // Get attributes
        this.apiUrl = this.getAttribute('api-url');
        this.apiKey = this.getAttribute('api-key');
        this.selectedId = this.getAttribute('selected-id');
        this.labelField = this.getAttribute('label-field') || 'label';
        this.valueField = this.getAttribute('value-field') || 'id';
        this.placeholder = this.getAttribute('placeholder') || 'Sélectionner un élément';

        // Render initial UI
        this.render();

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
                    this.placeholder = newValue || 'Sélectionner un élément';
                    this.updateButtonText();
                    break;
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="dropdown">
                <span class="dropdown-toggle" id="dropdownButton-${this.id || 'default'}" data-bs-toggle="dropdown" aria-expanded="false" style="cursor: pointer; user-select: none;">
                    ${this.placeholder}
                </span>
                <ul class="dropdown-menu w-100" aria-labelledby="dropdownButton-${this.id || 'default'}" style="max-height: 300px; overflow-y: auto;">
                    <li><a class="dropdown-item text-center text-muted" href="#">Chargement...</a></li>
                </ul>
            </div>
        `;

        this.button = this.querySelector('span[data-bs-toggle="dropdown"]');
        this.menu = this.querySelector('.dropdown-menu');
    }

    async loadData() {
        try {
            // Show loading state
            this.showLoading();

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

            // Render items
            this.renderItems();

            // Select initial item if specified
            if (this.selectedId) {
                this.selectById(this.selectedId);
            }

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Erreur de chargement des données');
        }
    }

    showLoading() {
        if (this.menu) {
            this.menu.innerHTML = `
                <li><a class="dropdown-item text-center text-muted" href="#">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Chargement...
                </a></li>
            `;
        }
    }

    showError(message) {
        if (this.menu) {
            this.menu.innerHTML = `
                <li><a class="dropdown-item text-center text-danger" href="#">${message}</a></li>
            `;
        }
    }

    renderItems() {
        if (!this.menu) return;

        if (this.items.length === 0) {
            this.menu.innerHTML = `
                <li><a class="dropdown-item text-center text-muted" href="#">Aucun élément disponible</a></li>
            `;
            return;
        }

        // Add search input
        const searchHtml = `
            <li class="px-3 py-2">
                <input type="text" class="form-control form-control-sm" placeholder="Rechercher..." id="searchInput-${this.id || 'default'}">
            </li>
            <li><hr class="dropdown-divider"></li>
        `;

        // Render items
        const itemsHtml = this.items.map(item => {
            const value = item[this.valueField];
            const label = item[this.labelField] || 'Sans titre';
            const ref = item.ref ? `<small class="text-muted d-block">${item.ref}</small>` : '';

            return `
                <li>
                    <a class="dropdown-item" href="#" data-value="${value}">
                        ${ref}
                        ${label}
                    </a>
                </li>
            `;
        }).join('');

        this.menu.innerHTML = searchHtml + itemsHtml;

        // Add click listeners to items
        this.menu.querySelectorAll('a.dropdown-item[data-value]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const value = link.getAttribute('data-value');
                this.selectByValue(value);
            });
        });

        // Add search functionality
        const searchInput = this.menu.querySelector(`#searchInput-${this.id || 'default'}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterItems(e.target.value);
            });
            searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    filterItems(searchTerm) {
        const links = this.menu.querySelectorAll('a.dropdown-item[data-value]');
        const term = searchTerm.toLowerCase();

        links.forEach(link => {
            const text = link.textContent.toLowerCase();
            const li = link.parentElement;
            if (text.includes(term)) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        });
    }

    selectByValue(value) {
        // Find item by value
        const item = this.items.find(i => String(i[this.valueField]) === String(value));
        if (item) {
            this.selectedItem = item;
            this.updateButtonText();
            this.dispatchChangeEvent();
        }
    }

    selectById(id) {
        this.selectByValue(id);
    }

    updateButtonText() {
        if (this.button) {
            if (this.selectedItem) {
                const label = this.selectedItem[this.labelField] || 'Sans titre';
                const ref = this.selectedItem.ref ? `<small class="text-muted">${this.selectedItem.ref}</small> - ` : '';
                this.button.innerHTML = ref + label;
            } else {
                this.button.textContent = this.placeholder;
            }
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

    setItems(items) {
        this.items = Array.isArray(items) ? items : [];
        this.renderItems();
    }
}

// Register the custom element
customElements.define('dropdown-selector', DropdownSelector);
