const { def } = require('../Config');

class Tile {
  constructor() {
    // this.sprite = sprite;
    // this.type = type;
    //this.sprite = new this.sprite();
    this.size = Config.tileSize;
    this.die = 0;
    this.speed = 86;

    this.mask = new PIXI.Graphics();
    this.mask.beginFill(0xde3249);
    this.mask.drawRect(
      Config.tablePos.x - (Config.tableSize * 86) / 2,
      Config.tablePos.y - (Config.tableSize * 86) / 2,
      Config.tableSize * 86,
      Config.tableSize * 86 + Config.tileSize + 20
    );
    this.mask.endFill();
  }

  setPos(xPos, yPos) {
    this.sprite.interactive = true;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.position.set(xPos, yPos);
    this.sprite.mask = this.mask;
  }
}

class NormalTile extends Tile {
  constructor() {
    super();
    this.type = 'normal';
    this.color = def.get(Math.floor(Math.random() * Config.numTile[Config.currentNumTile]));
    this.sprite = new PIXI.Sprite(Config.texture[this.color]);
  }
}

class FrenzyTile extends Tile {
  constructor() {
    super();
    this.type = 'frenzy';
    this.sprite = new PIXI.Sprite(Config.texture[this.type]);
  }
}

class SpecialTile extends Tile {
  constructor() {
    super();
    this.type = 'special';
    this.sprite = new PIXI.Sprite(Config.texture[this.type]);
  }
}

module.exports = { NormalTile, SpecialTile, FrenzyTile };
