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

    this.add.text(400, 480, 'Press ENTER for Hard Mode', {
      fontSize: '18px',
      fill: '#cc2222'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('HardModeScene'));
    this.input.once('pointerdown', () => this.scene.start('GameScene'));
  }
}
