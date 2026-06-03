class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const score = (this.scene.settings.data && this.scene.settings.data.score) || 0;

    this.add.text(400, 240, 'Game Over!', {
      fontSize: '48px',
      fill: '#7a4a1e'
    }).setOrigin(0.5);

    this.add.text(400, 310, `Score: ${score}`, {
      fontSize: '32px',
      fill: '#555'
    }).setOrigin(0.5);

    this.add.text(400, 380, 'Press R or Click to Play Again', {
      fontSize: '22px',
      fill: '#555'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => this.scene.start('MenuScene'));
    this.input.once('pointerdown', () => this.scene.start('MenuScene'));
  }
}
