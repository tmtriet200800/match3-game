const util = require('../utils/Util');
const { GameMode } = require('../utils/GameMode');

const { BaseFeature } = require('../utils/BaseFeature');
const { SpecialFeature } = require('../utils/SpecialFeature');
const { TopDownFeature } = require('../utils/TopDownFeature');
const { BottomUpFeature } = require('../utils/BottomUpFeature');

class TopDown extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    this.state = new GameMode(this);
    this.state.setupData('bgm4');
    this.state.setupView();

    this.specialTile = [];
    this.generatedTile = [];
    this.loose = false;

    this.baseFeature = new BaseFeature(this.table);
    this.specialFeature = new SpecialFeature(this.table);
    this.bottomUpFeature = new BottomUpFeature(this.table);
    this.topDownFeature = new TopDownFeature(this.table);

    let newTile = this.topDownFeature.generateTop(this.generatedTile);
    this.tileView.printTile(newTile.sprite);

    this.topDownFeature.init();
    this.tableView.printTable();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm4.stop();
    Config.sound.countdown.stop();
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {
    if (this.timer >= 0 && this.openMenu === false && this.loose == false) {
      this.gameTime += deltaTime;

      //---------------------------Animate Collapse Down Tile---------------------------//
      if (this.tableView.startCollapse == true) {
        this.tableView.animateCollapse(deltaTime);
      }

      if (util.checkTime(this.gameTime, 0.5)) {
        //---------------------------Top Down Feature Work---------------------------//

        if (this.generatedTile.length < this.table.size) {
          let newTile = this.topDownFeature.generateTop(this.generatedTile);
          this.tileView.printTile(newTile.sprite);
        } else {
          this.topDownFeature.addRowTop(this.generatedTile);

          for (let i = 0; i < 7; i++) {
            this.tableView.collapseMat.add(i);
          }

          this.tableView.startCollapse = true;
          this.generatedTile = [];
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

      if (this.timer < 0 || this.loose === true) {
        StateManager.SwitchState(ResultState);
      }

      if (this.timer < 5 && this.countdown === false) {
        Config.sound.countdown.play();
        this.countdown = true;
      }
    }
  }

  TouchHandler(event) {
    if (Input.IsTouchDown(event) && this.loose === false && this.timer > 0) {
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

            this.tileView.clearTile(normalTile.sprite);
            this.tileView.printTile(specialTile.sprite);

            this.specialTile.push(normalTile);
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
module.exports = { TopDown };
