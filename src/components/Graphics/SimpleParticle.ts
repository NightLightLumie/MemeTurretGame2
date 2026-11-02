import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "./Effect";

export class SimpleParticle extends Effect {
    private spr: Phaser.GameObjects.Rectangle;
    private scaling: number[];
    private fade: number[];
    private timer: number[];
    private spin: number;
    private v: number[];
    constructor(scene: BaseScene, x: number, y: number, size: number = 200, sc: number[] = [1,1], alp: number[] = [1,1], color: number = 0xFFFFFF, time: number = 2000, spin: number = 360, v: number[] = [0,-800], sprsc: number[] = [1,1]){
        super(scene,x,y);
        this.spr = this.scene.add.rectangle(0,0,size,size,color,alp[0]);
        this.scaling = sc;
        this.fade = alp;
        this.v = v;
        this.timer = [0,time];
        this.spr.setScale(sprsc[0],sprsc[1]);
        this.spr.setOrigin(0.5,0.5);
        this.add(this.spr);
        this.spin = spin;
        if(Math.random() < 0.5){
            this.spin *= -1;
        }
    }

    update(t: number, d: number){
        if(this.timer[0] < this.timer[1]){
            this.timer[0] += d;
            this.x += this.v[0]*d/1000;
            this.y += this.v[1]*d/1000;
            this.angle += this.spin*d/1000;
            if(this.timer[0] >= this.timer[1]){
                this.setAlpha(this.fade[1]);
                this.setScale(this.scaling[1]);
                this.deleteFlag = true;
            } else {
                this.setAlpha(this.fade[0] + ((this.timer[0]/this.timer[1])*(this.fade[1]-this.fade[0])));
                this.setScale(this.scaling[0] + ((this.timer[0]/this.timer[1])*(this.scaling[1]-this.scaling[0])));  
            }
        }
    }


}