import { DamageInstance, GameScene } from "@/scenes/GameScene";
import { Effect } from "./Effect";
import { Item } from "../GameFunctions/Items/Item";
import { Target } from "../Target";
import { BasicEffect } from "./BasicEffect";

export class StickyTracer extends Effect{
    public scene: GameScene;
    private spr: Phaser.GameObjects.Sprite;
    private tmr: number[] = [0,100];
    private tTimer: number = 3000;
    private cFrame: number = 0;
    private dmg: number = 0;
    private gdmg: number = 0;
    private stDist: number[] = [];
    private attached: Target;
    private rad: number = 120;
    constructor(scene: GameScene, x: number, y: number, dmg: number[], att: Target){
        super(scene,x,y);

        this.scene = scene;
        if(Math.random()< 0.5){
            this.cFrame = 1;
        }
        this.spr = this.scene.add.sprite(0,0,"stickylight");
        this.spr.setFrame(this.cFrame);
        this.add(this.spr);
        this.attached = att;
        this.stDist = [(-1*att.radius)+(Math.random()*2*att.radius),(-1*att.radius)+(Math.random()*2*att.radius)];
        this.dmg = dmg[0];
        this.gdmg = dmg[1];
    }

    update(t: number, d: number){
        if(this.tmr[0] < this.tmr[1]){
            this.tmr[0] += d;
            if(this.tmr[0] >= this.tmr[1]){
                this.tmr[0] = 0;
                this.advanceFrame();
            }
        }

        if(this.attached != null){
            this.x = this.attached.x+this.stDist[0];
            this.y = this.attached.y+this.stDist[1];
        }

        if(this.tTimer > 0){
            this.tTimer -= d;
            if(this.tTimer <= 0) {
                this.setVisible(false);
                this.explode();
            }
        }
    }
    
    advanceFrame(){
        if(this.cFrame == 1){
            this.cFrame = 0;
        } else {
            this.cFrame = 1;
        }
        this.spr.setFrame(this.cFrame);
    }

    explode(){
        let lx: DamageInstance[] = [];
        lx.push({
            amt: this.dmg,
            type: "spell",
            tags: ["aoe"],
        });
        if(this.gdmg > 0){
            lx.push({
                amt: this.gdmg,
                type: "gun",
                tags: ["aoe"],
            });
        }
        this.scene.addHitEffect(new BasicEffect(this.scene,"exp",this.x,this.y,25,15,false,2,Math.random()*360,[2*this.rad/256,2*this.rad/256]));
        this.scene.simpleExplode(lx,this.x,this.y,128);
    }
}