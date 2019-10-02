const util = require('../utils/Util');

class BackgroundView {
  constructor(controller) {
    this.controller = controller;
    this.bgPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2
    };

    this.brandPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 6 - 80
    };
    this.timerscorePos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 3 - 80
    };
  }

  setup() {
    this.addBackGround();
    this.addTimerScore();
    this.addUiBrand();
    this.addBorder();
  }
  addBackGround() {
    // this.background = new PIXI.Sprite(Config.texture.background);
    // this.background.anchor.set(0.5, 0.5);
    // this.background.position.set(, );

    this.background = util.createSprite(this.bgPos.x, this.bgPos.y, Config.texture['background']);
    this.controller.addChild(this.background);
  }

  addUiBrand() {
    // this.uiBrand = new PIXI.Sprite(Config.texture['ui-brand']);
    // this.uiBrand.anchor.set(0.5, 0.5);
    // this.uiBrand.position.set(APP.GetWidth() / 2, APP.GetHeight() / 6);
    this.uiBrand = util.createSprite(this.brandPos.x, this.brandPos.y, Config.texture['ui-brand']);
    this.controller.addChild(this.uiBrand);
  }

  addTimerScore() {
    // this.timerScore = new PIXI.Sprite(Config.texture['timer-score']);
    // this.timerScore.anchor.set(0.5, 0.5);
    // this.timerScore.position.set(, APP.GetHeight() / 3);

    this.timerScore = util.createSprite(
      this.timerscorePos.x,
      this.timerscorePos.y,
      Config.texture['timer-score']
    );
    this.controller.addChild(this.timerScore);
  }

  addBorder() {
    this.border = new PIXI.Graphics();
    this.border.lineStyle(4, 0xde3249, 1);
    this.border.beginFill();
    this.border.drawRect(
      Config.tablePos.x - (Config.tileSize * 7) / 2 - 10,
      Config.tablePos.y - (Config.tileSize * 7) / 2 - 10,
      Config.tileSize * 7 + 20,
      Config.tileSize * 7 + 20
    );
    this.border.endFill();

    this.controller.addChild(this.border);
  }
}
module.exports = { BackgroundView };
