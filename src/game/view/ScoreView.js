const util = require('../utils/Util');

class ScoreView {
  constructor(controller) {
    this.controller = controller;

    this.symbolPos = {
      x: APP.GetWidth() / 2 - 120,
      y: APP.GetHeight() / 3 - 80
    };

    this.textPos = {
      x: APP.GetWidth() / 2 - 35,
      y: APP.GetHeight() / 3 - 80
    };
  }

  setup(score) {
    this.addSymbol();
    this.addText(score);
  }

  addSymbol() {
    // this.scoreSymbol = new PIXI.Sprite(Config.texture['score-symbol']);
    // this.scoreSymbol.anchor.set(0.5, 0.5);
    // this.scoreSymbol.position.set(APP.GetWidth() / 2 - 120, APP.GetHeight() / 3);
    this.symbol = util.createSprite(
      this.symbolPos.x,
      this.symbolPos.y,
      Config.texture['score-symbol']
    );
    this.controller.addChild(this.symbol);
  }

  addText(score) {
    // this.scoreText = new PIXI.Text(this.score, this.style);
    // this.scoreText.anchor.set(0.5, 0.5);
    // this.scoreText.position.set(APP.GetWidth() / 2 - 35, APP.GetHeight() / 3);
    // this.controller.addChild(this.scoreText);

    this.text = util.createText(this.textPos.x, this.textPos.y, score);
    this.controller.addChild(this.text);
  }

  updateText(score) {
    //this.score += score;
    this.controller.removeChild(this.text);
    this.addText(score);
  }
}

module.exports = { ScoreView };
