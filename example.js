(function ($) {
  /***************************************************************************
   * Canvas rendering class
   **************************************************************************/

  var Renderer = function (canvas, width, height) {
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

  /***************************************************************************
   * Map container class
   **************************************************************************/

  var Map = function () {
    var self = this;

    this.ready = false;
    this.tilesheetReady = false;
    this.mapReady = false;

    this.readyFunction = function () {};
    this.map = null;
    this.tilesheet = new Image();

    this.tilesheet.onload = function () {
      self.tilesheetReady = true;
      self.checkReady();
    };
  };

  Map.prototype.onReady = function (callback) {
    this.readyFunction = callback;
  };

  Map.prototype.setMap = function (map) {
    this.ready = false;
    this.mapReady = false;
    this.loadMap(map);
  };

  Map.prototype.setTilesheet = function (filepath) {
    this.ready = false;
    this.tilesheetReady = false;
    this.tilesheet.src = filepath;
  };

  Map.prototype.checkReady = function () {
    if (this.tilesheetReady === true && this.mapReady === true) {
      this.ready = true;
      this.readyFunction();
    }
  };

  Map.prototype.loadMap = function (map) {
    this.layers = map.layers;
    this.collisions = map.collisions;
    this.doors = map.doors;
    this.mapReady = true;
    this.checkReady();
  };

  /***************************************************************************
   * Main sequence
   **************************************************************************/

  var mapdata = {
    layers: [
      [
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [672, 0],
          [32, 0],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [608, 32],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
      ],
      [
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
        [
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
          [32, 0],
        ],
      ],
    ],
    collisions: [],
    doors: [],
  };

  // Use the correct document according to the window argument
  var document = $.document;
  var status = 0;

  // Extract the canvas we want to use
  var canvas = document.getElementById('entities');

  // Instantiate objects
  var renderer = new Renderer(canvas, $.innerWidth, $.innerHeight);
  var map = new Map();

  map.onReady(function () {
    renderer.renderMap(map.layers, map.tilesheet);
  });

  map.setMap(mapdata);
  map.setTilesheet(
    'http://i4.photobucket.com/albums/y118/rpg_man/GSCTileset32x32.png'
  );

  $.addEventListener('resize', function () {
    renderer.resize($.innerWidth, $.innerHeight);
  });

  var lastX = 0;
  var lastY = 0;

  canvas.addEventListener('mousemove', function (e) {
    var x = (e.pageX / renderer.tilesize) | 0;
    var y = (e.pageY / renderer.tilesize) | 0;

    if (lastX == x && lastY == y) {
      return;
    }

    if (map.ready) {
      renderer.renderTileAt(map.layers, map.tilesheet, lastY, lastX);
    }

    renderer.drawHoverRect('red', x * renderer.tilesize, y * renderer.tilesize);

    lastX = x;
    lastY = y;
  });

  renderer.onresize = function () {
    if (map.ready) {
      renderer.renderMap(map.layers, map.tilesheet);
    }
  };
})(window);
