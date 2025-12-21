class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._product = null;
        this._selectedColor = null;
        this._selectedSize = null;
    }

    static get observedAttributes() {
        return ['name', 'price', 'image', 'colors', 'sizes', 'promo'];
    }

    connectedCallback() {
        if (!this._product) {
            this.updateProductFromAttributes();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateProductFromAttributes();
        }
    }

    set product(value) {
        this._product = value;
        this._selectedColor = value.colors?.[0] || null;
        this._selectedSize = value.sizes?.[0] || null;
        this.render();
    }

    get product() {
        return this._product;
    }

    selectColor(color) {
        this._selectedColor = color;
        this.updateSelection();
    }

    selectSize(size) {
        this._selectedSize = size;
        this.updateSelection();
    }

    updateSelection() {
        this.shadowRoot.querySelectorAll('.color-dot').forEach(dot => {
            dot.classList.toggle('selected', dot.dataset.color === this._selectedColor);
        });
        this.shadowRoot.querySelectorAll('.size-badge').forEach(badge => {
            badge.classList.toggle('selected', badge.dataset.size === this._selectedSize);
        });
    }

    render() {
        if (!this._product) return;

        const { name, price, image, colors, sizes, promo } = this._product;

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

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .promo-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
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

                .name {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }

                .price {
                    font-size: 22px;
                    font-weight: 700;
                    color: #2e7d32;
                    margin-bottom: 12px;
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

                .color-list, .size-list {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-top: 6px;
                }

                .color-dot {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 2px solid #ddd;
                    cursor: pointer;
                    transition: transform 0.15s, border-color 0.15s;
                }

                .color-dot:hover {
                    transform: scale(1.1);
                }

                .color-dot.selected {
                    border-color: #1976d2;
                    box-shadow: 0 0 0 2px #1976d2;
                }

                .size-badge {
                    padding: 6px 12px;
                    background: #f5f5f5;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                }

                .size-badge:hover {
                    background: #e3f2fd;
                    border-color: #90caf9;
                }

                .size-badge.selected {
                    background: #1976d2;
                    color: white;
                    border-color: #1976d2;
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
                <img src="${image}" alt="${name}">
                ${promo ? `<div class="promo-badge">${promo}</div>` : ''}
            </div>

            <div class="content">
                <h2 class="name">${name}</h2>
                <div class="price">${price} zł</div>

                <div class="options">
                    ${colors && colors.length ? `
                        <div class="option-group">
                            <div class="option-label">Kolor:</div>
                            <div class="color-list">
                                ${colors.map((c, i) => `
                                    <span class="color-dot ${i === 0 ? 'selected' : ''}"
                                          style="background: ${c};"
                                          data-color="${c}"></span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${sizes && sizes.length ? `
                        <div class="option-group">
                            <div class="option-label">Rozmiar:</div>
                            <div class="size-list">
                                ${sizes.map((s, i) => `
                                    <span class="size-badge ${i === 0 ? 'selected' : ''}"
                                          data-size="${s}">${s}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <button class="add-to-cart">Do koszyka</button>
            </div>
        `;

        this.shadowRoot.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => this.selectColor(dot.dataset.color));
        });

        this.shadowRoot.querySelectorAll('.size-badge').forEach(badge => {
            badge.addEventListener('click', () => this.selectSize(badge.dataset.size));
        });

        this.shadowRoot.querySelector('.add-to-cart').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('add-to-cart', {
                detail: {
                    ...this._product,
                    selectedColor: this._selectedColor,
                    selectedSize: this._selectedSize
                },
                bubbles: true,
                composed: true
            }));
        });
    }

    updateProductFromAttributes() {
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');
        const image = this.getAttribute('image');
        const promo = this.getAttribute('promo');
        const colors = this.parseListAttribute(this.getAttribute('colors'));
        const sizes = this.parseListAttribute(this.getAttribute('sizes'));

        if (!name && !price && !image && !colors.length && !sizes.length && !promo) {
            return;
        }

        const parsedPrice = price ? parseFloat(price) : 0;

        this.product = {
            name: name || '',
            price: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
            image: image || '',
            colors,
            sizes,
            promo: promo || null
        };
    }

    parseListAttribute(value) {
        if (!value) return [];
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // fall through to comma split
        }
        return value.split(',').map(item => item.trim()).filter(Boolean);
    }
}

customElements.define('product-card', ProductCard);
