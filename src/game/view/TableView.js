const { TileView } = require('../view/TileView');
const util = require('../utils/Util');

class TableView {
  constructor(controller, table) {
    this.controller = controller;
    this.table = table;
    this.tileView = new TileView(controller);

    this.startCollapse = false;
    this.startSwap = false;
    this.collapseMat = new Set();
  }
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  printTable() {
    for (let col = 0; col < this.table.inner.length; col++) {
      for (let row = 0; row < this.table.inner[col].length; row++) {
        if (this.table.inner[col][row] !== undefined) {
          this.tileView.printTile(this.table.inner[col][row].sprite);
        }
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  clearTable() {
    for (let col = 0; col < this.table.inner.length; col++) {
      for (let row = 0; row < this.table.inner[col].length; row++) {
        this.tileView.clearTile(this.table.inner[col][row].sprite);
      }
    }
  }

  animateCollapse(deltaTime) {
    let count = 0;

    for (let col of this.collapseMat) {
      for (let row = 0; row < this.table.inner[col].length; row++) {
        if (this.table.inner[col][row] !== undefined) {
          if (Math.abs(this.table.inner[col][row].sprite.y - util.getYPos(row)) > 86 / 6) {
            this.table.inner[col][row].sprite.y +=
              (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
          } else {
            this.table.inner[col][row].sprite.y = util.getYPos(row);
            count++;
          }
        }
      }
    }

    let totalItem = 0;

    for (let col of this.collapseMat) {
      totalItem += this.table.inner[col].length;
    }

    if (count == totalItem) {
      this.startCollapse = false;
    }
  }

  animateSwap(deltaTime, clickedTile) {
    let colStart = clickedTile.indexStart[0];
    let rowStart = clickedTile.indexStart[1];

    let colEnd = clickedTile.indexEnd[0];
    let rowEnd = clickedTile.indexEnd[1];

    let count = 0;

    if (Math.abs(this.table.inner[colStart][rowStart].sprite.x - util.getXPos(colStart)) > 86 / 6) {
      if (colStart < colEnd) {
        this.table.inner[colStart][rowStart].sprite.x -=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }

      if (colStart > colEnd) {
        this.table.inner[colStart][rowStart].sprite.x +=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }
    } else {
      this.table.inner[colStart][rowStart].sprite.x = util.getXPos(colStart);
      count++;
    }

    if (Math.abs(this.table.inner[colEnd][rowEnd].sprite.x - util.getXPos(colEnd)) > 86 / 6) {
      if (colStart < colEnd) {
        this.table.inner[colEnd][rowEnd].sprite.x +=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }

      if (colStart > colEnd) {
        this.table.inner[colEnd][rowEnd].sprite.x -=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }
    } else {
      this.table.inner[colEnd][rowEnd].sprite.x = util.getXPos(colEnd);
      count++;
    }
    if (Math.abs(this.table.inner[colStart][rowStart].sprite.y - util.getYPos(rowStart)) > 86 / 6) {
      if (rowStart < rowEnd) {
        this.table.inner[colStart][rowStart].sprite.y +=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }

      if (rowStart > rowEnd) {
        this.table.inner[colStart][rowStart].sprite.y -=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }
    } else {
      this.table.inner[colStart][rowStart].sprite.y = util.getYPos(rowStart);
      count++;
    }

    if (Math.abs(this.table.inner[colEnd][rowEnd].sprite.y - util.getYPos(rowEnd)) > 86 / 6) {
      if (rowStart < rowEnd) {
        this.table.inner[colEnd][rowEnd].sprite.y -=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }

      if (rowStart > rowEnd) {
        this.table.inner[colEnd][rowEnd].sprite.y +=
          (86 / 6) * GameDefine.GAME_SPEED_BASE * deltaTime;
      }
    } else {
      this.table.inner[colEnd][rowEnd].sprite.y = util.getYPos(rowEnd);
      count++;
    }

    if (count === 4) {
      this.startSwap = false;
    }
  }

  getAnimateMat(combo) {
    this.collapseMat = new Set();

    for (let value of combo.values()) {
      this.collapseMat.add(value[0]);
    }
  }

  printManyTile(arr) {
    arr.forEach(cur => this.tileView.printTile(cur.sprite));
  }

  clearManyTile(arr) {
    arr.forEach(cur => this.tileView.clearTile(cur.sprite));
  }

  drawSuggest(combo) {
    for (let tile of combo.keys()) {
      let graphic = new PIXI.Graphics();
      graphic.beginFill();
      graphic.lineStyle(1, 0xfeeb77, 1);
      graphic.drawRoundedRect(tile.sprite.x - 86 / 2, tile.sprite.y - 86 / 2, 86, 86, 15);
      graphic.endFill();
      graphic.alpha = 0.1;
      this.controller.addChild(graphic);
    }
  }

  explode(combo, tileType) {
    for (let tile of combo.keys()) {
      if ((tileType === 'special' || tileType === 'frenzy') && Config.currentSoundFX === 0) {
        Config.sound.correctSpecial.play();
      }
      if (tileType === 'normal' && Config.currentSoundFX === 0) {
        Config.sound.correctNormal.play();
      }

      if (Config.currentExplode === 0) {
        this.tileView.explode(tile.sprite);
      }

      this.tileView.clearTile(tile.sprite);
    }
  }
}

module.exports = { TableView };
