const util = require('../utils/Util');
class DrawingFeature {
  constructor(table, controller) {
    this.table = table;
    this.controller = controller;

    this.curTile = null;
    this.preTile = null;

    this.errorTile = null;

    this.material = {
      data: new Map(),
      color: null
    };

    this.mask = new Array(Config.tableSize);

    for (let i = 0; i < this.mask.length; i++) {
      this.mask[i] = [];
    }
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
        graphic.beginFill(0xde3249, 0.5);
        graphic.drawRect(xPos - 86 / 2, yPos - 86 / 2, 86, 86);
        graphic.endFill();
        graphic.visible = false;

        this.controller.addChild(graphic);

        this.mask[col].push(graphic);
      }
    }
  }

  onStart(curCol, curRow) {
    this.curTile = this.table.inner[curCol][curRow];

    this.material.data = new Map();
    console.log(this.material.data);
    this.material.data.set(this.curTile, [curCol, curRow]);
    this.turnOn(curCol, curRow);
    this.material.color = this.curTile.color;
    this.preTile = this.curTile;
  }

  onProgress(curCol, curRow, drawState) {
    if (util.validCol(curCol) === false || util.validRow(curRow) === false) {
      return;
    }

    this.curTile = this.table.inner[curCol][curRow];

    if (
      this.curTile.color === this.material.color &&
      Math.abs(this.curTile.sprite.x - this.preTile.sprite.x) +
        Math.abs(this.curTile.sprite.y - this.preTile.sprite.y) ===
        86 &&
      this.curTile.color === this.preTile.color &&
      drawState.error === false
    ) {
      this.material.data.set(this.curTile, [curCol, curRow]);
      this.turnOn(curCol, curRow);
    } else {
      this.errorTile = this.preTile;
      drawState.error = true;
    }

    this.preTile = this.curTile;
  }

  onFinish() {
    for (let col = 0; col < this.mask.length; col++) {
      for (let row = 0; row < this.mask[col].length; row++) {
        this.turnOff(col, row);
      }
    }

    let combo = this.material.data;

    if (combo.size <= 2) {
      return undefined;
    }

    for (let tile of combo.keys()) {
      tile.die = 1;
    }

    return combo;
  }

  onError(drawState) {
    if (this.curTile === this.errorTile) {
      drawState.error = false;
      this.errorTile = null;
    }
  }

  turnOn(col, row) {
    if (util.validCol(col) === true && util.validRow(row) === true) {
      this.curTile.sprite.alpha = 0.5;
      this.mask[col][row].visible = true;
    }
  }

  turnOff(col, row) {
    if (util.validCol(col) === true && util.validRow(row) === true) {
      this.table.inner[col][row].sprite.alpha = 1;
      this.mask[col][row].visible = false;
    }
  }
}

module.exports = { DrawingFeature };
