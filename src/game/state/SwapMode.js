const util = require('../utils/Util');

const { SwapFeature } = require('../utils/SwapFeature');
const { GameMode } = require('../utils/GameMode');

const { BaseFeature } = require('../utils/BaseFeature');

class SwapMode extends PIXI.Container {
  constructor() {
    super();

    APP.AddChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    this.state = new GameMode(this);
    this.state.setupData('bgm6');
    this.state.setupView();

    this.startAnalyse = false;
    this.comBack = false;

    this.baseFeature = new BaseFeature(this.table);
    this.swapFeature = new SwapFeature(this.table, this);
    this.swapFeature.setup();

    this.table.generateTable();
    this.swapFeature.checkTable();
    this.tableView.printTable();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm6.stop();
    Config.sound.countdown.stop();
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {
    if (this.timer >= 0 && this.openMenu === false) {
      this.gameTime += deltaTime;
      //this.pauseTime += deltaTime;

      //---------------------------Animate Collapse Down Tile---------------------------//
      if (this.tableView.startCollapse == true) {
        this.tableView.animateCollapse(deltaTime);
      }

      //---------------------------Animate Swap---------------------------//
      if (this.tableView.startSwap === true) {
        this.tableView.animateSwap(deltaTime, this.swapFeature.clickedTile);

        if (this.tableView.startSwap === false) {
          if (this.comBack == false) {
            if (
              this.swapFeature.checkCol() === undefined &&
              this.swapFeature.checkRow() === undefined &&
              this.swapFeature.clickedTile.data.length > 0
            ) {
              this.swapFeature.swapData();
              this.tableView.startSwap = true;
              this.comBack = true;
            } else {
              this.swapFeature.resestData();
              this.startAnalyse = true;
            }
          } else {
            this.swapFeature.resestData();
            this.comBack = false;
          }
        }
      }

      if (util.checkTime(this.gameTime, 1)) {
        this.timerView.updateTime(this.timer--);
        this.gameTime = 0;
      }

      if (this.startAnalyse === true) {
        if (this.tableView.startCollapse === false) {
          //---------------------------Check Match 3 for Collum---------------------------//
          let comboCol = this.swapFeature.checkCol();

          if (comboCol !== undefined) {
            const addedTile = this.swapFeature.removeAndFill(comboCol);
            addedTile.forEach(cur => {
              this.tileView.printTile(cur.sprite);
            });

            this.tableView.explode(comboCol, 'normal');

            Config.currentScore += util.caculateScore(comboCol);
            this.scoreView.updateText(Config.currentScore);

            this.tableView.getAnimateMat(comboCol);
            this.tableView.startCollapse = true;
          }
        }

        if (this.tableView.startCollapse === false) {
          //---------------------------Check Match 3 for Row---------------------------//
          let comboRow = this.swapFeature.checkRow();

          if (comboRow === undefined) {
            this.startAnalyse = false;
          } else {
            const addedTile = this.swapFeature.removeAndFill(comboRow);
            addedTile.forEach(cur => {
              this.tileView.printTile(cur.sprite);
            });

            this.tableView.explode(comboRow, 'normal');

            Config.currentScore += util.caculateScore(comboRow);
            this.scoreView.updateText(Config.currentScore);

            this.tableView.getAnimateMat(comboRow);
            this.tableView.startCollapse = true;
          }
        }
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
    if (Input.IsTouchDown(event) && this.timer > 0) {
      if (this.openMenu === false && this.tableView.startCollapse === false) {
        //---------------------------Generate sub-menu---------------------------//
        if (event.target === this.smallMenuView.menuButton) {
          this.smallMenuView.genSmallMenu();
          this.openMenu = true;
          Config.sound.countdown.stop();
        }

        //---------------------------Get swap tile position---------------------------//
        this.tableView.startSwap = this.swapFeature.getData(Input.touchX, Input.touchY);
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
  }
}
module.exports = { SwapMode };
