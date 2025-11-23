export function generateId() {
  return `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#FF69B4',
    '#20B2AA', '#FF7F50', '#9370DB', '#3CB371', '#FFB6C1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
