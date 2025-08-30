import Phaser from 'phaser';
import { GameScene } from './GameScene';
import { GameOverScene } from './GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 400,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1200 },
            debug: false
        }
    },
    scene: [GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 400,
        min: {
            width: 600,
            height: 200
        },
        max: {
            width: 2400,
            height: 800
        }
    },
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    }
};

new Phaser.Game(config);