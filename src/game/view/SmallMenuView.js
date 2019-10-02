const util = require('../utils//Util');

class SmallMenuView {
  constructor(controller) {
    this.controller = controller;

    this.buttonPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 - 200
    };

    this.textPos = {
      x: this.buttonPos.x,
      y: this.buttonPos.y
    };

    this.iconPos = {
      x: APP.GetWidth() / 2 + 400,
      y: APP.GetHeight() / 2 - 530
    };

    this.buttonView = [];
    this.textView = [];
  }

  generateMenuIcon() {
    this.menuButton = util.createSprite(
      this.iconPos.x,
      this.iconPos.y,
      Config.texture['menu-button']
    );
    this.menuButton.interactive = true;
    this.controller.addChild(this.menuButton);
  }

  generateButton(index, menuOption) {
    let newSprite = util.createSprite(
      this.buttonPos.x,
      this.buttonPos.y + index * 200,
      Config.texture['menu-option']
    );
    newSprite.interactive = true;

    this.buttonView.push(newSprite);

    let newText = util.createText(this.textPos.x, this.textPos.y + index * 200, menuOption[index]);

    this.controller.addChild(newSprite);
    this.controller.addChild(newText);

    this.textView.push(newText);
  }

  genSmallMenu() {
    for (let i = 0; i < this.controller.children.length; i++) {
      this.controller.children[i].alpha = 0.5;
    }

    this.generateButton(0, Config.smallOption);
    this.generateButton(1, Config.smallOption);
    this.generateButton(2, Config.smallOption);
  }

  clearMenu() {
    this.buttonView.forEach(cur => this.controller.removeChild(cur));
    this.buttonView = [];
    this.textView.forEach(cur => this.controller.removeChild(cur));
    this.textView = [];
  }
}

module.exports = { SmallMenuView };
