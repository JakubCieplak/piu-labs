const STORAGE_KEY = 'shapes-app-state';

class Store {
  constructor() {
    this.subscribers = [];
    this.state = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { shapes: [] };
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return { shapes: [] };
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    this.saveToStorage();
    this.subscribers.forEach(callback => callback(this.state));
  }

  getState() {
    return this.state;
  }

  addShape(type, color) {
    const shape = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      color
    };
    this.state.shapes.push(shape);
    this.notify();
  }

  removeShape(id) {
    this.state.shapes = this.state.shapes.filter(shape => shape.id !== id);
    this.notify();
  }

  changeShapeColor(type, newColor) {
    this.state.shapes = this.state.shapes.map(shape =>
      shape.type === type ? { ...shape, color: newColor } : shape
    );
    this.notify();
  }

  getCounts() {
    const counts = {
      circle: 0,
      square: 0,
      total: this.state.shapes.length
    };

    this.state.shapes.forEach(shape => {
      if (shape.type === 'circle') counts.circle++;
      if (shape.type === 'square') counts.square++;
    });

    return counts;
  }
}

export const store = new Store();
