const util = require('../utils/Util');

const { SuggestView } = require('../view/SuggestView');
const { EnergyView } = require('../view/EnergyView');
const { GameMode } = require('../utils/GameMode');
const { BaseFeature } = require('../utils/BaseFeature');
const { SpecialFeature } = require('../utils/SpecialFeature');
const { FrenzyFeature } = require('../utils/FrenzyFeature');

class FrenzyMode extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    this.state = new GameMode(this);
    this.state.setupData('bgm2');
    this.state.setupView();

    this.pauseTime = 0;
    this.suggestState = false;
    this.suggestCombo = new Map();

    this.frenzyTime = 0;
    this.frenzyState = {
      start: false,
      progress: false,
      complete: false
    };
    this.energy = 0;

    this.frenzyTile = [];
    this.specialTile = [];

    this.baseFeature = new BaseFeature(this.table);
    this.specialFeature = new SpecialFeature(this.table);
    this.frenzyFeature = new FrenzyFeature(this.table);

    this.suggestView = new SuggestView(this);
    this.suggestView.setup();

    this.table.generateTable();
    this.tableView.printTable();

    this.energyView = new EnergyView(this);
    this.energyView.setup();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    Config.sound.bgm2.stop();
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

        if (this.tableView.startCollapse === false) {
          if (this.frenzyState.start === true) {
            //-------------------------Frenzy Work-----------------------//

            this.frenzyFeature.specialToFrenzy(this.specialTile, this.frenzyTile);
            let oldTile = this.frenzyFeature.init(this.frenzyTile);

            this.tableView.clearManyTile(this.specialTile);
            this.tableView.clearManyTile(oldTile);

            util.emptyArr(this.specialTile);
            this.tableView.printManyTile(this.frenzyTile);

            this.frenzyState.start = false;
            this.frenzyState.progress = true;
          } else if (this.frenzyState.progress === true) {
            let newTile = this.frenzyFeature.reset(this.frenzyTile);
            this.tableView.printManyTile(newTile);
            this.tableView.clearManyTile(this.frenzyTile);

            let oldTile = this.frenzyFeature.generateFrenzy(this.frenzyTile);
            this.tableView.printManyTile(this.frenzyTile);
            this.tableView.clearManyTile(oldTile);
          }
        }
      }

      if (util.checkTime(this.pauseTime, 2) && this.suggestState === false) {
        this.suggestCombo = this.baseFeature.suggest(this.specialTile);
        this.suggestState = true;
      }

      //---------------------------Animate Energy Bar---------------------------//
      if (this.frenzyState.start === true || this.frenzyState.progress === true) {
        this.energy -= (deltaTime * 20) / 100;
        this.energyView.updateMask(this.energy);
      }

      if (this.energy < 0 && this.frenzyState.progress === true) {
        //---------------------------Change frenzy tile to special tile---------------------------//
        this.frenzyFeature.complete(this.specialTile, this.frenzyTile);

        this.tableView.clearManyTile(this.frenzyTile);
        util.emptyArr(this.frenzyTile);

        this.tableView.printManyTile(this.specialTile);

        this.frenzyState.progress = false;
        this.frenzyState.complete = true;
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
      if (this.openMenu === false && this.tableView.startCollapse == false) {
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
            Config.sound.wrong.play();
            return;
          }

          if (combo.size >= 5) {
            if (this.frenzyState.progress === false) {
              let [normalTile, specialTile] = this.baseFeature.generateSpecial(
                Input.touchX,
                Input.touchY,
                this.table,
                combo
              );
              this.specialTile.push(specialTile);

              this.tileView.clearTile(normalTile.sprite);
              this.tileView.printTile(specialTile.sprite);
            } else {
              let [normalTile, frenzyTile] = this.baseFeature.generateFrenzy(
                Input.touchX,
                Input.touchY,
                this.table,
                combo
              );
              this.frenzyTile.push(frenzyTile);

              this.tileView.clearTile(normalTile.sprite);
              this.tileView.printTile(frenzyTile.sprite);
            }
          }
        }

        if (tileType === 'special') {
          combo = this.specialFeature.getCombo(Input.touchX, Input.touchY);
          this.specialFeature.updateSpecial(this.specialTile);
        }

        if (tileType === 'frenzy') {
          combo = this.frenzyFeature.getCombo(this.frenzyTile);
          util.emptyArr(this.frenzyTile);
        }

        //------------------------Update score view--------------------------//
        Config.currentScore += util.caculateScore(combo);
        this.scoreView.updateText(Config.currentScore);

        //------------------------Update energy bar--------------------------//
        if (this.frenzyState.progress === false) {
          if (this.energy < 1) {
            this.energy += combo.size / 100;
            this.energyView.updateMask(this.energy);
          }
        }

        if (this.energy >= 1) {
          this.frenzyState.start = true;
          Config.sound.frenzy.play();
        }

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
module.exports = { FrenzyMode };
