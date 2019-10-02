const util = require('../utils/Util');

class EnergyView {
  constructor(controller) {
    this.controller = controller;
    this.symbolPos = {
      x: APP.GetWidth() / 2 + 50,
      y: APP.GetHeight() / 3 - 80
    };

    this.barProp = {
      width: 220,
      height: 47
    };

    this.barPos = {
      x: APP.GetWidth() / 2 + 180,
      y: APP.GetHeight() / 3 - 80
    };

    this.maskPos = {
      x: APP.GetWidth() / 2 + 180 - this.barProp.width / 2,
      y: APP.GetHeight() / 3 - this.barProp.height / 2 - 80
    };
  }

  setup() {
    this.generateMask();
    this.addBar();
    this.addSymbol();
  }

  addSymbol() {
    // this.frenzySymbol = new PIXI.Sprite(Config.texture['score-symbol']);
    // this.frenzySymbol.anchor.set(0.5, 0.5);
    // this.frenzySymbol.position.set(, );

    this.symbol = util.createSprite(
      this.symbolPos.x,
      this.symbolPos.y,
      Config.texture['score-symbol']
    );
    this.controller.addChild(this.symbol);
  }

  addBar() {
    // this.frenzyBar = new PIXI.Sprite(Config.texture['frenzy-bar']);
    // this.frenzyBar.anchor.set(0.5, 0.5);
    // this.frenzyBar.position.set(APP.GetWidth() / 2 + 180, APP.GetHeight() / 3);
    // this.controller.addChild(this.frenzyBar);
    // this.frenzyBar.mask = this.mask;
    // global.superMan = this.frenzyBar;

    this.bar = util.createSprite(this.barPos.x, this.barPos.y, Config.texture['frenzy-bar']);
    this.bar.mask = this.mask;
    this.controller.addChild(this.bar);
  }

  generateMask() {
    this.mask = new PIXI.Graphics();
    this.mask.beginFill(0xde3249);
    this.mask.drawRect(this.maskPos.x, this.maskPos.y, 0, this.barProp.height);
    this.mask.endFill();
  }

  //   updateFrenzy(numTile) {
  //     if (this.frenzyPower < 1) {
  //       this.frenzyPower += (numTile * 1) / 100;
  //       this.updateMask();
  //     }
  //   }

  updateMask(energy) {
    this.mask = new PIXI.Graphics();
    this.mask.beginFill();
    this.mask.drawRect(
      this.maskPos.x,
      this.maskPos.y,
      this.barProp.width * energy,
      this.barProp.height
    );
    this.mask.endFill();
    this.bar.mask = this.mask;
  }
}

module.exports = { EnergyView };
