class HardModeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HardModeScene' });
  }

  create() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.playLeft = 120;
    this.playRight = 680;
    this.stackBaseY = 535;
    this.pancakeHeight = 18;
    this.minPancakeWidth = 46;
    this.scrollLineY = 245;
    this.maxTime = 30;
    this.elapsedTime = 0;
    this.score = 0;
    this.dropLocked = false;
    this.gameEnded = false;
    this.direction = 1;
    this.currentSpeed = 280;

    this.drawKitchen();
    this.createHud();
    this.createStackBase();
    this.spawnMovingPancake();

    this.input.keyboard.on('keydown-SPACE', this.dropPancake, this);
    this.input.on('pointerdown', this.dropPancake, this);
  }

  update(time, delta) {
    if (this.gameEnded) {
      return;
    }

    this.elapsedTime += delta / 1000;
    const remaining = Math.max(0, this.maxTime - this.elapsedTime);
    const stage = this.getStageSettings();
    this.timerText.setText(`TIME ${Math.ceil(remaining)}`);
    this.stageText.setText(`TIER ${stage.tier}`);
    this.timeBar.width = 220 * (remaining / this.maxTime);

    if (remaining <= 0) {
      this.endGame();
      return;
    }

    if (this.movingPancake && !this.dropLocked) {
      this.movingPancake.x += this.direction * this.currentSpeed * (delta / 1000);

      const halfWidth = this.movingPancake.displayWidth / 2;
      if (this.movingPancake.x - halfWidth <= this.playLeft) {
        this.movingPancake.x = this.playLeft + halfWidth;
        this.direction = 1;
      } else if (this.movingPancake.x + halfWidth >= this.playRight) {
        this.movingPancake.x = this.playRight - halfWidth;
        this.direction = -1;
      }
    }
  }

  drawKitchen() {
    this.add.rectangle(400, 300, 800, 600, 0xf8dfbd);
    this.add.rectangle(400, 320, 600, 470, 0xd47a7a, 0.2);
    this.add.rectangle(400, 565, 800, 70, 0x2a211c);
    this.add.rectangle(400, 70, 650, 100, 0x251f1d);
    this.add.text(400, 70, 'HARD MODE', {
      fontSize: '36px',
      fill: '#ff6b6b',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.rectangle(400, 326, 590, 420, 0x2f3430);
    this.add.rectangle(400, 326, 545, 380, 0xe9f2d0);

    for (let x = this.playLeft; x <= this.playRight; x += 40) {
      this.add.line(0, 0, x, 140, x, 515, 0xd3dcb8, 0.35).setOrigin(0);
    }

    for (let y = 155; y <= 500; y += 34) {
      this.add.line(0, 0, this.playLeft, y, this.playRight, y, 0xd3dcb8, 0.35).setOrigin(0);
    }
  }

  createHud() {
    this.scoreText = this.add.text(95, 28, 'STACK 0', {
      fontSize: '22px',
      fill: '#ead6b4',
      fontStyle: 'bold'
    });

    this.timerText = this.add.text(650, 28, 'TIME 30', {
      fontSize: '22px',
      fill: '#ead6b4',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.stageText = this.add.text(400, 28, 'TIER 1', {
      fontSize: '22px',
      fill: '#ff6b6b',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.add.rectangle(650, 62, 224, 12, 0x8a5a32).setOrigin(0.5);
    this.timeBar = this.add.rectangle(540, 62, 220, 8, 0xff4444).setOrigin(0, 0.5);

    this.add.text(400, 562, 'SPACE / CLICK', {
      fontSize: '20px',
      fill: '#ead6b4',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  createStackBase() {
    this.stackPieces = [];
    this.topX = 400;
    this.topWidth = 240;
    this.topY = this.stackBaseY;

    this.add.rectangle(this.topX, this.stackBaseY + 22, 285, 18, 0xe7e0cd);
    const plate = this.add.ellipse(this.topX, this.stackBaseY + 20, 315, 42, 0xf5f0db);
    plate.setStrokeStyle(4, 0xd0c4a9);

    this.addPancakePiece(this.topX, this.stackBaseY, this.topWidth, 0xe6ad55);
  }

  spawnMovingPancake() {
    const stage = this.getStageSettings();
    const width = Math.min(this.topWidth, stage.width);
    const y = Math.max(135, this.topY - 48);

    this.currentSpeed = stage.speed;
    this.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    const startX = this.direction > 0
      ? this.playLeft + width / 2
      : this.playRight - width / 2;

    this.movingPancake = this.createPancake(startX, y, width, 0xf2bd65);
    this.movingPancake.setDepth(5);
  }

  getStageSettings() {
    if (this.elapsedTime < 6) {
      return { tier: 1, width: 165, speed: 280 };
    }

    if (this.elapsedTime < 12) {
      return { tier: 2, width: 120, speed: 360 };
    }

    if (this.elapsedTime < 20) {
      return { tier: 3, width: 74, speed: 450 };
    }

    return { tier: 4, width: 46, speed: 550 };
  }

  dropPancake() {
    if (this.gameEnded || this.dropLocked || !this.movingPancake) {
      return;
    }

    this.dropLocked = true;
    const dropped = this.movingPancake;
    this.movingPancake = null;

    const dropTargetY = this.topY - this.pancakeHeight + 1;
    this.tweens.add({
      targets: dropped,
      y: dropTargetY,
      duration: 135,
      ease: 'Quad.easeIn',
      onComplete: () => this.resolveDrop(dropped)
    });
  }

  resolveDrop(dropped) {
    const currentLeft = dropped.x - dropped.displayWidth / 2;
    const currentRight = dropped.x + dropped.displayWidth / 2;
    const stackLeft = this.topX - this.topWidth / 2;
    const stackRight = this.topX + this.topWidth / 2;
    const overlapLeft = Math.max(currentLeft, stackLeft);
    const overlapRight = Math.min(currentRight, stackRight);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth < Math.max(4, dropped.displayWidth * 0.06)) {
      dropped.destroy();
      this.flashMessage('TRY AGAIN!');
      this.queueNextPancake();
      return;
    }

    const perfect = Math.abs(dropped.x - this.topX) <= 5;
    const newWidth = perfect ? dropped.displayWidth : overlapWidth;
    const newX = perfect ? this.topX : overlapLeft + overlapWidth / 2;
    const newY = dropped.y;

    if (!perfect) {
      this.showCutOffs(dropped, overlapLeft, overlapRight);
    }

    dropped.destroy();
    this.addPancakePiece(newX, newY, newWidth, perfect ? 0xffd17b : 0xf0b85f);
    this.topX = newX;
    this.topWidth = newWidth;
    this.topY = newY;
    this.score += perfect ? 2 : 1;
    this.scoreText.setText(`STACK ${this.score}`);
    this.flashMessage(perfect ? 'PERFECT!' : 'TRIMMED!');

    if (this.topY < this.scrollLineY) {
      this.scrollStackForRoom(() => this.queueNextPancake());
      return;
    }

    this.queueNextPancake();
  }

  queueNextPancake() {
    this.time.delayedCall(210, () => {
      this.dropLocked = false;
      this.spawnMovingPancake();
    });
  }

  scrollStackForRoom(onComplete) {
    const scrollDistance = this.scrollLineY - this.topY;
    this.topY += scrollDistance;

    this.tweens.add({
      targets: this.stackPieces,
      y: `+=${scrollDistance}`,
      duration: 260,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.stackPieces = this.stackPieces.filter((piece) => {
          if (piece.y > this.stackBaseY + 55) {
            piece.destroy();
            return false;
          }

          return true;
        });

        onComplete();
      }
    });
  }

  addPancakePiece(x, y, width, color) {
    const piece = this.createPancake(x, y, width, color);
    this.stackPieces.push(piece);
    return piece;
  }

  createPancake(x, y, width, color) {
    const pancake = this.add.rectangle(0, 0, width, this.pancakeHeight, color, 1);
    pancake.setStrokeStyle(3, 0x9a632e);

    const highlight = this.add.rectangle(0, -5, width * 0.84, 4, 0xffdda1, 0.75);
    const group = this.add.container(x, y, [pancake, highlight]);
    group.setSize(width, this.pancakeHeight);
    return group;
  }

  showCutOffs(dropped, overlapLeft, overlapRight) {
    const leftEdge = dropped.x - dropped.displayWidth / 2;
    const rightEdge = dropped.x + dropped.displayWidth / 2;

    if (overlapLeft > leftEdge) {
      this.fallAway(leftEdge + (overlapLeft - leftEdge) / 2, dropped.y, overlapLeft - leftEdge);
    }

    if (rightEdge > overlapRight) {
      this.fallAway(overlapRight + (rightEdge - overlapRight) / 2, dropped.y, rightEdge - overlapRight);
    }
  }

  fallAway(x, y, width) {
    const crumb = this.createPancake(x, y, width, 0xd99145);
    crumb.setDepth(4);
    this.tweens.add({
      targets: crumb,
      y: y + 80,
      x: x + Phaser.Math.Between(-35, 35),
      angle: Phaser.Math.Between(-70, 70),
      alpha: 0,
      duration: 450,
      ease: 'Quad.easeIn',
      onComplete: () => crumb.destroy()
    });
  }

  flashMessage(message) {
    if (this.messageText) {
      this.messageText.destroy();
    }

    this.messageText = this.add.text(400, 112, message, {
      fontSize: '26px',
      fill: '#5d3217',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.messageText,
      alpha: 0,
      y: 92,
      duration: 500,
      onComplete: () => {
        if (this.messageText) {
          this.messageText.destroy();
          this.messageText = null;
        }
      }
    });
  }

  endGame() {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
}
