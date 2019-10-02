const util = require('../utils/Util');

class TimerView {
  constructor(controller) {
    this.symbolPos = {
      x: APP.GetWidth() / 2 - 260,
      y: APP.GetHeight() / 3 - 80
    };

    this.textPos = {
      x: APP.GetWidth() / 2 - 190,
      y: APP.GetHeight() / 3 - 80
    };

    this.controller = controller;
  }

  setup(timer) {
    this.addSymbol();
    this.addText(timer);
  }

  addSymbol() {
    // this.timerSymbol = new PIXI.Sprite(Config.texture['timer-symbol']);
    // this.timerSymbol.anchor.set(0.5, 0.5);
    // this.timerSymbol.position.set();

    this.symbol = util.createSprite(
      this.symbolPos.x,
      this.symbolPos.y,
      Config.texture['timer-symbol']
    );
    this.controller.addChild(this.symbol);
  }

  addText(timer) {
    // this.timerText = new PIXI.Text(this.timer, this.style);
    // this.timerText.anchor.set(0.5, 0.5);
    // this.timerText.position.set(APP.GetWidth() / 2 - 190, APP.GetHeight() / 3);
    // this.controller.addChild(this.timerText);

    this.text = util.createText(this.textPos.x, this.textPos.y, timer);
    this.controller.addChild(this.text);
  }

  updateTime(timer) {
    this.controller.removeChild(this.text);
    this.addText(timer);
  }
}

module.exports = { TimerView };
