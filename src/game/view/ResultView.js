const util = require('../utils/Util');

class ResultView {
  constructor(controller) {
    this.controller = controller;

    this.textPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 - 300
    };

    this.scorePos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 - 150
    };

    this.restartPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 + 100
    };

    this.backPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 + 300
    };
  }

  genText() {
    this.textView = util.createText(
      this.textPos.x,
      this.textPos.y,
      'Your score',
      Config.headerStyle
    );

    this.controller.addChild(this.textView);
  }

  genScore(score) {
    this.scoreView = util.createText(this.scorePos.x, this.scorePos.y, score, Config.headerStyle);
    this.controller.addChild(this.scoreView);
  }

  genRestartBtn() {
    this.restartView = util.createSprite(
      this.restartPos.x,
      this.restartPos.y,
      Config.texture['menu-option']
    );

    this.restartView.interactive = true;
    this.restartText = util.createText(this.restartPos.x, this.restartPos.y, 'Restart game');

    this.controller.addChild(this.restartView);
    this.controller.addChild(this.restartText);
  }

  genBackBtn() {
    this.backView = util.createSprite(
      this.backPos.x,
      this.backPos.y,
      Config.texture['menu-option']
    );

    this.backView.interactive = true;

    this.backText = util.createText(this.backPos.x, this.backPos.y, 'Back to menu');
    this.controller.addChild(this.backView);
    this.controller.addChild(this.backText);
  }
}

module.exports = { ResultView };
