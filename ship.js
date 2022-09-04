export let AllShips = {};
export let AllPioneerShips = [];

import { AllSectors } from './script.js';

let ShipID = 0;

export class Ship {
  constructor(civilization) {
    this.ID = ShipID;
    this.currentSector = undefined;
    this.Civilization = civilization;
    ShipID++;

    AllShips[this.ID] = this;
    console.log(
      `Ship created with ship id ${this.ID}. Civ: ${this.Civilization}`
    );

    console.log(this.Civilization);
  }

  setSector(sector) {
    if (this.currentSector != undefined) {
      this.currentSector.removeShip();
      this.currentSector.redraw();
    }

    this.currentSector = sector;
    sector.setShip(this);
    sector.redraw();

    this.visitedSectors[`${sector.x},${sector.y}`] = true
  }
  tick() {}
}

export class PioneerShip extends Ship {
  constructor(civilization) {
    super(civilization);
    this.visitedSectors = {};

    AllPioneerShips[this.ID] = this;
  }

  tick() {
    super.tick();

    this.searchForHome();
  }

  deleteSelf() {
    this.currentSector.removeShip();

    const index = AllPioneerShips.indexOf(this);
    if (index > -1) {
      // only splice array when item is found
      AllPioneerShips.splice(index, 1); // 2nd parameter means remove one item only
    }

    // array = [2, 9]
    console.log(AllPioneerShips);
  }

  searchForHome() {
    let neighbor = this.currentSector.getRandomNeighborSector(
      this.currentSector.x,
      this.currentSector.y
    );

    if (AllSectors[`${neighbor.x},${neighbor.y}`] != undefined && this.visitedSectors[`${neighbor.x},${neighbor.y}`] == undefined) {
      this.setSector(AllSectors[`${neighbor.x},${neighbor.y}`]);

      // Check if the planet is Terrestrial.
      if (this.currentSector.Planet?.type.name == 'Terrestrial Planet') {
        // Check if there is currently a Civilization
        if (this.currentSector.Planet.civilizationPresent == undefined) {
          // Set the planets new civilization
          this.currentSector.Planet.setCivilization(this.Civilization);

          // Delete this pioneer ship
          this.deleteSelf();
        }
      }
    }
  }
}

export function ShipTick(context, ctx, ZoomScale) {
  AllPioneerShips.forEach((ship) => {
    //ship.clearShipIcon(context, ctx, ZoomScale);
    ship.tick();
    //ship.drawShipIcon(context, ctx, ZoomScale);
  });
}
