import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { CementEater } from "../GameFunctions/Items/CementEater";
import { Echolocator } from "../GameFunctions/Items/Echolocator";

export class BuffDisplay extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public owner: Player;
    private r1: number = 0;
    private r2: number = 0;

    private spc: Phaser.GameObjects.Sprite;
    private sprb: Phaser.GameObjects.Sprite;

    private tg: Phaser.GameObjects.Text;
    private ts: Phaser.GameObjects.Text;

    private gfxg: Phaser.GameObjects.Graphics;
    private gfxs: Phaser.GameObjects.Graphics;
    private gfxn: Phaser.GameObjects.Graphics;
    constructor(scene: GameScene, x: number, y: number, p: Player){
        super(scene,x,y);
        this.scene = scene;
        this.owner = p;
        this.spc = this.scene.add.sprite(0,0,"cementblocks");
        this.sprb = this.scene.add.sprite(0,0,"reactivering");
        this.add(this.spc);
        this.add(this.sprb)

        this.spc.setVisible(false);
        this.sprb.setVisible(false);

        this.gfxg = this.scene.add.graphics();
        this.add(this.gfxg);
        this.gfxs = this.scene.add.graphics();
        this.add(this.gfxs);
        this.gfxn = this.scene.add.graphics();
        this.add(this.gfxn);

        this.tg = this.scene.addText({
			x: -128,
			y: -138,
			size: 28,
			color: "yellow",
			text: "",
		});

        this.ts = this.scene.addText({
			x: 128,
			y: -138,
			size: 28,
			color: "lightpink",
			text: "",
		});
        this.tg.setOrigin(0.5,0.5);
        this.ts.setOrigin(0.5,0.5);

        this.add(this.tg);
        this.add(this.ts);

        this.r1 = (-1*Math.PI) + (Math.random()*2*Math.PI);
        this.r2 = (-1*Math.PI) + (Math.random()*2*Math.PI);
    }

    update(t: number, d: number){
        this.updateCement(t,d);
        this.updateEcho();
        if(this.owner.reactive){
            this.sprb.setVisible(true);
            this.r2 += 2*Math.PI*d/1000;
            if(this.r2 > (Math.PI)){
                this.r2 -= 2*Math.PI;
            }
            this.sprb.setAngle(this.r2*(180/Math.PI));
        } else {
            this.sprb.setVisible(false);
        }
    }

    updateEcho(){
        let a = this.owner.findItem("Echolocator");
        if(a instanceof Echolocator){

            if(a.spellBoost <= 0){
                this.gfxs.clear();
                this.ts.setText("");
            } else {
                this.gfxs.clear();
                this.gfxs.lineStyle(6,0xD6E5FF,1);
                this.gfxs.fillStyle(0x390075,0.8);
                this.gfxs.beginPath();
                this.gfxs.slice(128,-138,30,0,2*Math.PI,false,0.01);
                this.gfxs.fillPath();
                this.gfxs.closePath();
                this.gfxs.beginPath();
                this.gfxs.arc(128,-138,30,0,2*Math.PI*a.spellStackTimer[0]/a.spellStackTimer[1],false,0.01);
                this.gfxs.strokePath();
                this.gfxs.closePath();
                this.ts.setText(""+a.spellBoost);
            }
            

            if(a.gunBoost <= 0){
                this.gfxg.clear();
                this.tg.setText("");
            } else {
                this.gfxg.clear();
                this.gfxg.lineStyle(6,0xD6E5FF,1);
                this.gfxg.fillStyle(0x19241B,0.8);
                this.gfxg.beginPath();
                this.gfxg.slice(-128,-138,30,0,2*Math.PI,false,0.01);
                this.gfxg.fillPath();
                this.gfxg.closePath();
                this.gfxg.beginPath();
                this.gfxg.arc(-128,-138,30,0,2*Math.PI*a.gunStackTimer[0]/a.gunStackTimer[1],false,0.01);
                this.gfxg.strokePath();
                this.gfxg.closePath();
                this.tg.setText(""+a.gunBoost);
            }

        }
    }

    updateCement(t: number, d: number){
        let a = this.owner.findItem("Eat Cement");
        if(a instanceof CementEater){
            if(a.cement >= 1) {
                this.spc.setFrame(a.cement - 1);
                this.spc.setVisible(true);
                this.r1 += -1*Math.PI*d/1000;
                if(this.r1 < (-1*Math.PI)){
                    this.r1 += 2*Math.PI;
                }
                this.spc.setAngle(this.r1*(180/Math.PI));
            } else {
                this.spc.setVisible(false);
            }
        }
    }
}
