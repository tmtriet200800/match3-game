const asset = require('../Config').asset;
global.Config = require('../Config').Config;

class LoadGame extends PIXI.Container {
  constructor() {
    super();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Load() {
    APP.AddChild(this);

    const loader = PIXI.loader;

    loader.on('progress', this.LoadProgressHandler.bind(this));
    loader.on('error', this.LoadErrorHandler.bind(this));
    loader.on('complete', this.LoadCompleteHandler.bind(this));

    for (let [key, value] of asset) {
      if (key !== 'explosion') {
        loader.add(key, value);
      } else {
        for (let i = 0; i < value.length; i++) {
          loader.add(`explosion_${i}`, value[i]);
        }
      }
    }
    loader.load();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Unload() {
    APP.RemoveChild(this);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  Update(deltaTime) {}

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  LoadProgressHandler(loader, resource) {
    console.log('LoadProgressHandler: ' + resource.name);

    if (asset.has(resource.name) === true) {
      Config.texture[resource.name] = resource.texture;
    } else {
      Config.texture.explosion[parseInt(resource.name[10])] = resource.texture;
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  LoadErrorHandler(error) {
    console.log('LoadErrorHandler: ' + error);
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  LoadCompleteHandler() {
    console.log('Complete Loading data');
    //console.log(MenuState);
    StateManager.SwitchState(MenuState);
  }
}
module.exports = new LoadGame();
