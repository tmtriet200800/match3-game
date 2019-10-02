const { NormalTile } = require('../model/Tile');
const util = require('../utils/Util');

class BaseFeature {
  constructor(table) {
    this.table = table;
  }

  findCombo(xPos, yPos, combo, color) {
    let [col, row] = util.getIndex(xPos, yPos);

    if (util.validCol(col) === false || util.validRow(row) === false) {
      return;
    }

    let curTile = this.table.inner[col][row];

    if (curTile === undefined) {
      return;
    }

    if (curTile.color === color && combo.has(curTile) === false) {
      combo.set(curTile, [col, row]);

      //------------Check right tile------------//
      this.findCombo(xPos + curTile.size, yPos, combo, color);
      //------------Check left tile------------//
      this.findCombo(xPos - curTile.size, yPos, combo, color);
      //------------Check below tile------------//
      this.findCombo(xPos, yPos + curTile.size, combo, color);
      //------------Check above tile------------//
      this.findCombo(xPos, yPos - curTile.size, combo, color);
    }
  }

  getCombo(xPos, yPos) {
    let [col, row] = util.getIndex(xPos, yPos);

    if (util.validCol(col) === false || util.validRow(row) === false) {
      return undefined;
    }

    let color = this.table.inner[col][row].color;

    let combo = new Map();
    this.findCombo(xPos, yPos, combo, color);

    if (combo.size > 2) {
      for (let tile of combo.keys()) {
        tile.die = 1;
      }
      return combo;
    }

    return undefined;
  }

  removeAndFill(combo) {
    let addedTile = [];
    let colSet = new Set();

    for (let value of combo.values()) {
      colSet.add(value[0]);
    }

    for (let col of colSet) {
      let count = 0;
      let row = 0;
      while (row < this.table.inner[col].length) {
        if (this.table.inner[col][row].die === 1) {
          this.table.inner[col].splice(row, 1);
          let newTile = new NormalTile();
          newTile.setPos(util.getXPos(col), util.getYPos(this.table.size + count));
          this.table.inner[col].push(newTile);
          addedTile.push(newTile);
          count++;
        } else {
          row++;
        }
      }
    }

    return addedTile;
  }

  generateSpecial(xPos, yPos, table, combo) {
    let [col, row] = util.getIndex(xPos, yPos, table);

    let oldTile = table.inner[col][row];

    combo.delete(oldTile);

    table.switchTile('special', this.table.inner[col][row]);

    return [oldTile, this.table.inner[col][row]];
  }

  generateFrenzy(xPos, yPos, table, combo) {
    let [col, row] = util.getIndex(xPos, yPos, table);

    let oldTile = table.inner[col][row];

    combo.delete(oldTile);

    table.switchTile('frenzy', this.table.inner[col][row]);

    return [oldTile, this.table.inner[col][row]];
  }

  suggest(specialTile = undefined) {
    let combo = new Map();

    if (specialTile !== undefined && specialTile.length > 0) {
      let [col, row] = util.getIndex(specialTile[0].sprite.x, specialTile[0].sprite.y);
      combo.set(specialTile[0], [col, row]);

      return combo;
    }

    for (let col = 0; col < this.table.inner.length; col++) {
      for (let row = 0; row < this.table.inner[col].length; row++) {
        let xPos = util.getXPos(col);
        let yPos = util.getYPos(row);

        combo = this.getCombo(xPos, yPos);

        if (combo !== undefined) {
          return combo;
        }
      }
    }
  }
}

module.exports = { BaseFeature };
