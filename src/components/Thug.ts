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
    private hp: number = 600;
    private mod: number = 1;
    private ofss: number = 0;
    private unstackFactor: number = 500;

    protected atype: number = 0;
    protected cd: number = 0;
    protected maxcd: number = 1000;


    private tpr: number[] = [];
    private tdisp: Phaser.GameObjects.Container;
    private txt: Phaser.GameObjects.Text;

    private aCD: number[] = [0, 1000];
    private aRange: number = 20;

    private boundState: number = 0;

    protected seekType: string = "x";
    protected seekRad: number = 800;

    public gx: Phaser.GameObjects.Graphics;

    constructor(scene:GameScene,x:number,y:number, mode: string = "x", ofs: number = 0, seek: string = "x"){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,"enemy_1");
        this.spr.setOrigin(0.5,0.5);
        this.v = 200+(Math.random()*200);
        this.initializeAngle(mode, ofs);
        this.add(this.spr);
        this.ofss = Math.random()*2*Math.PI; //random offset for oscillating motion
        this.bLog = new Map(); //log for pierce shots
        this.tID = this.scene.getTargetID();
        this.tdisp = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.tdisp);
        this.tdisp.setDepth(10);
        this.stackLog = new Map(); //logs of stacks for procs
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
        switch(input){
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
        //this.x += 50;
        let rmod = 1+(Math.sin(this.ofss+(t/200)));
        let tmod = 0.25+(rmod*.75);
        this.spr.setScale(0.8+(rmod/5),1+((1-rmod)/10));
        this.x += (this.mod*this.v*tmod*Math.cos(this.a)*d/1000);
        this.y += (this.mod*this.v*tmod*Math.sin(this.a)*d/1000);
        //this.refactor();
        //this.txt.setText("{" + this.unstack[0] + ", "+ this.unstack[1] + "}");
        this.x += (this.unstack[0]*this.unstackFactor*d/1000);
        this.y += (this.unstack[1]*this.unstackFactor*d/1000);
        this.unstack = [0,0];
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

    playerCollide(){
        let r  = this.playerDist();
        let ct = 0;
        if(r < (this.radius+this.scene.player.radius)){
            ct = Math.atan2(this.y-this.scene.player.y,this.x-this.scene.player.x);
            this.x = this.scene.player.x+((this.scene.player.radius+this.radius)*Math.cos(ct));
            this.y = this.scene.player.y+((this.scene.player.radius+this.radius)*Math.sin(ct));   
        }

    }

    refactor(){
        let r = Math.sqrt(Math.pow(this.unstack[0],2)+Math.pow(this.unstack[1],2));
        if(this.unstack[0] != 0) {
            this.unstack[0] = Math.cos(r);
        }
        if(this.unstack[1] != 0) {
            this.unstack[1] = Math.sin(r);
        }
    }

    updateLogs(t:number,d:number){
        this.bLog.forEach((value: HitLog, key: number) => {
            if(value.cooldown > 0) {
                value.cooldown -= d;
                if(value.cooldown <= 0) {
                    value.cooldown = 0;
                }
                this.bLog.set(key, value);
            }
        });

        this.tpr = [];
        this.stackLog.forEach((value: DmgStack, key: number) => {
            if(value.bop) {
                value.image.setScale(value.drawsize*3);
                value.bop = false;
            } else {
                value.image.setScale(value.drawsize);
            }
            //console.log("hits: " + value.curhits);
            if(value.curhits >= value.maxhits) {
                value.image.setAlpha(1);
                this.takeDamage(value.damage);
                //console.log("boom");
                this.scene.sound.play(value.sound,{volume: 0.75});
                this.scene.addHitEffect(new BasicEffect(this.scene,"hit_spark",this.x,this.y,3,100,false,0,Math.random()*360));
                this.tpr.push(key);
                value.image.destroy();
            } else {
                value.image.setAlpha(0.5+(0.5*(value.curhits/value.maxhits)));
                value.image.setTint(Phaser.Display.Color.GetColor(255*(value.curhits/value.maxhits),255*(value.curhits/value.maxhits),255));
            }
        });

        for(let nr = 0; nr < this.tpr.length; nr++) {
            //console.log("deleted stack: " + this.tpr[nr]);
            this.stackLog.delete(this.tpr[nr]);
        }
        this.tpr = [];
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

    playerDist(): number{
        return Math.sqrt(Math.pow(this.scene.player.x-this.x,2)+Math.pow(this.scene.player.y-this.y,2));
    }

    playerAngle(): number {
        return Math.atan2(this.scene.player.y-this.y,this.scene.player.x-this.x);
    }

    takeDamage(n: number){
        this.hp -= n;
        if(this.hp <= 0) {
            this.die();
        }
    }

    attack(t: number, d: number){
        if(this.aCD[0] <= 0) {
            if(this.playerDist() < (this.scene.player.radius+this.radius+this.aRange))
            {
                this.scene.sound.play("turret_hit", {volume: 0.5});
                this.scene.addPlayerEffect(new BoneEffect(this.scene, this.scene.player.x, this.scene.player.y, this.scene.player));
                this.aCD[0] = this.aCD[1];   
            }
        } else {
            this.aCD[0] -= d;
            if(this.aCD[0] <= 0) {
                this.aCD[0] = 0;
            }
        }
    }

    takePierceDamage(n: number, p: number, wID: number){
        this.hp -= n;
        let mm = this.scene.handler.getParams(wID);
        if(this.hp <= 0) {
            this.die();
        } else {
            if(this.bLog.has(p)){
                let ii = this.bLog.get(p);
                if(ii != null){
                    ii.cooldown = mm.pcd;
                }
            }
            this.bLog.set(p,{cooldown: mm.pcd, weaponID: wID});
        }
    }

    gib(){
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-0",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-1",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-2",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-3",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-4",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-5",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-6",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-7",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
        this.scene.addPartEffect(new GibEffect(this.scene,this.x,this.y,"f1-8",[-1200+Math.random()*2400,-1200+Math.random()*2400],
        [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,10000));
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