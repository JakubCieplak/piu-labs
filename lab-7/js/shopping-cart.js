class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._items = [];
        this.render();
    }

    addItem(product) {
        this._items.push(product);
        this.render();
    }

    removeItem(index) {
        this._items.splice(index, 1);
        this.render();
    }

    get total() {
        return this._items.reduce((sum, item) => sum + item.price, 0);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 320px;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    padding: 20px;
                }

                h2 {
                    margin: 0 0 16px 0;
                    font-size: 20px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .cart-icon {
                    font-size: 24px;
                }

                .empty {
                    color: #888;
                    font-style: italic;
                    text-align: center;
                    padding: 20px 0;
                }

                .items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }

                .item-info {
                    flex: 1;
                }

                .item-name {
                    font-weight: 500;
                    color: #333;
                    margin-bottom: 4px;
                }

                .item-details {
                    font-size: 12px;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }

                .item-color {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 1px solid #ccc;
                    display: inline-block;
                }

                .item-size {
                    background: #e0e0e0;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 11px;
                }

                .item-price {
                    font-size: 14px;
                    color: #2e7d32;
                    font-weight: 600;
                }

                .remove-btn {
                    background: #e53935;
                    color: white;
                    border: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                    margin-left: 10px;
                }

                .remove-btn:hover {
                    background: #c62828;
                }

                .total {
                    border-top: 2px solid #eee;
                    padding-top: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .total-label {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }

                .total-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1976d2;
                }
            </style>

            <h2><span class="cart-icon">🛒</span> Koszyk</h2>

            ${this._items.length === 0 ? `
                <div class="empty">Koszyk jest pusty</div>
            ` : `
                <div class="items">
                    ${this._items.map((item, index) => `
                        <div class="item">
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                                <div class="item-details">
                                    ${item.selectedColor ? `<span class="item-color" style="background: ${item.selectedColor};"></span>` : ''}
                                    ${item.selectedSize ? `<span class="item-size">${item.selectedSize}</span>` : ''}
                                </div>
                                <div class="item-price">${item.price} zł</div>
                            </div>
                            <button class="remove-btn" data-index="${index}">✕</button>
                        </div>
                    `).join('')}
                </div>

                <div class="total">
                    <span class="total-label">Suma:</span>
                    <span class="total-value">${this.total} zł</span>
                </div>
            `}
        `;

        this.shadowRoot.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeItem(index);
            });
        });
    }
}

customElements.define('shopping-cart', ShoppingCart);
