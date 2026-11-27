import { Thug } from "./Thug";
import { GameScene } from "@/scenes/GameScene";
import { GibEffect } from "../GibEffect";
import { BoneEffect } from "../Graphics/BoneEffect";

export class MiniThug extends Thug{
    private vmax: number = 0;
    private decel: number = 0;

    constructor(scene:GameScene,x:number,y:number, mode: string = "x", ofs: number = 0, seek: string = "x", diff: number = -1, arad: number = 0){
        super(scene,x,y,"x",ofs,"x",diff);
        this.aCD = [0, 200];
        this.v = 550+(Math.random()*100);
        this.decel = this.v/1.5;
        this.vmax = this.v;
        this.hp = 400;
        this.spr.setTexture("enemy_worm");
        this.setDifficulty(diff);
        this.value = 0;
        this.phase = 50;
        this.colrad = 50;
        this.radius = 50;
        this.setScale(0.5);
        this.radOfs = Math.random()*200000;
        this.setAngle((180/Math.PI)*arad);
        this.a = arad;
        this.value = 0;
        this.unstackFactor = 5*(Math.abs(this.v));
        this.ghosting = true;
        this.invuln = true;
        this.aCD = [0,350];
    }

    rescaleVelocity(n: number){
        this.v = 300+(Math.random()*100);
        this.decel = this.v/1.5;
        this.vmax = this.v;
        this.unstackFactor = 10*(Math.abs(this.v));
    }

    initializeAngle(input: string, offset: number = 0){
    }

    update(t:number,d:number){
        super.update(t,d);
        if(this.boundState == 0){
            this.v -= (this.decel*(d/1000));
            if(this.v <= 0){
                this.v = 0
                this.boundState = 1;
                this.ghosting = false;
                this.invuln = false;
            }
        } else if (this.boundState == 1){
            this.v += (this.decel*(d/1000));
            if(this.v > this.vmax){
                this.v = this.vmax;
            }
        }
        if(this.hitStun <= 0){
            this.hitStun = 0;
            this.mod = 1;
        }
        if(this.hitStun > 0){
            this.hitStun -= d;
            this.mod = 0;
        }
        //this.x += 50;]
        this.radOfs += d;
        if(this.radOfs > 200000){
            this.radOfs -= 200000;
        }
        if(this.boundState == 0){
            this.x += (this.v*Math.cos(this.a)*d/1000);
            this.y += (this.v*Math.sin(this.a)*d/1000);    
        } else {
            let rmod = 1+(Math.sin(this.ofss+(this.radOfs/this.phase)));
            let tmod = 0.25+(rmod*.75);
            this.spr.setScale(0.8+(rmod/5),1+((1-rmod)/10));
            this.x += (this.mod*this.v*tmod*Math.cos(this.a)*d/1000);
            this.y += (this.mod*this.v*tmod*Math.sin(this.a)*d/1000);
        }

        //this.refactor();
        //this.txt.setText("{" + this.unstack[0] + ", "+ this.unstack[1] + "}");
        this.updateUnstacking(t,d);
        this.seek(t,d);
        this.setAngle((180/Math.PI)*this.a);
        this.updateLogs(t,d);
        this.updateBounds();
    }  

    seek(t: number, d: number){
        let c = 0;
        let ap = 0;
        switch(this.boundState){
            case 0: {
                break;
            } case 1: {
                this.a = this.playerAngle();
                this.attack(t,d);
                this.playerCollide();
                break;
            } default: {
                this.a = this.playerAngle();
                break;
            }
        }
    }

    attack(t: number, d: number){
        if((this.aCD[0] <= 0) && (this.boundState != 0)) {
            if(this.playerDist() < (this.scene.player.radius+this.radius+this.aRange))
            {
                this.scene.sound.play("turret_hit_high", {volume: 0.5});
                this.scene.addPlayerEffect(new BoneEffect(this.scene, this.scene.player.x, this.scene.player.y, this.scene.player,2));
                this.aCD[0] = this.aCD[1];   
                this.scene.player.takeHit(20*this.debuff*this.buff*Math.trunc(1+(0.05*this.difficulty)));
            }
        } else {
            if(this.aCD[0] > 0){
                this.aCD[0] -= d;
                if(this.aCD[0] <= 0) {
                    this.aCD[0] = 0;
                }
            }
        }
    }

    updateBounds(){
        return;
    }

    gib(){
        for(let n = 0; n <= 8; n++){
            let gib = new GibEffect(this.scene,this.x,this.y,"f1-"+n,[-1200+Math.random()*2400,-1200+Math.random()*2400],
            [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000);
            gib.setTint(0xA0AB2B);
            gib.setScale(0.5);
            this.scene.addPartEffect(gib);
        }
    }

    die(){
        if(!this.deleteFlag){
            this.gib();
            this.scene.playSound("dead",0.5);
            this.processOnKill();
        }
        this.deleteFlag = true;
    }
}