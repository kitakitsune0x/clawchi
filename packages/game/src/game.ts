import Phaser from "phaser";
import { CreatureScene } from "./scenes/creature-scene";

export interface GameConfig {
  parent: string | HTMLElement;
  width?: number;
  height?: number;
  stats?: Record<string, number | string>;
  onReady?: () => void;
}

export class ClawchiGame {
  private game: Phaser.Game;
  private scene: CreatureScene | null = null;

  constructor(config: GameConfig) {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: config.parent,
      width: config.width || 400,
      height: config.height || 400,
      transparent: true,
      scene: CreatureScene,
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 0 }, debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      callbacks: {
        postBoot: (game) => {
          this.scene = game.scene.getScene("CreatureScene") as CreatureScene;
          if (config.stats) {
            this.scene.updateStats(config.stats as any);
          }
          config.onReady?.();
        },
      },
    });
  }

  updateStats(stats: Record<string, number | string>) {
    this.scene?.updateStats(stats as any);
  }

  destroy() {
    this.game.destroy(true);
  }
}
