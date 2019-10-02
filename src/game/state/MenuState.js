const util = require('../utils/Util');
const { MenuView } = require('../view/MenuView');
const { BasicMode } = require('./BasicMode');
const { FrenzyMode } = require('./FrenzyMode');
const { BottomUp } = require('../state/BottomUp');
const { TopDown } = require('../state/TopDown');
const { DrawingMode } = require('../state/DrawingMode');
const { SwapMode } = require('../state/SwapMode');

class MenuState extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);
    this.children = [];

    this.bgView = util.createSprite(
      APP.GetWidth() / 2,
      APP.GetHeight() / 2,
      Config.texture['background']
    );
    this.addChild(this.bgView);

    this.menuView = new MenuView(this);
    this.menuView.setup(Config.optionMode, Config.gameMode, Config.explodeMode);

    this.basicMode = new BasicMode();
    this.frenzyMode = new FrenzyMode();
    this.bottomUp = new BottomUp();
    this.topDown = new TopDown();
    this.drawingMode = new DrawingMode();
    this.swapMode = new SwapMode();

    this.startBg = 1;

    if (Config.currentBgSound === 0) {
      Config.sound.bgm.play();
      Config.sound.bgm.loop = true;
      Config.sound.bgm.volume = 0.4;
    }
  }

  Update(deltaTime) {
    if (Config.currentBgSound === 1) {
      Config.sound.bgm.stop();
      this.startBg = 0;
    }

    if (Config.currentBgSound === 0 && this.startBg === 0) {
      Config.sound.bgm.play();
      Config.sound.bgm.loop = true;
      Config.sound.bgm.volume = 0.4;
      this.startBg = 1;
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm.stop();
    APP.RemoveChild(this);
  }

  TouchHandler(event) {
    if (Input.IsTouchDown(event)) {
      this.menuView.controlOptionMode(event.target);

      if (event.target === this.menuView.playNowView) {
        if (Config.currentSoundFX == 0) {
          Config.sound.confirm.play();
        }

        switch (Config.currentMode) {
          case 0:
            StateManager.SwitchState(this.basicMode);
            break;
          case 1:
            StateManager.SwitchState(this.frenzyMode);
            break;
          case 2:
            StateManager.SwitchState(this.bottomUp);
            break;
          case 3:
            StateManager.SwitchState(this.topDown);
            break;
          case 4:
            StateManager.SwitchState(this.drawingMode);
            break;
          case 5:
            StateManager.SwitchState(this.swapMode);
            break;
        }
      }
    }
  }
}
module.exports = new MenuState();
