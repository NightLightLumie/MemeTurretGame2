import { GameScene } from "@/scenes/GameScene";

export class GunUI extends Phaser.GameObjects.Container{

    public scene:GameScene;
    private panel:Phaser.GameObjects.Image;
    private panel2:Phaser.GameObjects.Image;
    private gun:Phaser.GameObjects.Image;

    private barLine: Phaser.GameObjects.Rectangle;
    private barBack: Phaser.GameObjects.Rectangle;
    private title: Phaser.GameObjects.Text;
    private counter: Phaser.GameObjects.Text;


    private spIcon: Phaser.GameObjects.Image;


    private spCDText: Phaser.GameObjects.Text;
    private spBarLine: Phaser.GameObjects.Rectangle;
    private spBarBack: Phaser.GameObjects.Rectangle;

    private spBarCdBack: Phaser.GameObjects.Rectangle;
    private spBarCd: Phaser.GameObjects.Rectangle;

    private offsets: number[];
    constructor(scene:GameScene,x:number,y:number, offsets: number[]){
        super(scene,x,y);
        this.offsets = offsets;
        this.scene = scene;
        this.panel = this.scene.add.image(0,0,"panelred");
        this.add(this.panel);
        this.panel.setOrigin(0.5,0.5)
        this.panel.setDepth(1);

        this.panel2 = this.scene.add.image(0,220,"panelblu");
        this.add(this.panel2);
        this.panel2.setOrigin(0.5,0.5)
        this.panel2.setDepth(2);
        this.gun = this.scene.add.image(0,7,("gun_"+this.scene.player.getActiveWeapon().type));
        this.add(this.gun);
        this.gun.setDepth(10);
        this.gun.setOrigin(0.5,0.5);

        this.title = this.scene.addText({
			x: -330,
			y: -81,
			size: 45,
			color: "#FFFFFF",
			text: this.scene.player.getActiveWeapon().wp.name,
		});
        this.add(this.title);
        this.title.setOrigin(0,0.5)
        this.title.setDepth(11);
        this.title.setAlpha(0);

        this.counter = this.scene.addText({
			x: 80,
			y: 60,
			size: 30,
			color: "#FFFF00",
			text: this.scene.player.getActiveWeapon().curAmmo + "/" + this.scene.player.getActiveWeapon().maxAmmo,
		});
        this.add(this.counter);
        this.title.setDepth(12);

        this.barBack = this.scene.add.rectangle(-200,81,400,20,0x000000,0.75);
        this.barBack.setOrigin(0,0.5);
        this.add(this.barBack);
        this.barLine = this.scene.add.rectangle(-200,81,400,20,0x00FF00,0.75);
        this.barLine.setOrigin(0,0.5);
        this.add(this.barLine);


        this.spIcon = this.scene.add.image(-260,220,"sp_icon");
        this.add(this.spIcon);

        this.spBarBack = this.scene.add.rectangle(-203,250,406,26,0x2B2B2B,0.75);
        this.spBarBack.setOrigin(0,0.5); 
        this.spBarBack.setAlpha(0.75);
        this.add(this.spBarBack);
        this.spBarLine = this.scene.add.rectangle(-200,250,400,20,0xFF80F9,0.75);
        this.spBarLine.setOrigin(0,0.5);
        this.spBarLine.setAlpha(1);
        this.spBarLine.setAlpha(0.75);
        this.add(this.spBarLine);

        this.spBarCdBack = this.scene.add.rectangle(-203,190,406,26,0x2B2B2B,0.75);
        this.spBarCdBack.setOrigin(0,0.5); 
        this.spBarCdBack.setAlpha(0.75);
        this.add(this.spBarCdBack);
        this.spBarCd = this.scene.add.rectangle(-200,190,400,20,0x365EFF,0.75);
        this.spBarCd.setOrigin(0,0.5);
        this.spBarCd.setAlpha(0.75);
        this.add(this.spBarCd);

        this.spCDText = this.scene.addText({
			x: 0,
			y: 192,
			size: 24,
			color: "white",
			text: "READY",
		});
        this.spCDText.setOrigin(0.5,0.5);
        this.add(this.spCDText);

        this.spCDText.setVisible(false);
        this.panel2.setVisible(false);
        this.spIcon.setVisible(false);
        this.spBarLine.setVisible(false);
        this.spBarBack.setVisible(false);
        this.spBarCdBack.setVisible(false); 
        this.spBarCd.setVisible(false);
        

    }

    update(t:number,d:number){
        this.x = this.scene.player.x + this.offsets[0];
        this.y = this.scene.player.y + this.offsets[1];
        let rn = this.scene.player.getActiveWeapon();
        this.counter.setText(rn.curAmmo + " / " + rn.maxAmmo);

        if(rn.loadTime > 0) {
            this.counter.setVisible(false);
            this.barLine.setVisible(true);
            this.barBack.setVisible(true);
            this.barLine.setScale(rn.loadTime/rn.maxLoad,1);
        } else {
            this.counter.setVisible(true);
            this.barLine.setVisible(false);
            this.barBack.setVisible(false);
        }

        if(rn.spCost >= 0){
            this.showSpecialDisplay();
            if(rn.spCD[0] > 0){
                this.spBarCd.setScale(rn.spCD[0]/rn.spCD[1],1);
                this.spBarCdBack.setAlpha(0.75);
                this.spBarCd.setAlpha(0.75);
                this.spCDText.setText("COOLING DOWN...");
                this.spCDText.setAlpha(0.25+(0.25*(1+Math.sin(t/200))));
            } else {
                this.spBarCd.setScale(0,1);
                this.spBarCdBack.setAlpha(0.001);
                this.spBarCd.setAlpha(0.001);
                this.spCDText.setText("READY");
                this.spCDText.setAlpha(1);
            }
            if(rn.curSp < rn.spCap){
                this.spBarLine.setScale(rn.curSp/rn.spCap, 1);
            } else {
                this.spBarLine.setScale(1,1);
            }
            if(rn.curSp > rn.spCost){
                this.spBarBack.setAlpha(0.75);
                this.spBarLine.setAlpha(0.75);
            } else {
                this.spBarBack.setAlpha(0.35);
                this.spBarLine.setAlpha(0.35);
            }
        } else{
            this.hideSpecialDisplay();
        }
    }

    showSpecialDisplay(){
        this.panel2.setVisible(true);
        this.spIcon.setVisible(true);
        this.spBarLine.setVisible(true);
        this.spBarBack.setVisible(true);
        this.spBarCdBack.setVisible(true); 
        this.spBarCd.setVisible(true);
        this.spCDText.setVisible(true);
    }

    hideSpecialDisplay(){
        this.panel2.setVisible(false);
        this.spIcon.setVisible(false);
        this.spBarLine.setVisible(false);
        this.spBarBack.setVisible(false);
        this.spBarCdBack.setVisible(false); 
        this.spBarCd.setVisible(false);
        this.spCDText.setVisible(false);
    }

    refresh(){
        let rt = this.scene.player.getActiveWeapon();
        this.gun.setTexture("gun_"+rt.type);
        this.title.setText(rt.wp.name);
        this.counter.setText(rt.curAmmo + "/" + rt.maxAmmo);
        this.barLine.setScale(rt.loadTime/rt.maxLoad,1);
        if(rt.loadTime > 0) {
            this.counter.setVisible(false);
        } else {
            this.counter.setVisible(true);
            this.barLine.setVisible(false);
            this.barBack.setVisible(false);
        }
    }


}