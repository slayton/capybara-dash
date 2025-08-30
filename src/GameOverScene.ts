import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    private score: number = 0;

    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data: { score: number }) {
        this.score = data.score || 0;
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        
        // Game over text
        this.add.text(centerX, 150, 'GAME OVER', {
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Score text
        this.add.text(centerX, 220, `Final Score: ${this.score}`, {
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);

        // Restart button
        const restartButton = this.add.rectangle(centerX, 300, 200, 50, 0x4CAF50);
        const restartText = this.add.text(centerX, 300, 'PLAY AGAIN', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Make button interactive
        restartButton.setInteractive({ useHandCursor: true });
        
        restartButton.on('pointerover', () => {
            restartButton.setFillStyle(0x45a049);
        });

        restartButton.on('pointerout', () => {
            restartButton.setFillStyle(0x4CAF50);
        });

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Also allow pressing space or enter to restart
        this.input.keyboard!.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard!.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }
}