class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.add.text(400, 240, 'Pancake Stacker', {
      fontSize: '48px',
      fill: '#7a4a1e'
    }).setOrigin(0.5);

    this.add.text(400, 320, 'Press SPACE or Click to Start', {
      fontSize: '22px',
      fill: '#555'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.once('pointerdown', () => this.scene.start('GameScene'));
  }
}
