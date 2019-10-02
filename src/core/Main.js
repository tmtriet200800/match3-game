require('pixi.js');
global.Sound = require('pixi-sound').default;

global.GameDefine = require('../GameDefine');
global.GameConfig = require('../Config');
global.Input = require('./Input');
global.StateManager = require('./StateManager');
global.APP = require('./Application');
global.StateSample = require('../game/StateSample');

global.LoadGame = require('../game/state/LoadGame');
global.MenuState = require('../game/state/MenuState');
global.ResultState = require('../game/state/ResultState');

function GameLoop(deltaTime) {
  deltaTime = deltaTime / (60 * APP.ticker.speed);
  APP.Update(deltaTime);
  APP.Render();
}

window.main = function() {
  APP.Init(GameLoop);
  StateManager.PushState(LoadGame);
};
