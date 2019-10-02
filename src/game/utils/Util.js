class Util {
  constructor() {
    this.tableSize = Config.tableSize;
    this.tileSize = Config.tileSize;
    this.tableX = Config.tablePos.x;
    this.tableY = Config.tablePos.y;
  }

  getCol(xPos) {
    let col = Math.round((xPos - this.tableX) / this.tileSize) + parseInt(this.tableSize / 2);
    return col;
  }

  getRow(yPos) {
    let row = -(Math.round((yPos - this.tableY) / this.tileSize) - parseInt(this.tableSize / 2));
    return row;
  }

  getXPos(col) {
    return this.tableX - this.tileSize * (parseInt(this.tableSize / 2) - col);
  }

  getYPos(row) {
    return this.tableY - this.tileSize * (-parseInt(this.tableSize / 2) + row);
  }

  caculateScore(combo) {
    return combo.size * 15;
  }

  validCol(col) {
    if (col < 0 || col >= this.tableSize) {
      return false;
    }

    return true;
  }

  validRow(row) {
    if (row < 0 || row >= this.tableSize) {
      return false;
    }

    return true;
  }

  createSprite(xPos, yPos, texture) {
    let newSprite = new PIXI.Sprite(texture);
    newSprite.anchor.set(0.5, 0.5);
    newSprite.position.set(xPos, yPos);

    return newSprite;
  }

  createText(xPos, yPos, text, style = Config.textStyle) {
    let newText = new PIXI.Text(text, style);
    newText.anchor.set(0.5, 0.5);
    newText.position.set(xPos, yPos);

    return newText;
  }

  getTileType(xPos, yPos, table) {
    let [col, row] = this.getIndex(xPos, yPos);

    if (this.validCol(col) === true && this.validRow(row) === true) {
      return table.inner[col][row].type;
    }
    return undefined;
  }

  getIndex(xPos, yPos) {
    let col = this.getCol(xPos);
    let row = this.getRow(yPos);

    return [col, row];
  }

  emptyArr(arr) {
    arr.length = 0;
  }

  checkTime(gameTime, realTime) {
    if (Math.abs(gameTime - realTime) < 0.01) {
      return true;
    }

    return false;
  }
}

module.exports = new Util();
