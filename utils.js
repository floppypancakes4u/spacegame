export function getRandomNeighborSector(x, y) {
  const moveables = [-1, 0, 1];
  const randomX = moveables[Math.floor(Math.random() * moveables.length)];
  const randomY = moveables[Math.floor(Math.random() * moveables.length)];
  const newX = this.x + randomX;
  const newY = this.y + randomY;
}
