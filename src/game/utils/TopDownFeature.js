const { NormalTile } = require('../model/Tile');
const util = require('../utils/Util');

class TopDownFeature {
  constructor(table) {
    this.table = table;
    this.animateGeneration = true;
  }

  init() {
    for (let col = 0; col < this.table.size; col++) {
      for (let row = 0; row < 4; row++) {
        let newTile = new NormalTile();
        const xPos = util.getXPos(col);
        const yPos = util.getYPos(row);
        newTile.setPos(xPos, yPos);
        this.table.inner[col].push(newTile);
      }
    }
  }

  generateTop(generatedTile) {
    const xPos = util.getXPos(generatedTile.length);
    const yPos = util.getYPos(Config.tableSize) - 20;

    let newTile = new NormalTile();
    newTile.setPos(xPos, yPos);

    newTile.sprite.mask = null;
    generatedTile.push(newTile);

    return newTile;
  }

  addRowTop(generatedTile) {
    for (let col = 0; col < this.table.size; col++) {
      generatedTile[col].sprite.y = util.getYPos(7);
      generatedTile[col].sprite.mask = generatedTile[col].mask;
      this.table.inner[col].push(generatedTile[col]);
    }
  }

  remove(combo) {
    let colSet = new Set();

    for (let value of combo.values()) {
      colSet.add(value[0]);
    }

    for (let col of colSet) {
      let row = 0;
      while (row < this.table.inner[col].length) {
        if (this.table.inner[col][row] !== undefined && this.table.inner[col][row].die === 1) {
          this.table.inner[col].splice(row, 1);
        } else {
          row++;
        }
      }
    }

    return;
  }
}

module.exports = { TopDownFeature };
