const util = require('../utils/Util');
const { ResultView } = require('../view/ResultView');
const { SmallMenuView } = require('../view/SmallMenuView');

const { BasicMode } = require('../state/BasicMode');
const { FrenzyMode } = require('../state/FrenzyMode');
const { BottomUp } = require('../state/BottomUp');
const { TopDown } = require('../state/TopDown');
const { DrawingMode } = require('../state/DrawingMode');
const { SwapMode } = require('../state/SwapMode');

class ResultState extends PIXI.Container {
  constructor() {
    super();

    this.resultView = new ResultView(this);
    this.smallMenuView = new SmallMenuView(this);
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

    this.menuOption = ['Restart', 'Back to menu'];

    this.resultView.genText();
    this.resultView.genScore(Config.currentScore);

    this.resultView.genRestartBtn();
    this.resultView.genBackBtn();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {}

  TouchHandler(event) {
    if (Input.IsTouchDown(event)) {
      if (event.target === this.resultView.restartView) {
        switch (Config.currentMode) {
          case 0:
            StateManager.SwitchState(new BasicMode());
            break;
          case 1:
            StateManager.SwitchState(new FrenzyMode());
            break;
          case 2:
            StateManager.SwitchState(new BottomUp());
            break;
          case 3:
            StateManager.SwitchState(new TopDown());
            break;
          case 4:
            StateManager.SwitchState(new DrawingMode());
            break;
          case 5:
            StateManager.SwitchState(new SwapMode());
            break;
        }
      }

      if (event.target === this.resultView.backView) {
        StateManager.SwitchState(MenuState);
      }
    }
  }
}
module.exports = new ResultState();
