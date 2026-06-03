class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.add.text(400, 300, 'GameScene', {
      fontSize: '28px',
      fill: '#7a4a1e'
    }).setOrigin(0.5);
  }
}
