const util = require('../utils/Util');

class SuggestView {
  constructor(controller) {
    this.controller = controller;
    this.state = false;
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
        graphic.beginFill(0x35cc5a, 0.5);
        graphic.drawRect(xPos - 86 / 2, yPos - 86 / 2, 86, 86);
        graphic.endFill();
        graphic.visible = false;

        this.controller.addChild(graphic);

        this.mask[col].push(graphic);
      }
    }
  }

  turnOn(combo) {
    if (combo === undefined) {
      return;
    }

    for (let [tile, value] of combo) {
      tile.sprite.alpha = 0.5;
      tile.sprite.blendMode = PIXI.BLEND_MODES.ADD;

      let col = value[0];
      let row = value[1];

      this.mask[col][row].visible = true;
    }
  }

  turnOff(combo) {
    if (combo === undefined) {
      return;
    }

    for (let [tile, value] of combo) {
      tile.sprite.alpha = 1;

      let col = value[0];
      let row = value[1];

      this.mask[col][row].visible = false;
    }
  }
}

module.exports = { SuggestView };
