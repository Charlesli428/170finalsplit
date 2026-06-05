const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#f5e6ca',
scene: [MenuScene, GameScene, HardModeScene, GameOverScene]
};

const game = new Phaser.Game(config);
