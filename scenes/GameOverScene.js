class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const data = this.scene.settings.data || {};
    const score = data.score || 0;
    const name = data.name || 'Anonymous';
    const mode = data.mode || 'Normal';

    const newIndex = this._saveScore(name, score, mode);
    const entries = this._getLeaderboard();

    // Background
    this.add.rectangle(400, 300, 800, 600, 0xf8dfbd);

    // Header bar
    this.add.rectangle(400, 55, 800, 110, 0x251f1d);
    this.add.text(400, 35, 'GAME OVER', {
      fontSize: '38px',
      fill: '#ff9966',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(400, 80, `${name}  ·  ${mode.toUpperCase()}  ·  ${score} pts`, {
      fontSize: '17px',
      fill: '#ead6b4',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Leaderboard panel
    this.add.rectangle(400, 335, 590, 380, 0x2f3430);
    this.add.rectangle(400, 335, 554, 354, 0xfff8ee);

    // Leaderboard title
    this.add.text(400, 140, '── TOP SCORES ──', {
      fontSize: '19px',
      fill: '#7a4a1e',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Column headers
    const headerY = 167;
    [
      [148, '#'],
      [258, 'NAME'],
      [448, 'SCORE'],
      [568, 'MODE']
    ].forEach(([x, label]) => {
      this.add.text(x, headerY, label, {
        fontSize: '13px',
        fill: '#9a632e',
        fontFamily: 'Courier New',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    });
    this.add.rectangle(400, headerY + 13, 540, 1, 0xd0b890);

    // Leaderboard rows (top 8)
    entries.slice(0, 8).forEach((entry, i) => {
      const rowY = 197 + i * 28;
      const isNew = i === newIndex;
      const textColor = isNew ? '#7a1e1e' : '#3a2a1a';
      const bgColor = isNew ? 0xffeedd : null;

      if (isNew) {
        this.add.rectangle(400, rowY, 538, 24, bgColor);
      }

      const style = { fontSize: '15px', fill: textColor, fontFamily: 'Courier New', fontStyle: isNew ? 'bold' : 'normal' };
      this.add.text(148, rowY, `${i + 1}.`, style).setOrigin(0.5);
      this.add.text(228, rowY, entry.name.substring(0, 13), style).setOrigin(0, 0.5);
      this.add.text(448, rowY, `${entry.score}`, style).setOrigin(0.5);
      this.add.text(568, rowY, entry.mode.toUpperCase(), {
        ...style,
        fill: entry.mode === 'Hard' ? '#cc3333' : '#2255aa'
      }).setOrigin(0.5);
    });

    // Footer
    this.add.rectangle(400, 565, 800, 70, 0x2a211c);
    this.add.text(400, 562, 'R / CLICK  ─  PLAY AGAIN', {
      fontSize: '20px',
      fill: '#ead6b4',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => this.scene.start('MenuScene'));
  }

  _saveScore(name, score, mode) {
    const entries = JSON.parse(localStorage.getItem('pancakeLeaderboard') || '[]');
    const newEntry = { name, score, mode };
    entries.push(newEntry);
    entries.sort((a, b) => b.score - a.score);
    const newIndex = entries.indexOf(newEntry);
    if (entries.length > 10) entries.length = 10;
    localStorage.setItem('pancakeLeaderboard', JSON.stringify(entries));
    return newIndex < 10 ? newIndex : -1;
  }

  _getLeaderboard() {
    return JSON.parse(localStorage.getItem('pancakeLeaderboard') || '[]');
  }
}
