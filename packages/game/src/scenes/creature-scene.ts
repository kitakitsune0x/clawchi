import Phaser from "phaser";
import type { ClawchiState } from "@clawchi/types";

interface CreatureStats {
  hunger: number;
  health: number;
  mood: number;
  energy: number;
  vibe: number;
  state: ClawchiState;
}

const CREATURE_COLORS: Record<ClawchiState, number> = {
  egg: 0xfbbf24,
  alive: 0xef4444,
  sick: 0x94a3b8,
  dead: 0x475569,
};

const BG_PARTICLES = [0x1e3a5f, 0x2d5a87, 0x1a4a6e];

export class CreatureScene extends Phaser.Scene {
  private creature!: Phaser.GameObjects.Container;
  private body!: Phaser.GameObjects.Ellipse;
  private leftEye!: Phaser.GameObjects.Ellipse;
  private rightEye!: Phaser.GameObjects.Ellipse;
  private mouth!: Phaser.GameObjects.Arc;
  private leftClaw!: Phaser.GameObjects.Polygon;
  private rightClaw!: Phaser.GameObjects.Polygon;
  private glowFx!: Phaser.GameObjects.Ellipse;
  private bubbles: Phaser.GameObjects.Arc[] = [];
  private currentState: ClawchiState = "egg";
  private stats: CreatureStats = {
    hunger: 50,
    health: 50,
    mood: 50,
    energy: 50,
    vibe: 50,
    state: "egg",
  };

  constructor() {
    super({ key: "CreatureScene" });
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.createBubbles();
    this.createCreature(cx, cy);
    this.playIdleAnimation();
  }

  private createBubbles() {
    const { width, height } = this.cameras.main;
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(20, height - 20);
      const r = Phaser.Math.Between(3, 8);
      const color = Phaser.Utils.Array.GetRandom(BG_PARTICLES);
      const bubble = this.add.arc(x, y, r, 0, 360, false, color, 0.3);
      this.bubbles.push(bubble);
      this.tweens.add({
        targets: bubble,
        y: y - Phaser.Math.Between(40, 100),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        yoyo: false,
        onRepeat: () => {
          bubble.setPosition(
            Phaser.Math.Between(20, width - 20),
            Phaser.Math.Between(height * 0.6, height)
          );
          bubble.setAlpha(0.3);
        },
      });
    }
  }

  private createCreature(cx: number, cy: number) {
    this.creature = this.add.container(cx, cy);

    this.glowFx = this.add.ellipse(0, 0, 120, 100, 0xef4444, 0.1);
    this.creature.add(this.glowFx);

    this.body = this.add.ellipse(0, 0, 90, 75, CREATURE_COLORS.alive);
    this.creature.add(this.body);

    const highlight = this.add.ellipse(-15, -18, 30, 15, 0xffffff, 0.15);
    this.creature.add(highlight);

    this.leftEye = this.add.ellipse(-18, -10, 14, 16, 0xffffff);
    this.rightEye = this.add.ellipse(18, -10, 14, 16, 0xffffff);
    const leftPupil = this.add.ellipse(-16, -8, 7, 9, 0x1e293b);
    const rightPupil = this.add.ellipse(20, -8, 7, 9, 0x1e293b);
    const leftGlint = this.add.ellipse(-14, -12, 3, 3, 0xffffff);
    const rightGlint = this.add.ellipse(22, -12, 3, 3, 0xffffff);
    this.creature.add([
      this.leftEye,
      this.rightEye,
      leftPupil,
      rightPupil,
      leftGlint,
      rightGlint,
    ]);

    this.mouth = this.add.arc(0, 8, 10, 0, 180, false, 0x1e293b);
    this.creature.add(this.mouth);

    const clawPoints = [0, 0, -12, -20, -4, -12, 0, -24, 4, -12, 12, -20];
    this.leftClaw = this.add.polygon(-55, 5, clawPoints, 0xef4444);
    this.leftClaw.setOrigin(0.5, 0.5);
    this.rightClaw = this.add.polygon(55, 5, clawPoints, 0xef4444);
    this.rightClaw.setOrigin(0.5, 0.5);
    this.rightClaw.setScale(-1, 1);
    this.creature.add([this.leftClaw, this.rightClaw]);

    const leftLeg = this.add.ellipse(-20, 35, 18, 10, 0xdc2626);
    const rightLeg = this.add.ellipse(20, 35, 18, 10, 0xdc2626);
    this.creature.add([leftLeg, rightLeg]);
  }

  private playIdleAnimation() {
    this.tweens.add({
      targets: this.creature,
      y: this.creature.y - 8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: this.leftClaw,
      angle: -15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: this.rightClaw,
      angle: 15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      delay: 200,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: this.glowFx,
      alpha: 0.2,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  updateStats(stats: CreatureStats) {
    this.stats = stats;
    const prevState = this.currentState;
    this.currentState = stats.state;

    const color = CREATURE_COLORS[stats.state] || CREATURE_COLORS.alive;
    this.body.setFillStyle(color);
    this.leftClaw.setFillStyle(color);
    this.rightClaw.setFillStyle(color);
    this.glowFx.setFillStyle(color, 0.1);

    if (prevState !== stats.state) {
      this.applyStateEffects(stats.state);
    }
  }

  private applyStateEffects(state: ClawchiState) {
    this.tweens.killAll();

    switch (state) {
      case "alive": {
        const avg =
          (this.stats.hunger +
            this.stats.health +
            this.stats.mood +
            this.stats.energy +
            this.stats.vibe) /
          5;
        const speed = avg > 70 ? 1000 : 1500;
        const bounce = avg > 70 ? 14 : 8;

        this.tweens.add({
          targets: this.creature,
          y: this.cameras.main.centerY - bounce,
          duration: speed,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        this.playIdleAnimation();
        break;
      }
      case "sick":
        this.creature.setRotation(0);
        this.tweens.add({
          targets: this.creature,
          y: this.cameras.main.centerY + 20,
          angle: -5,
          duration: 3000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        break;
      case "dead":
        this.tweens.add({
          targets: this.creature,
          angle: 90,
          y: this.cameras.main.centerY + 40,
          duration: 2000,
          ease: "Bounce.easeOut",
        });
        this.creature.setAlpha(0.5);
        break;
      case "egg":
        this.tweens.add({
          targets: this.creature,
          scaleX: 0.7,
          scaleY: 0.8,
          duration: 500,
          ease: "Back.easeOut",
        });
        this.tweens.add({
          targets: this.creature,
          angle: { from: -3, to: 3 },
          duration: 400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        break;
    }
  }
}
