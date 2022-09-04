// setup state
const state = {
  __arr: [],
  __width: 30,
  __height: 30,
  __cell: {
    width: 20,
    height: 20,
  },
  __onUpdate: () => {},
  __calcIndex(x, y) {
    const index = x + y * this.__width;
    if (index >= this.__arr.length || index < 0) {
      throw new Error('Invalid index!');
    }
    return index;
  },
  init(onUpdate) {
    this.__arr = Array(this.__width * this.__height).fill(0);
    this.__onUpdate = onUpdate;
  },
  get(x, y) {
    const index = this.__calcIndex(x, y);
    return this.__arr[index];
  },
  set(x, y, value) {
    const index = this.__calcIndex(x, y);
    this.__arr[index] = value;
    this.__onUpdate();
  },
};

// setup drawing logic
const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d');

const drawFrame = () => {
  const cell = state.__cell;
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'orangered';
  for (let x = 0; x < state.__width; x++) {
    for (let y = 0; y < state.__width; y++) {
      // Draw Grid
      ctx.strokeRect(cell.width * x, cell.height * y, cell.width, cell.height);

      // Check if cell is "highlighted"
      if (state.get(x, y) !== 0) {
        // if "highlighted", fill the rect with a specific color
        ctx.fillRect(
          1 + cell.width * x,
          1 + cell.height * y,
          cell.width - 1,
          cell.height - 1
        );
      }
    }
  }
};

state.init(drawFrame);
canvas.width = state.__width * state.__cell.width;
canvas.height = state.__height * state.__cell.height;
drawFrame();

state.set(2, 4, 1);
state.set(3, 5, 1);
state.set(2, 6, 1);
state.set(7, 4, 1);
