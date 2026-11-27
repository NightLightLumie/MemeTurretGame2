import { GameScene } from "@/scenes/GameScene";
import { ItemDisplay } from "./ItemDisplay";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;
	private waveTxt: Phaser.GameObjects.Text;
	private lootTxt: Phaser.GameObjects.Text;
	private itemDisplay: ItemDisplay;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;


		const panelHeight = 200;

		this.panel = this.scene.add.container(0, 0);
		this.add(this.panel);

		this.background = this.scene.add.image(0, 0, "hud");
		this.background.setScale(panelHeight / this.background.height);
		this.panel.add(this.background);

		this.text = this.scene.addText({
			x: -70,
			y: 0,
			size: 40,
			color: "#FFFFFF",
			text: "Score: ",
		});
		this.text.setStroke("black", 4);
		this.text.setOrigin(0, 0.5);
		this.panel.add(this.text);

		this.waveTxt = this.scene.addText({
			x: -640,
			y: -1860,
			size: 60,
			color: "#ffb836",
			text: "Wave: " + this.scene.curWave,
		});
		this.waveTxt.setStroke("black", 8);
		this.waveTxt.setOrigin(0, 0.5);
		this.panel.add(this.waveTxt);

		this.lootTxt = this.scene.addText({
			x: -220,
			y: -1860,
			size: 60,
			color: "#ffee00",
			text: "Lootboxes: " + this.scene.tempBoxes.length,
		});
		this.lootTxt.setStroke("black", 8);
		this.lootTxt.setOrigin(0, 0.5);
		this.panel.add(this.lootTxt);

		this.background.setAlpha(0.5);
		this.text.setAlpha(0.5);
		this.waveTxt.setAlpha(0.75);
		this.lootTxt.setAlpha(0.75);
		/*
		this.panel.setPosition(
			this.scene.player.x + 1920 - 380,
			this.scene.player.y + 1080 - 220
		);*/
	}


	update(time: number, delta: number) {
		this.x = this.scene.player.x + 1920 - 420;
		this.y = this.scene.player.y + 1080 - 180;
		this.text.setText("Score: " + this.scene.score +" €");
		this.waveTxt.setText("Wave: " + this.scene.curWave);
		this.lootTxt.setText("Lootboxes: " + this.scene.tempBoxes.length);
	}
}
