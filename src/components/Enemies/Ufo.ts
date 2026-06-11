import { GameScene } from "@/scenes/GameScene";
import { GibEffect } from "../GibEffect";
import { WeaponData } from "../WeaponFunctions/Weapon";
import { DmgStack,HitLog } from "../WeaponFunctions/WeaponOperator";
import { BasicEffect } from "../BasicEffect";
import { Target } from "../Target";
import { EnemyBullet } from "../EnemyBullet";

export class Ufo extends Target{

    private spr: Phaser.GameObjects.Sprite;

    private v: number = 0;
    private a: number = 0;
    private mod: number = 1;
    private ofss: number = 0;

    protected atype: number = 0;
    protected cd: number = 0;
    protected maxcd: number = 1000;

    private tdisp: Phaser.GameObjects.Container;

    private aCD: number[] = [0, 1000];
    private aRange: number = 800;

    private boundState: number = 0;

    protected seekType: string = "x";
    protected seekRad: number = 800;

    public gx: Phaser.GameObjects.Graphics;
    private radOfs: number = 0;
    private av: number = (2*Math.PI)/8;
    private tether: number = 0;
    private rv: number = 800;
    private bound: number = 600;
    private curAngle: number = 0;
    private spin: number = 0;

    constructor(scene:GameScene,x:number,y:number, ofs: number = 0){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,"enemy_2");
        this.spr.setOrigin(0.5,0.5);
        let mm = Math.random();
        if(mm < 0.5){
            this.av *= -1;
        }
        this.v = 200+(Math.random()*200);
        this.initializeAngle(ofs);
        this.add(this.spr);
        this.hp = 2000;
        this.ofss = Math.random()*2*Math.PI; //random offset for oscillating motion
        this.tID = this.scene.getTargetID();
        this.tdisp = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.tdisp);
        this.tdisp.setDepth(10);
        this.radius = 155;
        this.curAngle = this.playerAngle();
        this.tether = this.playerDist();

        this.gx = this.scene.add.graphics();
        this.gx.fillStyle(0x008080,0.85);
        this.add(this.gx);

        if(this.scene.tracing){
            this.gx.beginPath();
            this.gx.slice(0,0,this.radius,0,2*Math.PI,false,0.0005);
            this.gx.closePath();
            this.gx.fillPath();
        }
        //this.pID = this.scene.getProjID();
    }

    initializeAngle(offset: number = 0){
        let ofs = (-1*offset)+(Math.random()*2*offset);
        let theta = 0;

        this.spin = 180+(Math.random()*540);
        let px = Math.random();
        if(px < 0.5){
            this.spin *= -1
        }
        this.setAngle(Math.random()*360);
        this.radOfs = Math.random()*200000;
    }


    update(t:number,d:number){
        super.update(t,d);
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

        this.setAngle(this.angle+(this.mod*this.spin*d/1000));
        let imod = Math.sin(this.ofss+(this.radOfs/400));
        if(imod >= 0){
            this.spr.setFrame(0);
        } else {
            this.spr.setFrame(1);
        }
        imod += 1;
        this.curAngle += this.mod*this.av*d/1000*(imod/2);
        if(this.curAngle >= (4*Math.PI)){
            this.curAngle -= (4*Math.PI);
        }
        this.tether -= this.mod*this.rv*d/1000*(imod/2);
        if(this.tether <= this.bound) {
            this.tether = this.bound;
        }
        this.x = this.scene.player.x+(this.tether*Math.cos(this.curAngle));
        this.y = this.scene.player.y+(this.tether*Math.sin(this.curAngle));
        //this.refactor();
        //this.txt.setText("{" + this.unstack[0] + ", "+ this.unstack[1] + "}");
        this.attack(t,d);
        this.updateLogs(t,d);
    }

    computeAngle(){

    }

    seek(t: number, d: number){
        let c = 0;
        let ap = 0;
    }

    updateBounds(){
        switch(this.boundState){
            case 0: {
                if((this.x <= 3840) && (this.x >= -3840)){
                    if((this.y <= 2160) && (this.y >= -2160)){
                        this.boundState = 1;
                    }
                }
            } case 1: {
                if((this.x >= 4140) || (this.x <= -4140)){
                    if((this.y >= 2460) || (this.y <= -2460)){
                        this.deleteFlag = true;
                    }
                }
            }
        }
    }

    attack(t: number, d: number){
        if(this.aCD[0] <= 0) {
            if(this.playerDist() < (this.scene.player.radius+this.radius+this.aRange))
            {
                this.scene.playSound("ufobullet_fire", 0.5);
                this.scene.addEnemyBullet(new EnemyBullet(this.scene,this.x+(Math.cos(this.playerAngle())*this.radius),this.y+(Math.sin(this.playerAngle())*this.radius),
                "ufobullet",this.difficulty,this.playerAngle()));
                this.aCD[0] = this.aCD[1];   
            }
        } else {
            this.aCD[0] -= d;
            if(this.aCD[0] <= 0) {
                this.aCD[0] = 0;
            }
        }
    }

    gib(){
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u1",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u2",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3500),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u3",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3500),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u4",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3500),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u5",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3500),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u6",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3500),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"u7",[-1800+Math.random()*3600,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1500+(Math.random()*3500),Math.random()*3600,5000));
    }

    addStack(pd: number, ap: DmgStack){
        this.tdisp.add(ap.image);
        this.stackLog.set(pd,ap);
    }

    die(){
        if(!this.deleteFlag){
            this.gib();
            this.scene.sound.play("dead",{volume:0.25});
        }
        this.deleteFlag = true;
    }
}