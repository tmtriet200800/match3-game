const { GameMode } = require('../utils/GameMode');
const util = require('../utils/Util');

const { SuggestView } = require('../view/SuggestView');
const { BaseFeature } = require('../utils/BaseFeature');
const { SpecialFeature } = require('../utils/SpecialFeature');

class BasicMode extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    this.state = new GameMode(this);
    this.state.setupData('bgm1');
    this.state.setupView();

    this.pauseTime = 0;
    this.suggestState = false;
    this.suggestCombo = new Map();

    this.specialTile = [];

    this.baseFeature = new BaseFeature(this.table);
    this.specialFeature = new SpecialFeature(this.table);

    this.suggestView = new SuggestView(this);
    this.suggestView.setup();

    this.table.generateTable();
    this.tableView.printTable();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm1.stop();
    Config.sound.countdown.stop();
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {
    if (this.timer >= 0 && this.openMenu === false) {
      this.gameTime += deltaTime;
      this.pauseTime += deltaTime;

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

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  TouchHandler(event) {
    if (Input.IsTouchDown(event) && this.timer > 0) {
      if (this.openMenu === false && this.tableView.startCollapse === false) {
        //---------------------------Generate Small Menu---------------------------//
        if (event.target === this.smallMenuView.menuButton) {
          this.smallMenuView.genSmallMenu();
          this.openMenu = true;
          Config.sound.countdown.stop();
        }

        //---------------------------Reset Suggest View---------------------------//
        this.pauseTime = 0;
        this.suggestState = false;
        this.suggestView.turnOff(this.suggestCombo);

        //------------------------Find combo--------------------------//
        let tileType = util.getTileType(Input.touchX, Input.touchY, this.table);
        if (tileType === undefined) {
          return;
        }

        let combo = new Map();

        if (tileType === 'normal') {
          combo = this.baseFeature.getCombo(Input.touchX, Input.touchY);

          if (combo === undefined) {
            if (Config.currentSoundFX === 0) {
              Config.sound.wrong.play();
            }

            return;
          }

          if (combo.size >= 5) {
            let [normalTile, specialTile] = this.baseFeature.generateSpecial(
              Input.touchX,
              Input.touchY,
              this.table,
              combo
            );
            this.specialTile.push(specialTile);

            this.tileView.clearTile(normalTile.sprite);
            this.tileView.printTile(specialTile.sprite);
          }
        }

        if (tileType === 'special') {
          combo = this.specialFeature.getCombo(Input.touchX, Input.touchY);
          this.specialFeature.updateSpecial(this.specialTile);
        }

        //------------------------Update score view--------------------------//
        Config.currentScore += util.caculateScore(combo);
        this.scoreView.updateText(Config.currentScore);

        //------------------------Remove and fill new tile--------------------------//
        const addedTile = this.baseFeature.removeAndFill(combo);
        addedTile.forEach(cur => {
          this.tileView.printTile(cur.sprite);
        });
        this.tableView.explode(combo, tileType);

        //------------------------Get animation material and emiting animation signal--------------------------//
        this.tableView.getAnimateMat(combo);
        this.tableView.startCollapse = true;
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
module.exports = { BasicMode };
