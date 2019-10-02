class GameView {
  constructor(controller) {
    this.controller = controller;

    this.score = 0;
    this.timer = 60;
    this.frenzyPower = 0;
  }
}

module.exports = { GameView };
