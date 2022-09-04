///////
// const img = new Image();
// img.onload = function () {
//   context.drawImage(
//     img,
//     canvas.width / 2 - img.width / 2,
//     canvas.height / 2 - img.height / 2
//   );
// };

// //TODO: set img.src to your api url instead of the dummyimage url.
// img.src = `https://dummyimage.com/60x60/000/fff&text=${0},${0}`;

import { Renderer, canvas, context, ctx } from './canvas.js';
import { AllItems } from './items.js';
import Civilization from './civilization.js';
import { ShipTick, Ship, PioneerShip } from './ship.js';

export const AllSectors = {};
const Civilizations = {};
const PersonIndex = 0;
const CellSize = 25;
let ZoomScale = 1;

let test = {};

const PlanetType = {
  Terrestrial: {
    name: 'Terrestrial Planet',
    iconColor: '#08f000',
    PossibleProductions: ['Vegetable', 'Fruit', 'Livestock', 'Fish'],
  },
  Silicate: { name: 'Silicate Planet', iconColor: '#0f8200' },
  Puffy: { name: 'Puffy Planet', iconColor: '#fcba03' },
  Protoplanet: { name: 'Protoplanet Planet', iconColor: '#fcba03' },
  //Ocean: { name: 'Ocean Planet', iconColor: '#fcba03' },
  Lava: { name: 'Lava Planet', iconColor: '#ff0d00' },
  Iron: { name: 'Iron Planet', iconColor: '#ab6400' },
  IcePlanet: { name: 'Ice Planet', iconColor: '#0099ff' },
  Helium: { name: 'Helium Planet', iconColor: '#8d02de' },
  Desert: { name: 'Desert Planet', iconColor: '#ffaa80' },
  Coreless: { name: 'Coreless Planet', iconColor: '#919191' },
  Carbon: { name: 'Carbon Planet', iconColor: '#636363' },
  Chthonian: { name: 'Chthonian Planet', iconColor: '#fcba03' },
};

function randomNumberInRange(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Planet {
  constructor() {
    this.sector = undefined;
    this.type = PlanetType.Desert;
    this.civilizationPresent = undefined;
    this.population = 0;
  }

  init() {
    this.GeneratePlanet();
  }

  setSector = (sector) => {
    this.sector = sector;
  };

  setCivilization = (civilization) => {
    console.log(civilization);
    this.civilizationPresent = civilization;
    console.log(
      `Civilization ${civilization.Name} found on ${this.sector.x}, ${this.sector.y}`
    );

    debugLog(`Civilization ${civilization.Name} found on ${this.sector.x}, ${this.sector.y}`)
  };

  GeneratePlanet() {
    // Good heat difference from sun
    if (this.sector.SunDistance > 1 && this.sector.SunDistance < 5) {
      this.type = PlanetType.Lava;
    }

    // Good heat difference from sun
    if (this.sector.SunDistance > 9 && this.sector.SunDistance < 12) {
      const r = randomNumberInRange(1, 10);
      this.type = PlanetType.Carbon;

      if (r <= 8) {
        this.type = PlanetType.Terrestrial;
      }

      if (r <= 2) {
        this.type = PlanetType.Silicate;
      }
    }

    if (this.sector.SunDistance > 20) {
      this.type = PlanetType.Iron;
    }

    if (this.sector.SunDistance > 4 && this.sector.SunDistance < 18) {
      if (randomNumberInRange(1, 100) < 9) this.type = PlanetType.Helium;
    }

    //console.log(`Planet Type: ${this.type.name} ${this.type.iconColor}`);
  }
}

class Sector {
  constructor(x = 0, y = 0, spreads = true) {
    this.x = x;
    this.y = y;
    this.spreads;
    this.neighbors = {};
    this.SunDistance = Infinity;
    this.Planet = undefined;
    this.Ship = undefined;
    this.OriginSector = undefined;

    AllSectors[`${this.x},${this.y}`] = this;

    if (test[`${this.x},${this.y}`] == undefined) {
      test[`${this.x},${this.y}`] = this;
      //console.log("added to test");
    } else {
      console.log('BUT HOW');
    }
    this.init();
  }

  init() {
    var a = 0 - this.x;
    var b = 0 - this.y;

    this.SunDistance = Math.sqrt(a * a + b * b);

    const r = randomNumberInRange(0, 1000);

    if (r <= 900) {
      this.Planet = new Planet();
      this.Planet.setSector(this);
      this.Planet.init();
    }

    //console.log(`Sun Distance: ${this.SunDistance}`);
    this.draw();
  }

  getScreenCoord() {
    return {
      x:
        (canvas.width / (2 * ZoomScale) - CellSize + CellSize * this.x) *
        ZoomScale,
      y:
        (canvas.height / (2 * ZoomScale) - CellSize + CellSize * this.y) *
        ZoomScale,
    };
  }

  removeShip() {
    this.Ship = undefined;
    this.redraw();
  }

  setShip(ship) {
    this.Ship = ship;
    this.redraw();
  }

  redraw() {
    //const screenCoords = this.getScreenCoord();

    // Clear cell. Including the border
    ctx.clearRect(
      (canvas.width / (2 * ZoomScale) - CellSize + CellSize * this.x) *
        ZoomScale,
      (canvas.height / (2 * ZoomScale) - CellSize + CellSize * this.y) *
        ZoomScale,
      CellSize * ZoomScale,
      CellSize * ZoomScale
    );

    //Draw lack Background
    context.fillStyle = 'black';
    context.fillRect(
      (canvas.width / (2 * ZoomScale) - CellSize + CellSize * this.x) *
        ZoomScale,
      (canvas.height / (2 * ZoomScale) - CellSize + CellSize * this.y) *
        ZoomScale,
      CellSize * ZoomScale,
      CellSize * ZoomScale
    );

    this.draw();
  }

  draw() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    //context.strokeStyle = `#${randomColor}`;
    ctx.strokeRect(
      (canvas.width / (2 * ZoomScale) - CellSize + CellSize * this.x) *
        ZoomScale,
      (canvas.height / (2 * ZoomScale) - CellSize + CellSize * this.y) *
        ZoomScale,
      CellSize * ZoomScale,
      CellSize * ZoomScale
    );

    const screenCoords = this.getScreenCoord();

    // Draw Sector Coord Text
    // context.fillStyle = 'white';
    // context.font = '10px Arial';
    // context.fillText(
    //   `[${this.x},${this.y}]`,
    //   screenCoords.x,
    //   screenCoords.y + 8
    // );

    // Draw sun at 0, 0 sector only
    if (this.x == 0 && this.y == 0) {
      context.fillStyle = '#fcba03';

      ctx.fillRect(
        screenCoords.x + 5,
        screenCoords.y + 5,
        (CellSize - 10) * ZoomScale,
        (CellSize - 10) * ZoomScale
      );
    }

    if (this.Planet != undefined && this.Planet.type != undefined) {
      this.drawPlanetIcon();
    }

    if (this.Ship != undefined) {
      this.drawShipIcon();
    }
  }

  drawShipIcon() {
    context.fillStyle = `#fff`;
    const screenCoords = this.getScreenCoord();

    ctx.fillRect(
      screenCoords.x + 5,
      screenCoords.y + 5,
      15 * ZoomScale,
      15 * ZoomScale
    );
  }

  drawPlanetIcon() {
    const PlanetIconSize = 3;

    context.fillStyle = `${this.Planet.type.iconColor}`;

    const screenCoords = this.getScreenCoord();

    ctx.fillRect(
      screenCoords.x + 2,
      screenCoords.y + 2,
      PlanetIconSize * ZoomScale,
      PlanetIconSize * ZoomScale
    );

    // ctx.fillRect(
    //   screenCoords.x + 0,
    //   screenCoords.y + 0,
    //   25 * ZoomScale,
    //   25 * ZoomScale
    // );
  }

  setOriginSector(sector) {
    this.OriginSector = sector;

    const screenCoords = this.getScreenCoord();
    const otherSectorCoords = sector.getScreenCoord();

    // ctx.beginPath();
    // ctx.moveTo(screenCoords.x, screenCoords.y);
    // ctx.lineTo(otherSectorCoords.x, otherSectorCoords.y);
    // ctx.stroke();
  }

  getRandomNeighborSector(x, y) {
    const moveables = [-1, 0, 1];
    const randomX = moveables[Math.floor(Math.random() * moveables.length)];
    const randomY = moveables[Math.floor(Math.random() * moveables.length)];
    const newX = x + randomX;
    const newY = y + randomY;

    return { x: newX, y: newY };
  }

  spread() {
    if (Object.keys(this.neighbors).length == 3) return;

    let neighbor = this.getRandomNeighborSector(this.x, this.y);

    if (neighbor.x == 0 && neighbor.y == 0) return;

    let newSector = undefined;

    // If there isn't a sector already present, create one.
    if (AllSectors[`${neighbor.x},${neighbor.y}`] == undefined) {
      newSector = new Sector(neighbor.x, neighbor.y);

      this.neighbors[`${neighbor.x},${neighbor.y}`] = newSector;
      newSector.setOriginSector(this);

      //console.log(`[${this.x},${this.y}] created [${newX},${newY}]`);
    }
  }
}

class Person {
  constructor({ civilization }) {
    this.id = -1;
    this.sex = this.generateSex();
    this.age = 0;
    this.civilization = civilization;
  }

  generateSex() {
    const sexes = ['MALE', 'FAMELE'];
    return moveables[Math.floor(Math.random() * sexes.length)];
  }

  agePerson() {
    this.age++;
  }

  setGender(sex) {
    this.sex = sex;
  }
}

var digrams =
  'ABOUSEITILETSTONLONUTHNO' +
  '..LEXEGEZACEBISOUSESARMAINDIREA.ERATENBERALAVETIEDORQUANTEISRION';

function rotatel(x) {
  var tmp = (x & 255) * 2;
  if (tmp > 255) tmp -= 255;
  return tmp;
}

function twist(x) {
  return 256 * rotatel(x / 256) + rotatel(x & 255);
}

function next(seeds) {
  return seeds.map(function (seed) {
    return twist(seed);
  });
}

function tweakseed(seeds) {
  var tmp;

  tmp = seeds.reduce(function (total, seed) {
    return (total += seed);
  }, 0);

  return seeds.map(function (seed, index, arr) {
    return arr[index + 1] || tmp & 65535;
  });
}

function makename(pairs, seeds) {
  var name = [];
  /* Modify pair if you want to have names shorter or longer than 8 chars */
  /* I'll leave that as an exercise for you. */
  var pair = [0, 0, 0, 0];
  var longname = seeds[0] & 64;

  pair = pair.map(function () {
    seeds = tweakseed(seeds);
    return 2 * ((seeds[2] / 256) & 31);
  });

  pair.forEach(function (value, index, arr) {
    if (longname || index < arr.length - 1) {
      name.push(pairs[value]);
      name.push(pairs[value + 1]);
    }
  });

  return name
    .join('')
    .toLowerCase()
    .replace(/^\w/, function (letter) {
      return letter.toUpperCase();
    });
}

function genNames() {
  var names = [];
  var pairs;
  var num = 256;
  var seeds = [23114, 584, 46931];
  pairs = digrams.substring(24);

  while (--num) {
    names.push(makename(pairs, seeds));
    seeds = tweakseed(next(seeds));
  }

  return names;
}

export function debugLog(str) {
  const textarea = document.getElementById('debugLog');

  textarea.value = str + '\r\n' + textarea.value;
}

export default function init() {
  //setupCanvas();

  new Sector();
  let spreadCount = 0;

  let spreader = setInterval(() => {
    for (const [key, sector] of Object.entries(AllSectors)) {
      sector.spread();
    }

    spreadCount++;
    if (spreadCount >= 45) {
      clearInterval(spreader);
    }
  }, 100);

  const Pizzians = new Civilization({ Name: 'Pizzians' });
  let pioneer = new PioneerShip(Pizzians);

  pioneer.setSector(AllSectors['0,0']);

  let shipTicker = setInterval(() => {
    ShipTick(context, ctx, ZoomScale);
  }, 100);
}

//console.log(genNames());

//init();
