const { GameMode } = require('../utils/GameMode');
const util = require('../utils/Util');

const { DrawingFeature } = require('../utils/DrawingFeature');
const { SuggestView } = require('../view/SuggestView');

const { BaseFeature } = require('../utils/BaseFeature');
class DrawingMode extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    this.state = new GameMode(this);
    this.state.setupData('bgm5');
    this.state.setupView();

    this.pauseTime = 0;
    this.suggestState = false;
    this.suggestCombo = new Map();
    this.drawState = {
      start: false,
      progress: false,
      finish: false,
      error: false
    };

    this.curCol = 0;
    this.curRow = 0;
    this.preCol = -1;
    this.preRow = -1;

    this.baseFeature = new BaseFeature(this.table);
    this.drawingFeature = new DrawingFeature(this.table, this);

    this.suggestView = new SuggestView(this);
    this.suggestView.setup();

    this.drawingFeature.setup();

    this.table.generateTable();
    this.tableView.printTable();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm5.stop();
    Config.sound.countdown.stop();
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {
    if (this.timer >= 0 && this.openMenu === false) {
      this.gameTime += deltaTime;
      if (this.drawState.progress == false) {
        this.pauseTime += deltaTime;
      }

      //---------------------------Animate Collapse Down Tile---------------------------//
      if (this.tableView.startCollapse == true) {
        this.tableView.animateCollapse(deltaTime);
      }

      //---------------------------Animate Suggest View---------------------------//
      if (util.checkTime(this.gameTime, 0.5) && this.suggestState === true) {
        this.suggestView.turnOn(this.suggestCombo);
        setTimeout(() => this.suggestView.turnOff(this.suggestCombo), 500);
      }

      //---------------------------Update Time View---------------------------//
      if (util.checkTime(this.gameTime, 1)) {
        this.timerView.updateTime(this.timer--);
        this.gameTime = 0;
      }

      if (util.checkTime(this.pauseTime, 2) && this.suggestState === false) {
        this.suggestCombo = this.baseFeature.suggest(this.specialTile);
        this.suggestState = true;
      }
    }

    if (this.timer < 0) {
      StateManager.SwitchState(ResultState);
    }

    if (this.timer < 5 && this.countdown === false) {
      Config.sound.countdown.play();
      this.countdown = true;
    }
  }

  TouchHandler(event) {
    if (this.timer > 0) {
      if (Input.IsTouchDown(event)) {
        if (this.openMenu === false && this.tableView.startCollapse === false) {
          //---------------------------Generate Small Menu---------------------------//
          if (event.target === this.smallMenuView.menuButton) {
            this.smallMenuView.genSmallMenu();
            this.openMenu = true;
            Config.sound.countdown.stop();
          }
        }

        //---------------------------Control sub-menu---------------------------//
        if (this.openMenu === true) {
          if (event.target === this.smallMenuView.buttonView[0]) {
            this.openMenu = false;

            this.smallMenuView.clearMenu();
            for (let i = 0; i < this.children.length; i++) {
              this.children[i].alpha = 1;
            }

            this.countdown = false;
          }

          if (event.target === this.smallMenuView.buttonView[1]) {
            this.children = [];
            this.Load();
          }

          if (event.target === this.smallMenuView.buttonView[2]) {
            StateManager.SwitchState(MenuState);
          }
        }
      }

      if (Input.IsTouchMove(event)) {
        //---------------------------Reset Suggest View---------------------------//
        this.pauseTime = 0;
        this.suggestState = false;
        this.suggestView.turnOff(this.suggestCombo);

        if (this.tableView.startCollapse === false) {
          this.drawState.finish = false;

          this.curCol = util.getCol(Input.touchX + Input.touchDX);
          this.curRow = util.getRow(Input.touchY + Input.touchDY);

          //---------------------------Drawing Function---------------------------//
          if (this.preCol !== this.curCol || this.preRow !== this.curRow) {
            if (this.drawState.error === true) {
              this.drawingFeature.onError(this.drawState);
            }

            if (this.drawState.progress === true) {
              this.drawingFeature.onProgress(this.curCol, this.curRow, this.drawState);
            }

            if (this.drawState.progress === false) {
              this.drawState.start = true;
            }

            if (this.drawState.start === true) {
              this.drawingFeature.onStart(this.curCol, this.curRow);

              this.drawState.start = false;
              this.drawState.progress = true;
            }
          }

          this.preCol = this.curCol;
          this.preRow = this.curRow;
        }
      } else {
        if (this.drawState.finish == false) {
          this.drawState.start = false;
          this.drawState.progress = false;
          this.drawState.error = false;
          this.drawState.finish = true;

          let combo = this.drawingFeature.onFinish();

          if (combo === undefined) {
            Config.sound.wrong.play();
            return;
          }

          //------------------------Update score view--------------------------//
          Config.currentScore += util.caculateScore(combo);
          this.scoreView.updateText(Config.currentScore);

          //------------------------Remove and fill new tile--------------------------//
          const addedTile = this.baseFeature.removeAndFill(combo);
          addedTile.forEach(cur => {
            this.tileView.printTile(cur.sprite);
          });
          this.tableView.explode(combo, 'normal');

          //------------------------Get animation material and emiting animation signal--------------------------//
          this.tableView.getAnimateMat(combo);
          this.tableView.startCollapse = true;
        }
      }
    }
  }
}
module.exports = { DrawingMode };
