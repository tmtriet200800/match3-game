const util = require('../utils/Util');

class MenuView {
  constructor(controller) {
    this.controller = controller;

    this.optionArr = [
      Config.gameMode,
      Config.explodeMode,
      Config.bgSoundMode,
      Config.soundFXMode,
      Config.numTile,
      Config.timerMode
    ];

    this.optionState = [
      Config.currentMode,
      Config.currentExplode,
      Config.currentBgSound,
      Config.currentSoundFX,
      Config.currentNumTile,
      Config.currentTimer
    ];

    this.optionView = [];

    this.optionPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetWidth() / 8
    };

    this.optionTitlePos = {
      x: APP.GetWidth() / 2 - 250
    };

    this.optionViewPos = {
      x: APP.GetWidth() / 2 + 250
    };

    this.arrowLeftPos = {
      x: APP.GetWidth() / 2 + 50,
      y: this.optionPos.y
    };

    this.arrowRightPos = {
      x: APP.GetWidth() / 2 + 450,
      y: this.optionPos.y
    };

    this.playNowPos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 + 500
    };

    this.space = 100;
  }

  setup(optionMode, gameMode, explodeMode) {
    this.genOptionMode();
    this.genArrowLeft();
    this.genArrowRight();
    this.genPlayNow();
  }

  genOptionMode() {
    this.optionModeTitle = Config.optionMode.map((cur, index) => {
      let title = util.createText(
        this.optionTitlePos.x,
        this.optionPos.y + index * this.space,
        cur
      );
      let option = util.createText(
        this.optionViewPos.x,
        this.optionPos.y + index * this.space,
        this.optionArr[index][this.optionState[index]]
      );

      this.optionView.push(option);

      this.controller.addChild(title);
      this.controller.addChild(option);
    });
  }

  genPlayNow() {
    this.playNowView = util.createSprite(
      this.playNowPos.x,
      this.playNowPos.y,
      Config.texture['play-now']
    );

    this.playNowView.interactive = true;

    this.controller.addChild(this.playNowView);
  }

  genArrowLeft() {
    this.arrowLeft = Config.optionMode.map((cur, index) => {
      let newSprite = util.createSprite(
        this.arrowLeftPos.x,
        this.arrowLeftPos.y + index * this.space,
        Config.texture['arrow-left']
      );

      newSprite.interactive = true;

      this.controller.addChild(newSprite);
      return newSprite;
    });
  }

  genArrowRight() {
    this.arrowRight = Config.optionMode.map((cur, index) => {
      let newSprite = util.createSprite(
        this.arrowRightPos.x,
        this.arrowRightPos.y + index * this.space,
        Config.texture['arrow-right']
      );

      newSprite.interactive = true;

      this.controller.addChild(newSprite);
      return newSprite;
    });
  }

  updateOptionMode(index, indexState) {
    this.controller.removeChild(this.optionView[index]);

    this.optionView[index] = util.createText(
      this.optionViewPos.x,
      this.optionPos.y + index * this.space,
      this.optionArr[index][indexState]
    );

    this.controller.addChild(this.optionView[index]);
  }

  controlOptionMode(target) {
    let indexLeft = this.arrowLeft.findIndex(cur => cur === target);
    let indexRight = this.arrowRight.findIndex(cur => cur === target);

    if (indexLeft !== -1) {
      if (this.optionState[indexLeft] > 0) {
        this.optionState[indexLeft]--;

        switch (indexLeft) {
          case 0:
            Config.currentMode = this.optionState[indexLeft];
            break;
          case 1:
            Config.currentExplode = this.optionState[indexLeft];
            break;
          case 2:
            Config.currentBgSound = this.optionState[indexLeft];
            break;
          case 3:
            Config.currentSoundFX = this.optionState[indexLeft];
            break;
          case 4:
            Config.currentNumTile = this.optionState[indexLeft];
            break;
          case 5:
            Config.currentTimer = this.optionState[indexLeft];
            break;
        }
      }

      this.updateOptionMode(indexLeft, this.optionState[indexLeft]);
    }

    if (indexRight !== -1) {
      if (this.optionState[indexRight] < this.optionArr[indexRight].length - 1) {
        this.optionState[indexRight]++;

        switch (indexRight) {
          case 0:
            Config.currentMode = this.optionState[indexRight];
            break;
          case 1:
            Config.currentExplode = this.optionState[indexRight];
            break;
          case 2:
            Config.currentBgSound = this.optionState[indexRight];
            break;
          case 3:
            Config.currentSoundFX = this.optionState[indexRight];
            break;
          case 4:
            Config.currentNumTile = this.optionState[indexRight];
            break;
          case 5:
            Config.currentTimer = this.optionState[indexRight];
            break;
        }
      }

      this.updateOptionMode(indexRight, this.optionState[indexRight]);
    }
  }
}

module.exports = { MenuView };
