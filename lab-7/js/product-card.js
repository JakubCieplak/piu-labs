class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.querySelector('.add-to-cart').addEventListener('click', () => {
            alert('Dodano do koszyka!');
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 280px;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                :host(:hover) {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                }

                .image-container {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                }

                ::slotted([slot="image"]) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .promo-container {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }

                ::slotted([slot="promo"]) {
                    display: inline-block;
                    background: #e53935;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-weight: bold;
                    font-size: 14px;
                }

                .content {
                    padding: 16px;
                }

                .name-container {
                    margin: 0 0 8px 0;
                }

                ::slotted([slot="name"]) {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin: 0;
                }

                .price-container {
                    margin-bottom: 12px;
                }

                ::slotted([slot="price"]) {
                    font-size: 22px;
                    font-weight: 700;
                    color: #2e7d32;
                }

                .options {
                    margin-bottom: 16px;
                }

                .option-group {
                    margin-bottom: 12px;
                }

                .option-label {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 6px;
                }

                .colors-container, .sizes-container {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-top: 6px;
                }

                ::slotted([slot="colors"]) {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                ::slotted([slot="sizes"]) {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                button.add-to-cart {
                    width: 100%;
                    padding: 12px;
                    background: #1976d2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                button.add-to-cart:hover {
                    background: #1565c0;
                }

                button.add-to-cart:active {
                    background: #0d47a1;
                }
            </style>

            <div class="image-container">
                <slot name="image"></slot>
                <div class="promo-container">
                    <slot name="promo"></slot>
                </div>
            </div>

            <div class="content">
                <div class="name-container">
                    <slot name="name"></slot>
                </div>
                <div class="price-container">
                    <slot name="price"></slot>
                </div>

                <div class="options">
                    <div class="option-group">
                        <div class="option-label">Kolor:</div>
                        <div class="colors-container">
                            <slot name="colors"></slot>
                        </div>
                    </div>
                    <div class="option-group">
                        <div class="option-label">Rozmiar:</div>
                        <div class="sizes-container">
                            <slot name="sizes"></slot>
                        </div>
                    </div>
                </div>

                <button class="add-to-cart">Do koszyka</button>
            </div>
        `;
    }
}

customElements.define('product-card', ProductCard);
