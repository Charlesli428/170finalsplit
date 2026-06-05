class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.typedName = '';

    this.add.rectangle(400, 300, 800, 600, 0xf8dfbd);
    this.add.rectangle(400, 55, 800, 110, 0x251f1d);
    this.add.text(400, 55, 'PANCAKE STACKER', {
      fontSize: '38px',
      fill: '#87ecff',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 175, 'YOUR NAME', {
      fontSize: '16px',
      fill: '#7a4a1e',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // drawn input box
    this.add.rectangle(400, 218, 280, 38, 0xfff8ee).setStrokeStyle(2, 0x7a4a1e);
    this.nameDisplay = this.add.text(400, 218, '|', {
      fontSize: '20px',
      fill: '#3a2010',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // blink cursor
    this.time.addEvent({
      delay: 530,
      loop: true,
      callback: this._blinkCursor,
      callbackScope: this
    });

    this.add.rectangle(400, 310, 580, 2, 0xd0b890);

    this.add.text(400, 345, 'SPACE  —  Normal Mode', {
      fontSize: '20px',
      fill: '#3a5a3a',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 385, 'ENTER  —  Hard Mode', {
      fontSize: '20px',
      fill: '#cc2222',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 435, 'type a-z to enter your name', {
      fontSize: '14px',
      fill: '#888'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown', this._handleKey, this);
  }

  _handleKey(event) {
    const key = event.key;

    if (key === 'Backspace') {
      this.typedName = this.typedName.slice(0, -1);
      this._refreshName();
      return;
    }

    if (key === ' ') {
      this._startGame('GameScene');
      return;
    }

    if (key === 'Enter') {
      this._startGame('HardModeScene');
      return;
    }

    if (/^[a-zA-Z]$/.test(key) && this.typedName.length < 16) {
      this.typedName += key;
      this._refreshName();
    }
  }

  _blinkCursor() {
    const text = this.nameDisplay.text;
    if (text.endsWith('|')) {
      this.nameDisplay.setText(text.slice(0, -1) + ' ');
    } else {
      this.nameDisplay.setText(text.slice(0, -1) + '|');
    }
  }

  _refreshName() {
    this.nameDisplay.setText(this.typedName + '|');
  }

  _startGame(sceneKey) {
    this.input.keyboard.off('keydown', this._handleKey, this);
    const name = this.typedName.trim() || 'Anonymous';
    this.scene.start(sceneKey, { name });
  }
}