import productsData from './data.json' with { type: 'json' };

class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    set products(value) {
        this._products = value;
        this.render();
    }

    get products() {
        return this._products || productsData;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 24px;
                    justify-content: flex-start;
                    align-content: flex-start;
                }
            </style>
            <slot></slot>
        `;

        const products = this.products;
        products.forEach(product => {
            const card = document.createElement('product-card');
            card.product = product;
            this.shadowRoot.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);
