import { GameScene } from "@/scenes/GameScene";
import { Target } from "./Target";
import { GibEffect } from "./GibEffect";
import { WeaponData } from "./WeaponFunctions/Weapon";
import { DmgStack, HitLog } from "./WeaponFunctions/WeaponOperator";
import { BasicEffect } from "./BasicEffect";
import { BoneEffect } from "./Graphics/BoneEffect";

export class Thug extends Target{

    private spr: Phaser.GameObjects.Sprite;

    private v: number = 0;
    private a: number = 0;
    private mod: number = 1;
    private ofss: number = 0;
    protected atype: number = 0;
    protected cd: number = 0;
    protected maxcd: number = 1000;

    private tdisp: Phaser.GameObjects.Container;
    private txt: Phaser.GameObjects.Text;

    private aCD: number[] = [0, 1000];
    private aRange: number = 20;

    private boundState: number = 0;

    protected seekType: string = "x";
    protected seekRad: number = 800;

    public gx: Phaser.GameObjects.Graphics;
    private radOfs: number = 0;

    constructor(scene:GameScene,x:number,y:number, mode: string = "x", ofs: number = 0, seek: string = "x"){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,"enemy_1");
        this.spr.setOrigin(0.5,0.5);
        this.v = 200+(Math.random()*200);
        this.initializeAngle(mode, ofs);
        this.add(this.spr);
        this.ofss = Math.random()*2*Math.PI; //random offset for oscillating motion
        this.tID = this.scene.getTargetID();
        this.tdisp = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.tdisp);
        this.tdisp.setDepth(10);
        this.gx = this.scene.add.graphics();
        this.gx.fillStyle(0x008080,0.85);
        this.add(this.gx);
        this.txt = this.scene.addText({
			x: 0,
			y: 0,
			size: 30,
			color: "#FFFFFF",
			text: "",
		});
        this.tdisp.add(this.txt);
        if(this.scene.tracing){
            this.gx.beginPath();
            this.gx.slice(0,0,this.radius,0,2*Math.PI,false,0.0005);
            this.gx.closePath();
            this.gx.fillPath();
        }
        //this.pID = this.scene.getProjID();
    }

    initializeAngle(input: string, offset: number = 0){
        let ofs = (-1*offset)+(Math.random()*2*offset);
        let theta = 0;
        this.radOfs = Math.random()*200000;
        switch(input){
            case "xx": {}
            case "x": {
                if(this. x > 0) {
                    theta = 180+ofs;
                    this.setAngle(theta);
                    this.a = theta*(Math.PI/180);
                } else {
                    theta = 0+ofs;
                    this.setAngle(theta);
                    this.a = theta*(Math.PI/180);
                }
                break;
            } case "r": {
                theta = (this.playerAngle()*(180/Math.PI)) + ofs;
                this.setAngle(theta);
                this.a = theta*(Math.PI/180);
                break;
            } default: {
                break;
            }
        }

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
        let rmod = 1+(Math.sin(this.ofss+(this.radOfs/400)));
        let tmod = 0.25+(rmod*.75);
        this.spr.setScale(0.8+(rmod/5),1+((1-rmod)/10));
        this.x += (this.mod*this.v*tmod*Math.cos(this.a)*d/1000);
        this.y += (this.mod*this.v*tmod*Math.sin(this.a)*d/1000);
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
        switch(this.seekType){
            case "r": {
                if(!this.seeking) {
                    c = this.playerDist();
                    this.checkSeek(c, 1600);

                } else {
                    this.a = this.playerAngle();
                    this.attack(t,d);
                    this.playerCollide();
                }
                break;
            } case "x": {
                if(!this.seeking){
                    c = Math.abs(this.x-this.scene.player.x);
                    this.checkSeek(c, 1600);
                } else {
                    this.a = this.playerAngle();
                    this.attack(t,d);
                    this.playerCollide();
                }
                break;
            } default: {
                this.a = this.playerAngle();
                break;
            }
        }
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
                this.scene.sound.play("turret_hit", {volume: 0.5});
                this.scene.addPlayerEffect(new BoneEffect(this.scene, this.scene.player.x, this.scene.player.y, this.scene.player));
                this.aCD[0] = this.aCD[1];   
                this.scene.player.takeDamage(75);
            }
        } else {
            this.aCD[0] -= d;
            if(this.aCD[0] <= 0) {
                this.aCD[0] = 0;
            }
        }
    }



    gib(){
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-0",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-1",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-2",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-3",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-4",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-5",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-6",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-7",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-8",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000));
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