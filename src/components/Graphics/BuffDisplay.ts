import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { CementEater } from "../GameFunctions/Items/CementEater";

export class BuffDisplay extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public owner: Player;
    private r1: number = 0;
    private r2: number = 0;

    private spc: Phaser.GameObjects.Sprite;
    private sprb: Phaser.GameObjects.Sprite;
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

        this.r1 = (-1*Math.PI) + (Math.random()*2*Math.PI);
        this.r2 = (-1*Math.PI) + (Math.random()*2*Math.PI);
    }

    update(t: number, d: number){
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
}
