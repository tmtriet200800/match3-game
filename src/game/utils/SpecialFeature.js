const util = require('../utils/Util');

class SpecialFeature {
  constructor(table) {
    this.table = table;
  }

  findCombo(xPos, yPos, combo) {
    const col = util.getCol(xPos);
    if (col >= this.table.inner.length || col < 0) {
      //------------Check colIndex------------//
      return;
    }

    const row = util.getRow(yPos, this.table.inner[col].length);
    if (row >= this.table.inner[col].length || row < 0) {
      //------------Check rowIndex------------//
      return;
    }

    //console.log(`${col} ${row}`);

    if (
      util.getCol(xPos + 86) < this.table.inner.length &&
      combo.has(this.table.inner[col + 1][row]) === false
    ) {
      combo.set(this.table.inner[col + 1][row], [col + 1, row]);
      if (
        this.table.inner[col + 1][row] !== undefined &&
        this.table.inner[col + 1][row].type === 'special'
      ) {
        this.findCombo(xPos + Config.tileSize, yPos, combo);
      }
    }

    if (util.getCol(xPos - 86) >= 0 && combo.has(this.table.inner[col - 1][row]) === false) {
      combo.set(this.table.inner[col - 1][row], [col - 1, row]);
      if (
        this.table.inner[col - 1][row] !== undefined &&
        this.table.inner[col - 1][row].type === 'special'
      ) {
        this.findCombo(xPos - Config.tileSize, yPos, combo);
      }
    }

    if (
      util.getRow(yPos - 86) < this.table.inner[col].length &&
      combo.has(this.table.inner[col][row + 1]) === false
    ) {
      combo.set(this.table.inner[col][row + 1], [col, row + 1]);
      if (
        this.table.inner[col][row + 1] !== undefined &&
        this.table.inner[col][row + 1].type === 'special'
      ) {
        this.findCombo(xPos, yPos + Config.tileSize, combo);
      }
    }

    if (util.getRow(yPos + 86) >= 0 && combo.has(this.table.inner[col][row - 1]) === false) {
      combo.set(this.table.inner[col][row - 1], [col, row - 1]);
      if (
        this.table.inner[col][row - 1] !== undefined &&
        this.table.inner[col][row - 1].type === 'special'
      ) {
        this.findCombo(xPos, yPos - Config.tileSize, combo);
      }
    }

    if (
      util.getCol(xPos + 86) < this.table.inner.length &&
      util.getRow(yPos - 86) < this.table.inner[col].length &&
      combo.has(this.table.inner[col + 1][row + 1]) === false
    ) {
      combo.set(this.table.inner[col + 1][row + 1], [col + 1, row + 1]);
      if (
        this.table.inner[col + 1][row + 1] !== undefined &&
        this.table.inner[col + 1][row + 1].type === 'special'
      ) {
        this.findCombo(xPos + Config.tileSize, yPos + Config.tileSize, combo);
      }
    }

    if (
      util.getCol(xPos + 86) < this.table.inner.length &&
      util.getRow(yPos + 86) >= 0 &&
      combo.has(this.table.inner[col + 1][row - 1]) === false
    ) {
      combo.set(this.table.inner[col + 1][row - 1], [col + 1, row - 1]);
      if (
        this.table.inner[col + 1][row - 1] !== undefined &&
        this.table.inner[col + 1][row - 1].type === 'special'
      ) {
        this.findCombo(xPos + Config.tileSize, yPos - Config.tileSize, combo);
      }
    }

    if (
      util.getCol(xPos - 86) >= 0 &&
      util.getRow(yPos - 86) < this.table.inner[col].length &&
      combo.has(this.table.inner[col - 1][row + 1]) === false
    ) {
      combo.set(this.table.inner[col - 1][row + 1], [col - 1, row + 1]);
      if (
        this.table.inner[col - 1][row + 1] !== undefined &&
        this.table.inner[col - 1][row + 1].type === 'special'
      ) {
        this.findCombo(xPos - Config.tileSize, yPos + Config.tileSize, combo);
      }
    }

    if (
      util.getCol(xPos - 86) >= 0 &&
      util.getRow(yPos + 86) >= 0 &&
      combo.has(this.table.inner[col - 1][row - 1]) === false
    ) {
      combo.set(this.table.inner[col - 1][row - 1], [col - 1, row - 1]);
      if (
        this.table.inner[col - 1][row - 1] !== undefined &&
        this.table.inner[col - 1][row - 1].type === 'special'
      ) {
        this.findCombo(xPos - Config.tileSize, yPos - Config.tileSize, combo);
      }
    }
  }

  getCombo(xPos, yPos) {
    const col = util.getCol(xPos);
    if (util.validCol(col) === false) {
      return undefined;
    }

    const row = util.getRow(yPos, this.table.inner[col].length);
    if (util.validRow(row) === false) {
      return undefined;
    }

    let combo = new Map();

    combo.set(this.table.inner[col][row], [col, row]);
    this.findCombo(xPos, yPos, combo);

    // if (combo.size > 2) {
    //   for (let tile of combo.keys()) {
    //     tile.die = 1;
    //   }
    //   return combo;
    // }

    // if (this.table.inner[col][row].type === 'special') {
    //   this.findCombo(xPos, yPos, combo);
    //   for (let tile of combo.keys()) {
    //     tile.die = 1;
    //   }
    //   return [combo, 'special'];
    // }
    // return [undefined, 'none'];

    for (let tile of combo.keys()) {
      if (tile !== undefined) {
        tile.die = 1;
      } else {
        combo.delete(tile);
      }
    }

    return combo;
  }

  updateSpecial(specialTile) {
    let index = 0;

    while (index < specialTile.length) {
      if (specialTile[index].die === 1) {
        specialTile.splice(index, 1);
      } else {
        index++;
      }
    }
  }
}

module.exports = { SpecialFeature };
