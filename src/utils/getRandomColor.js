export function getRandomColor() {
  const colors = [
    "#1976d2",
    "#388e3c",
    "#d32f2f",
    "#7b1fa2",
    "#1976d2",
    "#c2185b",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
