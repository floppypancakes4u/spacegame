export let Renderer = function (canvas, width, height) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.tilesize = 32;
  this.onresize = function () {};

  this.resize(width, height);
};

Renderer.prototype.resize = function (width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
  this.onresize();
};

Renderer.prototype.getWidth = function () {
  return this.canvas.width;
};

Renderer.prototype.getHeight = function () {
  return this.canvas.height;
};

Renderer.prototype.clearRect = function (x, y) {
  this.context.clearRect(x, y, this.tilesize, this.tilesize);
};

Renderer.prototype.drawCellRect = function (color, x, y, width) {
  this.clearRect(x, y);
  this.context.save();
  this.context.lineWidth = 1;
  this.context.strokeStyle = color;
  this.context.strokeRect(
    x + 0.5,
    y + 0.5,
    this.tilesize - 1,
    this.tilesize - 1
  );
  this.context.restore();
};

Renderer.prototype.drawHoverRect = function (color, x, y) {
  this.context.save();
  this.context.lineWidth = 2;
  this.context.strokeStyle = color;
  this.context.translate(x, y);
  this.context.strokeRect(1, 1, this.tilesize - 2, this.tilesize - 2);
  this.context.restore();
};

Renderer.prototype.drawTile = function (image, x, y, sx, sy) {
  this.context.save();
  this.context.clearRect(x, y, this.tilesize, this.tilesize);
  this.context.drawImage(
    image,
    sx,
    sy,
    this.tilesize,
    this.tilesize,
    x,
    y,
    this.tilesize,
    this.tilesize
  );
  this.context.restore();
};

Renderer.prototype.renderTileAt = function (map, tilesheet, i, j) {
  var row = i * this.tilesize;
  var col = j * this.tilesize;
  var drawn = false;

  for (var l = 0; l < map.length; l++) {
    if (map && i in map[l] && j in map[l][i] && map[l][i][j] !== null) {
      this.drawTile(tilesheet, col, row, map[l][i][j][0], map[l][i][j][1]);
      drawn = true;
    }
  }

  if (drawn === false) {
    this.drawCellRect('#111', col, row);
  }
};

Renderer.prototype.renderMap = function (map, tilesheet) {
  for (var i = 0; i < this.getHeight() / this.tilesize; i++) {
    for (var j = 0; j < this.getWidth() / this.tilesize; j++) {
      this.renderTileAt(map, tilesheet, i, j);
    }
  }
};

//canvas.width = 700;
//canvas.height = 700;

//var document = $.document;
var status = 0;

// Extract the canvas we want to use
export let canvas = document.getElementById('canvas');

// Instantiate objects
//var renderer = new Renderer(canvas, $.innerWidth, $.innerHeight);
var renderer = new Renderer(canvas, 700, 700);

export let context = canvas.getContext('2d');
context.fillStyle = 'white';
context.font = '50px Arial';
context.fillText('ASD', 0, 50);
context.globalCompositeOperation = 'destination-over';
//Background
//context.fillStyle = '#00FFFF';

// Draw Black Background
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

context.globalCompositeOperation = 'source-over';
context.lineWidth = 1;
context.strokeStyle = '#fff';
context.strokeRect(0, 0, canvas.width, canvas.height); //for white background

// Renderer.prototype.drawHoverRect = function (color, x, y) {
//   this.context.save();
//   this.context.lineWidth = 2;
//   this.context.strokeStyle = color;
//   this.context.translate(x, y);
//   this.context.strokeRect(1, 1, this.tilesize - 2, this.tilesize - 2);
//   this.context.restore();
// };

// canvas.addEventListener('mousemove', function (e) {
//   var x = (e.pageX / renderer.tilesize) | 0;
//   var y = (e.pageY / renderer.tilesize) | 0;
//   if (lastX == x && lastY == y) return;
//   renderer.renderTileAt(map, sprite, lastY, lastX);
//   renderer.drawHoverRect('red', x * renderer.tilesize, y * renderer.tilesize);
//   lastX = x;
//   lastY = y;
// });

export let ctx = canvas.getContext('2d');
