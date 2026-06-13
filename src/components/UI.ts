import { GameScene } from "@/scenes/GameScene";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;



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
		this.panel.setAlpha(0.5);

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
	}
}
