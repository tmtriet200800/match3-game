class TileView {
  constructor(controller) {
    this.controller = controller;
  }

  printTile(sprite) {
    this.controller.addChild(sprite);
  }

  clearTile(sprite) {
    this.controller.removeChild(sprite);
  }

  explode(sprite) {
    let animateTest = new PIXI.extras.AnimatedSprite(Config.texture.explosion);
    animateTest.anchor.set(0.5, 0.5);
    animateTest.position.set(sprite.x, sprite.y);
    animateTest.animationSpeed = 0.3;
    animateTest.play();

    this.controller.addChild(animateTest);

    animateTest.onLoop = () => {
      animateTest.destroy();
    };
  }
}

module.exports = { TileView };
