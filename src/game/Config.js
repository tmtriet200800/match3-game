const def = new Map();
def.set(0, 'blue');
def.set(1, 'green');
def.set(2, 'pink');
def.set(3, 'yellow');
def.set(4, 'purple');
def.set(5, 'gray');
def.set(6, 'orange');
def.set(7, 'red');

const asset = new Map();
asset.set('blue', 'src/data/game/tile-blue.png');
asset.set('green', 'src/data/game/tile-green.png');
asset.set('pink', 'src/data/game/tile-pink.png');
asset.set('yellow', 'src/data/game/tile-yellow.png');
asset.set('purple', 'src/data/game/tile-purple.png');
asset.set('gray', 'src/data/game/tile-gray.png');
asset.set('orange', 'src/data/game/tile-orange.png');
asset.set('red', 'src/data/game/tile-red.png');
asset.set('frenzy', 'src/data/game/tile-frenzy.png');
asset.set('special', 'src/data/game/tile-special.png');
asset.set('background', 'src/data/common/background.jpg');
asset.set('frenzy-bar', 'src/data/game/frenzy-bar.png');
asset.set('ui-brand', 'src/data/game/ui-brand.png');
asset.set('timer-score', 'src/data/game/timer-score.jpg');
asset.set('timer-symbol', 'src/data/game/timer-symbol.png');
asset.set('score-symbol', 'src/data/game/score-symbol.png');
asset.set('arrow-left', 'src/data/common/arrow-left.png');
asset.set('arrow-right', 'src/data/common/arrow-right.png');
asset.set('play-now', 'src/data/common/play-now.png');
asset.set('menu-button', 'src/data/common/menu-button.png');
asset.set('menu-option', 'src/data/common/menu-option.png');

asset.set('explosion', [
  'src/data/game/animation/explosion/anim_1.png',
  'src/data/game/animation/explosion/anim_2.png',
  'src/data/game/animation/explosion/anim_3.png',
  'src/data/game/animation/explosion/anim_4.png',
  'src/data/game/animation/explosion/anim_5.png',
  'src/data/game/animation/explosion/anim_6.png'
]);

class Config {
  constructor() {
    this.tileSize = 86;
    this.tableSize = 7;

    this.texture = {
      blue: null,
      frenzy: null,
      green: null,
      pink: null,
      special: null,
      yellow: null,
      explosion: new Array(6)
    };

    this.textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    this.headerStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 80,
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    });

    this.tablePos = {
      x: APP.GetWidth() / 2,
      y: APP.GetHeight() / 2 + 230
    };

    this.frenzyMode === false;

    this.sound = {
      bgm: Sound.Sound.from('src/data/sound/bgm.m4a'),
      bgm1: Sound.Sound.from('src/data/sound/bgm1.mp3'),
      bgm2: Sound.Sound.from('src/data/sound/bgm2.mp3'),
      bgm3: Sound.Sound.from('src/data/sound/bgm3.mp3'),
      bgm4: Sound.Sound.from('src/data/sound/bgm4.mp3'),
      bgm5: Sound.Sound.from('src/data/sound/bgm5.mp3'),
      bgm6: Sound.Sound.from('src/data/sound/bgm6.mp3'),
      confirm: Sound.Sound.from('src/data/sound/confirm.m4a'),
      correctNormal: Sound.Sound.from('src/data/sound/correct-normal.m4a'),
      correctSpecial: Sound.Sound.from('src/data/sound/correct-special.m4a'),
      frenzy: Sound.Sound.from('src/data/sound/frenzy.m4a'),
      wrong: Sound.Sound.from('src/data/sound/wrong.wav'),
      countdown: Sound.Sound.from('src/data/sound/countdown.mp3')
    };

    this.optionMode = [
      'Game Mode: ',
      'Exploding Animation: ',
      'Background Sound',
      'Sound Effect',
      'Number of tile',
      'Timer'
    ];
    this.smallOption = ['Continue Play', 'Restart', 'Back to Menu'];
    this.gameMode = [
      'Basic Mode',
      'Frenzy Mode',
      'Bottom-Up Mode',
      'Top-Down Mode',
      'Drawing Mode',
      'Swap Mode'
    ];
    this.explodeMode = ['On', 'Off'];
    this.bgSoundMode = ['On', 'Off'];
    this.soundFXMode = ['On', 'Off'];
    this.numTile = [4, 5, 6, 7];
    this.timerMode = [30, 60, 90];

    this.currentMode = 0;
    this.currentExplode = 0;
    this.currentBgSound = 0;
    this.currentSoundFX = 0;
    this.currentNumTile = 0;
    this.currentTimer = 0;

    this.currentScore = 0;
  }
}

module.exports = {
  def,
  asset,
  Config: new Config()
};
