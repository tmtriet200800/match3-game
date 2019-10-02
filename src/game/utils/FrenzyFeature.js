const util = require('../utils/Util');

class FrenzyFeature {
  constructor(table) {
    this.table = table;
  }

  specialToFrenzy(specialTile, frenzyTile) {
    for (let i = 0; i < specialTile.length; i++) {
      frenzyTile.push(this.table.switchTile('frenzy', specialTile[i]));
    }
  }

  init(frenzyTile) {
    let numFrenzy = 4;
    let oldTile = [];

    let normalSet = new Set();

    for (let num = 0; num < numFrenzy; num++) {
      let col = 0;
      let row = 0;

      do {
        col = Math.floor(Math.random() * this.table.inner.length);
        row = Math.floor(Math.random() * this.table.inner[col].length);
      } while (
        this.table.inner[col][row].type === 'frenzy' ||
        normalSet.add(this.table.inner[col][row]) == true
      );

      normalSet.add(this.table.inner[col][row]);

      oldTile.push(this.table.inner[col][row]);
      frenzyTile.push(this.table.switchTile('frenzy', oldTile[num]));
    }
    return oldTile;
  }

  reset(frenzyTile) {
    let normalTile = [];
    for (let i = 0; i < frenzyTile.length; i++) {
      normalTile.push(this.table.switchTile('normal', frenzyTile[i]));
    }

    return normalTile;
  }

  generateFrenzy(frenzyTile) {
    let numFrenzy = frenzyTile.length;
    if (frenzyTile.length === 0) {
      numFrenzy = 4;
    }

    util.emptyArr(frenzyTile);
    let normalTile = [];
    let normalSet = new Set();

    for (let num = 0; num < numFrenzy; num++) {
      let col = 0;
      let row = 0;

      do {
        col = Math.floor(Math.random() * this.table.inner.length);
        row = Math.floor(Math.random() * this.table.inner[col].length);
      } while (
        this.table.inner[col][row].type === 'frenzy' ||
        normalSet.has(this.table.inner[col][row]) === true
      );

      normalSet.add(this.table.inner[col][row]);

      normalTile.push(this.table.inner[col][row]);
      frenzyTile.push(this.table.switchTile('frenzy', normalTile[num]));
    }

    return normalTile;
  }

  complete(specialTile, frenzyTile) {
    for (let i = 0; i < frenzyTile.length; i++) {
      specialTile.push(this.table.switchTile('special', frenzyTile[i]));
    }
  }

  getCombo(frenzyTile) {
    let colSet = new Set();
    let rowSet = new Set();
    let combo = new Map();

    for (let i = 0; i < frenzyTile.length; i++) {
      let [col, row] = util.getIndex(frenzyTile[i].sprite.x, frenzyTile[i].sprite.y);
      colSet.add(col);
      rowSet.add(row);

      combo.set(this.table.inner[col][row], [col, row]);
    }

    for (let col of colSet) {
      for (let row = 0; row < this.table.inner[col].length; row++) {
        if (combo.has(this.table.inner[col][row]) === false) {
          combo.set(this.table.inner[col][row], [col, row]);
        }
      }
    }

    for (let row of rowSet) {
      for (let col = 0; col < this.table.inner.length; col++) {
        if (combo.has(this.table.inner[col][row]) === false) {
          combo.set(this.table.inner[col][row], [col, row]);
        }
      }
    }

    for (let tile of combo.keys()) {
      tile.die = 1;
    }

    return combo;
  }
}

module.exports = { FrenzyFeature };
