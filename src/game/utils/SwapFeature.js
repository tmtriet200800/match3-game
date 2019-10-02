const util = require('../utils/Util');
const { NormalTile } = require('../model/Tile');
const { BaseFeature } = require('../utils/BaseFeature');

class SwapFeature {
  constructor(table, controller) {
    this.table = table;
    this.controller = controller;
    this.mask = new Array(Config.tableSize);
    this.baseFeature = new BaseFeature(table);

    for (let i = 0; i < this.mask.length; i++) {
      this.mask[i] = [];
    }

    this.clickedTile = {
      data: [],
      indexStart: [],
      indexEnd: []
    };
  }

  setup() {
    this.generateMask();
  }

  generateMask() {
    for (let col = 0; col < Config.tableSize; col++) {
      for (let row = 0; row < Config.tableSize; row++) {
        let xPos = util.getXPos(col);
        let yPos = util.getYPos(row);

        let graphic = new PIXI.Graphics();
        graphic.lineStyle(1);
        graphic.beginFill(0x35cc5a, 0.5);
        graphic.drawRect(xPos - 86 / 2, yPos - 86 / 2, 86, 86);
        graphic.endFill();
        graphic.visible = false;

        this.controller.addChild(graphic);

        this.mask[col].push(graphic);
      }
    }
  }

  generateCol() {
    let check = true;

    for (let col = 0; col < 7; col++) {
      let combo = new Map();

      for (let row = 0; row < 7; row++) {
        if (row === 0) {
          combo.set(this.table.inner[col][row], [col, row]);
        } else {
          if (this.table.inner[col][row].color === this.table.inner[col][row - 1].color) {
            combo.set(this.table.inner[col][row], [col, row]);
          } else {
            combo = new Map();
            combo.set(this.table.inner[col][row], [col, row]);
          }
          if (combo.size >= 3) {
            check = false;

            for (let tile of combo.keys()) {
              tile.die = 1;
            }

            this.baseFeature.removeAndFill(combo);
            combo = new Map();
            combo.set(this.table.inner[col][row], [col, row]);
          }
        }
      }
    }

    return check;
  }

  generateRow() {
    let check = true;

    for (let row = 0; row < 7; row++) {
      let combo = new Map();
      for (let col = 0; col < 7; col++) {
        if (col === 0) {
          combo.set(this.table.inner[col][row], [col, row]);
        } else {
          if (this.table.inner[col][row].color === this.table.inner[col - 1][row].color) {
            combo.set(this.table.inner[col][row], [col, row]);
          } else {
            combo = new Map();
            combo.set(this.table.inner[col][row], [col, row]);
          }
          if (combo.size >= 3) {
            check = false;
            for (let tile of combo.keys()) {
              tile.die = 1;
            }

            this.baseFeature.removeAndFill(combo);
            combo = new Map();
            combo.set(this.table.inner[col][row], [col, row]);
          }
        }
      }
    }

    return check;
  }

  checkTable() {
    let check = true;
    let count = 0;

    do {
      count++;
      check = this.generateCol() && this.generateRow();
    } while (check === false);

    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 7; row++) {
        this.table.inner[col][row].sprite.x = util.getXPos(col);
        this.table.inner[col][row].sprite.y = util.getYPos(row);
      }
    }
  }

  checkCol() {
    let error = false;

    for (let col = 0; col < 7; col++) {
      let combo = new Map();

      for (let row = 0; row < 7; row++) {
        if (row === 0) {
          combo.set(this.table.inner[col][row], [col, row]);
        } else {
          if (this.table.inner[col][row].color === this.table.inner[col][row - 1].color) {
            combo.set(this.table.inner[col][row], [col, row]);
          } else {
            if (error === true) {
              for (let tile of combo.keys()) {
                tile.die = 1;
              }

              return combo;
            } else {
              combo = new Map();
              combo.set(this.table.inner[col][row], [col, row]);
            }
          }
          if (combo.size >= 3) {
            error = true;

            if (row == 6) {
              for (let tile of combo.keys()) {
                tile.die = 1;
              }

              return combo;
            }
          }
        }
      }
    }

    return undefined;
  }

  checkRow() {
    let error = false;

    for (let row = 0; row < 7; row++) {
      let combo = new Map();
      for (let col = 0; col < 7; col++) {
        if (col === 0) {
          combo.set(this.table.inner[col][row], [col, row]);
        } else {
          if (this.table.inner[col][row].color === this.table.inner[col - 1][row].color) {
            combo.set(this.table.inner[col][row], [col, row]);
          } else {
            if (error === true) {
              for (let tile of combo.keys()) {
                tile.die = 1;
              }

              return combo;
            } else {
              combo = new Map();
              combo.set(this.table.inner[col][row], [col, row]);
            }
          }
          if (combo.size >= 3) {
            error = true;

            if (col == 6) {
              for (let tile of combo.keys()) {
                tile.die = 1;
              }

              return combo;
            }
          }
        }
      }
    }

    return undefined;
  }

  getData(xPos, yPos) {
    let [col, row] = util.getIndex(xPos, yPos);

    if (this.clickedTile.data.length === 0) {
      this.clickedTile.indexStart.push(col);
      this.clickedTile.indexStart.push(row);
      this.clickedTile.data.push(this.table.inner[col][row]);

      this.turnOn(col, row);
    } else if (this.clickedTile.data.length === 1) {
      if (this.table.inner[col][row] === this.clickedTile.data[0]) {
        this.resestData();
      } else {
        if (
          col === this.clickedTile.indexStart[0] &&
          Math.abs(util.getYPos(row) - util.getYPos(this.clickedTile.indexStart[1])) === 86
        ) {
          this.clickedTile.indexEnd.push(col);
          this.clickedTile.indexEnd.push(row);
          this.clickedTile.data.push(this.table.inner[col][row]);
          this.turnOn(col, row);
        }

        if (
          row === this.clickedTile.indexStart[1] &&
          Math.abs(util.getXPos(col) - util.getXPos(this.clickedTile.indexStart[0])) === 86
        ) {
          this.clickedTile.indexEnd.push(col);
          this.clickedTile.indexEnd.push(row);
          this.clickedTile.data.push(this.table.inner[col][row]);
          this.turnOn(col, row);
        }
      }
    }

    if (this.clickedTile.data.length === 2) {
      this.swap();
      return true;
    }

    return false;
  }

  resestData() {
    if (this.clickedTile.indexStart.length > 0) {
      this.turnOff(this.clickedTile.indexStart[0], this.clickedTile.indexStart[1]);
    }

    if (this.clickedTile.indexEnd.length > 0) {
      this.turnOff(this.clickedTile.indexEnd[0], this.clickedTile.indexEnd[1]);
    }

    this.clickedTile.data = [];
    this.clickedTile.indexStart = [];
    this.clickedTile.indexEnd = [];
  }

  swapData() {
    let tempCol = this.clickedTile.indexStart[0];
    let tempRow = this.clickedTile.indexStart[1];

    this.clickedTile.indexStart[0] = this.clickedTile.indexEnd[0];
    this.clickedTile.indexStart[1] = this.clickedTile.indexEnd[1];

    this.clickedTile.indexEnd[0] = tempCol;
    this.clickedTile.indexEnd[1] = tempRow;

    let temp0 = Object.assign({}, this.clickedTile.data[0]);
    let temp1 = Object.assign({}, this.clickedTile.data[1]);

    this.clickedTile.data = [temp0, temp1];
    this.swap();
  }

  swap() {
    let colStart = this.clickedTile.indexStart[0];
    let rowStart = this.clickedTile.indexStart[1];

    let colEnd = this.clickedTile.indexEnd[0];
    let rowEnd = this.clickedTile.indexEnd[1];

    this.table.inner[colStart][rowStart] = this.clickedTile.data[1];
    this.table.inner[colEnd][rowEnd] = this.clickedTile.data[0];
  }

  turnOn(col, row) {
    this.table.inner[col][row].sprite.alpha = 0.5;
    this.mask[col][row].visible = true;
  }

  turnOff(col, row) {
    this.table.inner[col][row].sprite.alpha = 1;
    this.mask[col][row].visible = false;
  }

  removeAndFill(combo) {
    let addedTile = [];
    let colSet = new Set();

    for (let value of combo.values()) {
      colSet.add(value[0]);
    }

    for (let col of colSet) {
      let colorCount = {
        blue: 0,
        pink: 0,
        yellow: 0,
        green: 0
      };
      let count = 0;

      let row = 0;
      while (row < this.table.inner[col].length) {
        if (this.table.inner[col][row].die === 1) {
          this.table.inner[col].splice(row, 1);

          let newTile = null;

          do {
            if (newTile != null) {
              colorCount[newTile.color]--;
            }
            newTile = new NormalTile();
            colorCount[newTile.color]++;
          } while (
            colorCount.blue >= 3 ||
            colorCount.pink >= 3 ||
            colorCount.yellow >= 3 ||
            colorCount.green >= 3
          );

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
}

module.exports = { SwapFeature };
