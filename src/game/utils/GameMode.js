const { Table } = require('../model/Table');

const { BackgroundView } = require('../view/BackgroundView');
const { ScoreView } = require('../view/ScoreView');
const { TimerView } = require('../view/TimerView');
const { TableView } = require('../view/TableView');
const { TileView } = require('../view/TileView');
const { SmallMenuView } = require('../view/SmallMenuView');

class GameMode {
  constructor(controller) {
    this.controller = controller;
  }

  setupData(sound) {
    this.controller.table = new Table();

    this.controller.gameTime = 0;
    this.controller.timer = Config.timerMode[Config.currentTimer];
    this.controller.openMenu = false;
    this.controller.countdown = false;
    Config.currentScore = 0;

    if (Config.currentBgSound === 0) {
      Config.sound[sound].stop();
      Config.sound[sound].play();
      Config.sound[sound].loop = true;
      Config.sound[sound].volume = 0.3;
    }
  }

  setupView() {
    this.controller.tableView = new TableView(this.controller, this.controller.table);
    this.controller.tileView = new TileView(this.controller);

    this.controller.bgView = new BackgroundView(this.controller);
    this.controller.scoreView = new ScoreView(this.controller);
    this.controller.timerView = new TimerView(this.controller);
    this.controller.smallMenuView = new SmallMenuView(this.controller);

    this.controller.bgView.setup();
    this.controller.scoreView.setup(Config.currentScore);
    this.controller.timerView.setup(this.controller.gameTime);

    this.controller.smallMenuView.generateMenuIcon();
  }
}
module.exports = { GameMode };
