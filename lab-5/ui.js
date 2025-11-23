import { store } from './store.js';
import { getRandomColor } from './helpers.js';

let shapesContainer;
let counters;
let previousState = { shapes: [] };

export function init() {
  shapesContainer = document.getElementById('shapes-container');
  counters = {
    circle: document.getElementById('circle-count'),
    square: document.getElementById('square-count'),
    total: document.getElementById('total-count')
  };

  setupEventListeners();
  store.subscribe(onStateChange);

  onStateChange(store.getState());
}

function setupEventListeners() {
  document.getElementById('add-circle').addEventListener('click', () => {
    store.addShape('circle', getRandomColor());
  });

  document.getElementById('add-square').addEventListener('click', () => {
    store.addShape('square', getRandomColor());
  });

  document.getElementById('recolor-circles').addEventListener('click', () => {
    store.changeShapeColor('circle', getRandomColor());
  });

  document.getElementById('recolor-squares').addEventListener('click', () => {
    store.changeShapeColor('square', getRandomColor());
  });

  shapesContainer.addEventListener('click', (e) => {
    const shape = e.target.closest('.shape');
    if (shape) {
      const shapeId = shape.dataset.id;
      store.removeShape(shapeId);
    }
  });
}

function onStateChange(state) {
  updateShapes(state);
  updateCounters();
  previousState = JSON.parse(JSON.stringify(state));
}

function updateShapes(state) {
  const currentIds = new Set(state.shapes.map(s => s.id));
  const previousIds = new Set(previousState.shapes.map(s => s.id));

  previousState.shapes.forEach(shape => {
    if (!currentIds.has(shape.id)) {
      const element = shapesContainer.querySelector(`[data-id="${shape.id}"]`);
      if (element) {
        element.remove();
      }
    }
  });

  state.shapes.forEach((shape, index) => {
    let element = shapesContainer.querySelector(`[data-id="${shape.id}"]`);

    if (!element) {
      element = createShapeElement(shape);
      shapesContainer.appendChild(element);
    } else {
      const previousShape = previousState.shapes.find(s => s.id === shape.id);
      if (previousShape && previousShape.color !== shape.color) {
        element.style.backgroundColor = shape.color;
      }
    }
  });
}

function createShapeElement(shape) {
  const div = document.createElement('div');
  div.className = `shape shape-${shape.type}`;
  div.dataset.id = shape.id;
  div.style.backgroundColor = shape.color;
  div.title = 'Kliknij, aby usunąć';
  return div;
}

function updateCounters() {
  const counts = store.getCounts();
  counters.circle.textContent = counts.circle;
  counters.square.textContent = counts.square;
  counters.total.textContent = counts.total;
}
