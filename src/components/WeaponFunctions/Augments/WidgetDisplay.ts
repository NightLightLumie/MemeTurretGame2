import { UpgradeScene } from "@/scenes/UpgradeScene";

export class WidgetDisplay extends Phaser.GameObjects.Container{
    public scene: UpgradeScene;
    private spr: Phaser.GameObjects.Sprite;
    public txt: Phaser.GameObjects.Text;
    constructor(scene: UpgradeScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.spr = this.scene.add.sprite(0,0,"widgetbutton");
        this.add(this.spr);
        this.spr.setAngle(90);
        this.add(this.spr);
        this.spr.setScale(2);
        this.txt = this.scene.addText({
			x: 0,
			y: 256,
			size: 40,
			color: "white",
			text: "Widgets: " + this.scene.masterData.widgets,
		});
        this.txt.setOrigin(0.5,0);
        this.add(this.txt);
    }
}