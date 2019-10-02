const util = require('../utils/Util');
const { GameMode } = require('../utils/GameMode');

const { BaseFeature } = require('../utils/BaseFeature');
const { SpecialFeature } = require('../utils/SpecialFeature');
const { BottomUpFeature } = require('../utils/BottomUpFeature');

const { SuggestView } = require('../view/SuggestView');

class BottomUp extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    this.state = new GameMode(this);
    this.state.setupData('bgm3');
    this.state.setupView();

    this.loose = false;

    this.specialTile = [];
    this.generatedTile = [];

    this.baseFeature = new BaseFeature(this.table);
    this.specialFeature = new SpecialFeature(this.table);
    this.bottomUpFeature = new BottomUpFeature(this.table);

    let newTile = this.bottomUpFeature.generateBottom(this.generatedTile);
    this.tileView.printTile(newTile.sprite);

    this.bottomUpFeature.init();
    this.tableView.printTable();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm3.stop();
    Config.sound.countdown.stop();
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {
    if (this.timer >= 0 && this.loose === false && this.openMenu === false) {
      this.gameTime += deltaTime;
      this.pauseTime += deltaTime;

      //---------------------------Animate Collapse Down Tile---------------------------//
      if (this.tableView.startCollapse == true) {
        this.tableView.animateCollapse(deltaTime);
      }

      if (util.checkTime(this.gameTime, 0.5)) {
        //---------------------------Bottom Up Feature Work---------------------------//

        if (this.generatedTile.length < this.table.size) {
          let newTile = this.bottomUpFeature.generateBottom(this.generatedTile);
          this.tileView.printTile(newTile.sprite);
        } else {
          this.bottomUpFeature.addRowBottom(this.generatedTile);
          this.generatedTile = [];

          for (let i = 0; i < this.children.length; i++) {
            this.children[i].alpha = 1;
          }

          this.tableView.clearTable();
          this.tableView.printTable();
        }
      }

      if (util.checkTime(this.gameTime, 1)) {
        this.timerView.updateTime(this.timer--);
        this.gameTime = 0;
      }

      for (let col = 0; col < this.table.inner.length; col++) {
        if (this.table.inner[col].length > this.table.size) {
          this.loose = true;
        }
      }
    }

    if (this.timer < 0 || this.loose === true) {
      StateManager.SwitchState(ResultState);
    }

    if (this.timer < 5 && this.countdown === false) {
      Config.sound.countdown.play();
      this.countdown = true;
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  TouchHandler(event) {
    if (Input.IsTouchDown(event) && this.loose == false && this.timer > 0) {
      //---------------------------Generate small-menu---------------------------//
      if (this.openMenu === false && this.tableView.startCollapse == false) {
        if (event.target === this.smallMenuView.menuButton) {
          this.smallMenuView.genSmallMenu();
          this.openMenu = true;
          Config.sound.countdown.stop();
        }

        //------------------------Find combo--------------------------//

        let tileType = util.getTileType(Input.touchX, Input.touchY, this.table);

        if (tileType === undefined) {
          return;
        }
        let combo = new Map();

        if (tileType === 'normal') {
          combo = this.baseFeature.getCombo(Input.touchX, Input.touchY);

          if (combo === undefined) {
            Config.sound.wrong.play();
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

        this.bottomUpFeature.remove(combo);

        this.tableView.explode(combo, tileType);

        //------------------------Get animation material and emiting animation signal--------------------------//
        this.tableView.getAnimateMat(combo);
        this.tableView.startCollapse = true;
      }

      //---------------------------Control sub-menu---------------------------//
      if (this.openMenu === true) {
        Config.sound.countdown.stop();

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
module.exports = { BottomUp };
