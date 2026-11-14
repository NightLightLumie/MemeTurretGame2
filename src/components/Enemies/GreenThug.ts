import { GameScene } from "@/scenes/GameScene";
import { GibEffect } from "../GibEffect";
import { Thug } from "./Thug";
import { BoneEffect } from "../Graphics/BoneEffect";

export class GreenThug extends Thug{
    constructor(scene:GameScene,x:number,y:number, mode: string = "x", ofs: number = 0, seek: string = "x", diff: number = -1){
        super(scene,x,y,mode,ofs,seek,diff);
        this.aCD = [0, 200];
    }

    attack(t: number, d: number){
        if(this.aCD[0] <= 0) {
            if(this.playerDist() < (this.scene.player.radius+this.radius+this.aRange))
            {
                this.scene.sound.play("turret_hit", {volume: 0.5});
                this.scene.addPlayerEffect(new BoneEffect(this.scene, this.scene.player.x, this.scene.player.y, this.scene.player));
                this.aCD[0] = this.aCD[1];   
                this.scene.player.takeHit(75*this.debuff*this.buff*Math.trunc(1+(0.05*this.difficulty)));
            }
        } else {
            this.aCD[0] -= d;
            if(this.aCD[0] <= 0) {
                this.aCD[0] = 0;
            }
        }
    }

    gib(){
        for(let n = 0; n <= 8; n++){
            let gib = new GibEffect(this.scene,this.x,this.y,"f1-"+n,[-1200+Math.random()*2400,-1200+Math.random()*2400],
            [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000);
            gib.setTint(0x70C27C);
            this.scene.addPartEffect(gib);
        }
    }

    die(){
        if(!this.deleteFlag){
            this.gib();
            this.scene.playSound("dead",0.5);
            if(Math.random() < this.scene.getDropChance("gthug")){
                this.scene.dropBox();
            }
            if(Math.random() < this.scene.getWidgetChance("gthug")){
                this.scene.dropWidget();
            }
            this.processOnKill();
        }
        this.deleteFlag = true;
    }
}