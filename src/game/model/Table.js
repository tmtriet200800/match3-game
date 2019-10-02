const { def } = require('../Config');
const { NormalTile, SpecialTile, FrenzyTile } = require('../model/Tile');
const { Sprite } = require('pixi.js');
const util = require('../utils/Util');

class Table {
  constructor() {
    this.size = Config.tableSize;
    this.inner = new Array(this.size);

    for (let i = 0; i < this.size; i++) {
      //this.inner[i] = new Array(this.size);
      this.inner[i] = [];
    }
  }

  generateTable() {
    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size; row++) {
        const xPos = util.getXPos(col);
        const yPos = util.getYPos(row);
        let newTile = new NormalTile();
        newTile.setPos(xPos, yPos);
        //this.inner[col].push(newTile);
        //this.inner[col][row] = newTile;
        this.inner[col].push(newTile);
      }
    }
  }

  addRowBottom() {
    for (let col = 0; col < this.size; col++) {
      let newTile = new NormalTile();
      this.inner[col][this.size - 1] = newTile;

      const xPos = util.getXPos(col);
      const yPos = util.getYPos(this.inner[col].length - 1);
      newTile.setPos(xPos, yPos);
    }
  }

  switchTile(newType, tile) {
    let newTile;

    switch (newType) {
      case 'special':
        newTile = new SpecialTile();
        break;
      case 'frenzy':
        newTile = new FrenzyTile();
        break;
      case 'normal':
        newTile = new NormalTile();
        break;
    }

    newTile.setPos(tile.sprite.x, tile.sprite.y);

    let col = util.getCol(tile.sprite.x);
    let row = util.getRow(tile.sprite.y);

    this.inner[col][row] = newTile;

    return newTile;
  }
}

module.exports = { Table };
