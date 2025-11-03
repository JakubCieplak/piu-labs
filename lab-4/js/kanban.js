class KanbanBoard {
  constructor() {
    this.columns = ["todo", "inprogress", "done"];
    this.cards = this.loadFromLocalStorage();
    this.availableColors = [
      "#fbbf24",
      "#fb923c",
      "#f472b6",
      "#a78bfa",
      "#60a5fa",
      "#34d399",
      "#fca5a5",
      "#fdba74",
      "#c084fc",
      "#38bdf8",
    ];
    this.activeColorPicker = null;
    this.init();
  }

  init() {
    this.renderAllCards();
    this.attachEventListeners();
    this.updateAllCounters();
    this.createColorPicker();
  }

  generateId() {
    return (
      "card_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11)
    );
  }

  getRandomColor() {
    return this.availableColors[
      Math.floor(Math.random() * this.availableColors.length)
    ];
  }

  createColorPicker() {
    const picker = document.createElement("div");
    picker.className = "color-picker";
    picker.id = "colorPicker";

    const title = document.createElement("div");
    title.className = "color-picker-title";
    title.textContent = "Wybierz kolor";

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "color-options";

    this.availableColors.forEach((color) => {
      const option = document.createElement("div");
      option.className = "color-option";
      option.style.backgroundColor = color;
      option.dataset.color = color;
      optionsContainer.appendChild(option);
    });

    picker.appendChild(title);
    picker.appendChild(optionsContainer);
    document.body.appendChild(picker);

    document.addEventListener("click", (e) => {
      if (
        !picker.contains(e.target) &&
        !e.target.classList.contains("color-card-btn") &&
        !e.target.classList.contains("color-column-btn")
      ) {
        this.hideColorPicker();
      }
    });

    optionsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("color-option")) {
        const selectedColor = e.target.dataset.color;
        if (this.activeColorPicker) {
          this.activeColorPicker.callback(selectedColor);
          this.hideColorPicker();
        }
      }
    });
  }

  showColorPicker(x, y, callback, currentColor = null) {
    const picker = document.getElementById("colorPicker");
    picker.classList.add("active");

    picker.style.left = x + "px";
    picker.style.top = y + "px";

    const options = picker.querySelectorAll(".color-option");
    options.forEach((option) => {
      option.classList.remove("selected");
      if (currentColor && option.dataset.color === currentColor) {
        option.classList.add("selected");
      }
    });

    this.activeColorPicker = { callback };
  }

  hideColorPicker() {
    const picker = document.getElementById("colorPicker");
    picker.classList.remove("active");
    this.activeColorPicker = null;
  }

  createCardElement(cardData) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;
    card.style.backgroundColor = cardData.color;

    const isFirstColumn = cardData.column === "todo";
    const isLastColumn = cardData.column === "done";

    const columnCards = this.cards.filter((c) => c.column === cardData.column);
    const cardIndex = columnCards.findIndex((c) => c.id === cardData.id);
    const isFirstInColumn = cardIndex === 0;
    const isLastInColumn = cardIndex === columnCards.length - 1;

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title" contenteditable="true">${
          cardData.title || ""
        }</div>
        <button class="delete-btn">×</button>
      </div>
      <div class="card-content">
        <div class="card-text" contenteditable="true">${
          cardData.text || ""
        }</div>
      </div>
      <div class="card-actions">
        <button class="move-up-btn" ${
          isFirstInColumn ? "disabled" : ""
        }>↑</button>
        <button class="move-down-btn" ${
          isLastInColumn ? "disabled" : ""
        }>↓</button>
        <button class="move-left-btn" ${
          isFirstColumn ? "disabled" : ""
        }>←</button>
        <button class="color-card-btn">🎨</button>
        <button class="move-right-btn" ${
          isLastColumn ? "disabled" : ""
        }>→</button>
      </div>
    `;

    return card;
  }

  addCard(columnName) {
    const cardData = {
      id: this.generateId(),
      column: columnName,
      title: "Nowa karta",
      text: "",
      color: this.getRandomColor(),
    };

    this.cards.push(cardData);
    this.renderCard(cardData);
    this.updateCounter(columnName);
    this.saveToLocalStorage();
  }

  renderCard(cardData) {
    const column = document.querySelector(`[data-column="${cardData.column}"]`);
    const container = column.querySelector(".cards-container");
    const cardElement = this.createCardElement(cardData);
    container.appendChild(cardElement);
  }

  renderAllCards() {
    document.querySelectorAll(".cards-container").forEach((container) => {
      container.innerHTML = "";
    });

    this.cards.forEach((cardData) => {
      this.renderCard(cardData);
    });
  }

  deleteCard(cardId) {
    const cardIndex = this.cards.findIndex((card) => card.id === cardId);
    if (cardIndex > -1) {
      const columnName = this.cards[cardIndex].column;
      this.cards.splice(cardIndex, 1);

      const cardElement = document.querySelector(`[data-id="${cardId}"]`);
      if (cardElement) {
        cardElement.remove();
      }

      this.updateCounter(columnName);
      this.saveToLocalStorage();
    }
  }

  moveCard(cardId, direction) {
    const cardData = this.cards.find((card) => card.id === cardId);
    if (!cardData) return;

    const currentIndex = this.columns.indexOf(cardData.column);
    let newIndex;

    if (direction === "left") {
      newIndex = currentIndex - 1;
    } else {
      newIndex = currentIndex + 1;
    }

    if (newIndex >= 0 && newIndex < this.columns.length) {
      const oldColumn = cardData.column;
      cardData.column = this.columns[newIndex];

      this.renderAllCards();
      this.updateCounter(oldColumn);
      this.updateCounter(cardData.column);
      this.saveToLocalStorage();
    }
  }

  updateCardContent(cardId, field, value) {
    const cardData = this.cards.find((card) => card.id === cardId);
    if (cardData) {
      cardData[field] = value;
      this.saveToLocalStorage();
    }
  }

  colorCard(cardId, buttonElement) {
    const cardData = this.cards.find((card) => card.id === cardId);
    if (cardData) {
      const rect = buttonElement.getBoundingClientRect();
      const x = rect.left;
      const y = rect.bottom + 5;

      this.showColorPicker(
        x,
        y,
        (selectedColor) => {
          cardData.color = selectedColor;
          const cardElement = document.querySelector(`[data-id="${cardId}"]`);
          if (cardElement) {
            cardElement.style.backgroundColor = selectedColor;
          }
          this.saveToLocalStorage();
        },
        cardData.color
      );
    }
  }

  colorColumn(columnName, buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    const x = rect.left;
    const y = rect.bottom + 5;

    this.showColorPicker(x, y, (selectedColor) => {
      const columnCards = this.cards.filter(
        (card) => card.column === columnName
      );

      columnCards.forEach((cardData) => {
        cardData.color = selectedColor;
        const cardElement = document.querySelector(
          `[data-id="${cardData.id}"]`
        );
        if (cardElement) {
          cardElement.style.backgroundColor = selectedColor;
        }
      });

      this.saveToLocalStorage();
    });
  }

  moveCardUp(cardId) {
    const cardIndex = this.cards.findIndex((card) => card.id === cardId);
    if (cardIndex <= 0) return;

    const card = this.cards[cardIndex];
    const columnCards = this.cards.filter((c) => c.column === card.column);
    const cardIndexInColumn = columnCards.findIndex((c) => c.id === cardId);

    if (cardIndexInColumn === 0) return;

    const previousCard = columnCards[cardIndexInColumn - 1];
    const previousCardIndex = this.cards.findIndex(
      (c) => c.id === previousCard.id
    );

    [this.cards[cardIndex], this.cards[previousCardIndex]] = [
      this.cards[previousCardIndex],
      this.cards[cardIndex],
    ];

    this.renderAllCards();
    this.saveToLocalStorage();
  }

  moveCardDown(cardId) {
    const cardIndex = this.cards.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) return;

    const card = this.cards[cardIndex];
    const columnCards = this.cards.filter((c) => c.column === card.column);
    const cardIndexInColumn = columnCards.findIndex((c) => c.id === cardId);

    if (cardIndexInColumn === columnCards.length - 1) return;

    const nextCard = columnCards[cardIndexInColumn + 1];
    const nextCardIndex = this.cards.findIndex((c) => c.id === nextCard.id);

    [this.cards[cardIndex], this.cards[nextCardIndex]] = [
      this.cards[nextCardIndex],
      this.cards[cardIndex],
    ];

    this.renderAllCards();
    this.saveToLocalStorage();
  }

  updateCounter(columnName) {
    const column = document.querySelector(`[data-column="${columnName}"]`);
    const counter = column.querySelector(".card-counter");
    const count = this.cards.filter(
      (card) => card.column === columnName
    ).length;
    counter.textContent = count;
  }

  updateAllCounters() {
    this.columns.forEach((columnName) => {
      this.updateCounter(columnName);
    });
  }

  saveToLocalStorage() {
    localStorage.setItem("kanbanCards", JSON.stringify(this.cards));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem("kanbanCards");
    return saved ? JSON.parse(saved) : [];
  }

  attachEventListeners() {
    document.querySelectorAll(".column").forEach((column) => {
      const columnName = column.dataset.column;

      column.querySelector(".add-card-btn").addEventListener("click", () => {
        this.addCard(columnName);
      });

      column
        .querySelector(".color-column-btn")
        .addEventListener("click", (e) => {
          this.colorColumn(columnName, e.target);
        });

      const container = column.querySelector(".cards-container");

      container.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;

        const cardId = card.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
          this.deleteCard(cardId);
        }

        if (e.target.classList.contains("move-up-btn")) {
          this.moveCardUp(cardId);
        }

        if (e.target.classList.contains("move-down-btn")) {
          this.moveCardDown(cardId);
        }

        if (e.target.classList.contains("move-left-btn")) {
          this.moveCard(cardId, "left");
        }

        if (e.target.classList.contains("move-right-btn")) {
          this.moveCard(cardId, "right");
        }

        if (e.target.classList.contains("color-card-btn")) {
          this.colorCard(cardId, e.target);
        }
      });

      container.addEventListener(
        "blur",
        (e) => {
          const card = e.target.closest(".card");
          if (!card) return;

          const cardId = card.dataset.id;

          if (e.target.classList.contains("card-title")) {
            this.updateCardContent(cardId, "title", e.target.textContent);
          }

          if (e.target.classList.contains("card-text")) {
            this.updateCardContent(cardId, "text", e.target.textContent);
          }
        },
        true
      );

      container.addEventListener("keydown", (e) => {
        if (e.target.classList.contains("card-title") && e.key === "Enter") {
          e.preventDefault();
          e.target.blur();
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new KanbanBoard();
});
