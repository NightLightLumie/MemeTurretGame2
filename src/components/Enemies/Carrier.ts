import { GameScene } from "@/scenes/GameScene";
import { GibEffect } from "../GibEffect";
import { Target } from "../Target";
import { EnemyBullet } from "../EnemyBullet";
import { BoneEffect } from "../Graphics/BoneEffect";
import { MiniThug } from "./MiniThug";
import { BasicEffect } from "../Graphics/BasicEffect";

export class Carrier extends Target{

    private spr: Phaser.GameObjects.Sprite;
    private sprTop: Phaser.GameObjects.Sprite;
    private v: number = 0;
    private a: number = 0;
    private mod: number = 1;
    private ofss: number = 0;

    protected atype: number = 0;
    protected cd: number = 0;
    protected maxcd: number = 1000;

    private aCD: number[] = [0, 500];
    private aRange: number = 800;

    private boundState: number = 0;

    protected seekType: string = "x";
    protected seekRad: number = 800;

    public gx: Phaser.GameObjects.Graphics;
    private radOfs: number = 0;
    private av: number = (2*Math.PI)/4;
    private curAngle: number = 0;
    private velAngle: number = 0;

    private linePos: number[] = [0,0];
    private turnRadius: number = 150;

    private sansCD: number[] = [0,100,4,0,7500];

    constructor(scene:GameScene,x:number,y:number, diff: number = -1){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,"carrierbase");
        this.spr.setOrigin(0.5,0.5);
        this.spr.setScale(2);
        this.sprTop = this.scene.add.sprite(0,0,"carriertop");
        this.sprTop.setOrigin(0.5,0.5);
        this.sprTop.setScale(2);
        this.spr.setX(-5+Math.random()*10);
        this.spr.setY(-5+Math.random()*10);
        this.sprTop.setX(-5+Math.random()*10);
        this.sprTop.setY(-5+Math.random()*10);

        let mm = Math.random();
        if(mm < 0.5){
            this.av *= -1;
        }
        this.v = 250;
        this.initializeAngle();
        this.add(this.spr);
        this.add(this.sprTop);
        this.hp = 35000;
        this.ofss = Math.random()*2*Math.PI; //random offset for oscillating motion
        this.tID = this.scene.getTargetID();
        this.radius = 235;
        this.aRange = 30;
        this.colrad = 200;
        this.linePos = [x,y];
        this.curAngle = 2*Math.random()*Math.PI;
        this.x = this.linePos[0] + Math.cos(this.curAngle)*this.turnRadius;
        this.y = this.linePos[1] + Math.sin(this.curAngle)*this.turnRadius;
        this.weight = 100;
        this.gx = this.scene.add.graphics();
        this.gx.fillStyle(0x008080,0.85);
        this.add(this.gx);

        if(this.scene.tracing){
            this.gx.beginPath();
            this.gx.slice(0,0,this.radius,0,2*Math.PI,false,0.0005);
            this.gx.closePath();
            this.gx.fillPath();
        }

        this.setStackDisplay();
        this.setDifficulty();
        this.value = Math.trunc(100*(1+(this.difficulty/10)));
        this.unstackFactor = 5*(Math.abs(this.v));
        this.isBoss = true;
        this.damageScale = 0.5;
        //this.pID = this.scene.getProjID();
    }

    initializeAngle(){
        this.setAngle((180/Math.PI)*this.playerAngle());
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

        this.spr.setX(-5+Math.random()*10);
        this.spr.setY(-5+Math.random()*10);
        this.sprTop.setX(-5+Math.random()*10);
        this.sprTop.setY(-5+Math.random()*10);

        let imod = Math.sin(this.ofss+(this.radOfs/100));
        if(imod >= 0){
            this.sprTop.setFrame(0);
        } else {
            this.sprTop.setFrame(1);
        }

        if((this.playerDist() < 2000) && (this.boundState == 0)){
            this.boundState = 1;
        }

        if(!this.playerCollide()){
            this.velAngle = this.angleToPlayer(this.linePos[0], this.linePos[1]);
            this.linePos[0] += (this.mod*this.v*Math.cos(this.velAngle)*d/1000);
            this.linePos[1] += (this.mod*this.v*Math.sin(this.velAngle)*d/1000);
            this.curAngle += (this.mod*this.av*d/1000);
            if(this.curAngle > (2*Math.PI)){
                this.curAngle -= 2*Math.PI;
            } else if (this.curAngle < (-2*Math.PI)){
                this.curAngle += -2*Math.PI;
            }
            this.x = this.linePos[0] + Math.cos(this.curAngle)*this.turnRadius;
            this.y = this.linePos[1] + Math.sin(this.curAngle)*this.turnRadius;
        } else {
            console.log("cannot move due to collision");
            this.refactorLinePos();
        }
        if(this.updateUnstacking(t,d)){
            this.refactorLinePos();
        }
        this.setAngle((180/Math.PI)*this.playerAngle());

        this.attack(t,d);
        this.updateLogs(t,d);
    }

    refactorLinePos(){
        this.linePos[0] = this.x - (Math.cos(this.curAngle)*this.turnRadius);
        this.linePos[1] = this.y - (Math.sin(this.curAngle)*this.turnRadius);
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
                break;
            } case 1: {
                if((this.x >= 4140) || (this.x <= -4140)){
                    if((this.y >= 2460) || (this.y <= -2460)){
                        this.deleteFlag = true;
                    }
                }
                break;
            }
        }
    }

    attack(t: number, d: number){
        if(this.aCD[0] <= 0) {
            if(this.playerDist() < (this.scene.player.radius+this.radius+this.aRange))
            {
                this.scene.sound.play("turret_hit", {volume: 0.5});
                this.scene.sound.play("crit", {volume: 0.5});
                this.scene.addPlayerEffect(new BoneEffect(this.scene, this.scene.player.x, this.scene.player.y, this.scene.player,1));
                this.aCD[0] = this.aCD[1];   
                this.scene.player.takeHit(150*this.debuff*this.buff*Math.trunc(1+(0.05*this.difficulty)));  
            }
        } else {
            if(this.aCD[0] > 0){
                this.aCD[0] -= d;
                if(this.aCD[0] <= 0) {
                    this.aCD[0] = 0;
                }
            }
        }

        if(this.sansCD[3] > 0){
            this.sansCD[3] -= d;
            if(this.sansCD[3] <= 0) {
                this.sansCD[3] = 0;
                this.sansCD[0] = 0;
                this.sansCD[2] = 4;
            }
        } else {
            if(this.sansCD[0] > 0){
                this.sansCD[0] -= d;
                if(this.sansCD[0] <= 0) {
                    this.sansCD[0] = 0;
                }
            }
        }


        if((this.sansCD[3] <= 0) && (this.boundState != 0)){
            if(this.sansCD[0] <= 0){
                if(this.sansCD[2] >= 1){

                    let launch = this.playerAngle();
                    for(let n = 0; n < 3; n++){
                        let ofs = (Math.PI/2) + (Math.random()*(Math.PI/4));
                        if(Math.random()<0.5){
                            ofs *= -1;
                        }
                        this.scene.addGroundEnemy(new MiniThug(this.scene, this.x, this.y, "x", 0, "x", this.difficulty, launch-ofs));
                    }
                    this.scene.sound.play("launch", {volume: 0.5});
                    this.sansCD[2] -= 1;
                    this.sansCD[0] = this.sansCD[1];
                } else {
                    this.sansCD[3] = this.sansCD[4];
                }
            }
        }
    }

    gib(){
        this.scene.playSound("meme_explosion",0.5);
        this.scene.addHitEffect(new BasicEffect(this.scene,"meme_exp",this.x,this.y,18,20,false,0,Math.random()*360,[2,2]));
        for(let n = 1; n <= 7; n++){
            let gib = new GibEffect(this.scene,this.x,this.y,"c"+n,[-2400+Math.random()*4800,-2400+Math.random()*4800],
            [0,0],Math.random()*360,1000+(Math.random()*3000),Math.random()*3600,5000,[2,2]);
            this.scene.addPartEffect(gib);
        }
    }

    die(){
        if(!this.deleteFlag){
            this.gib();
            this.scene.sound.play("dead",{volume:0.25});
            if(Math.random() < this.scene.getDropChance("ufo")){
                this.scene.dropBox();
            }
            this.scene.dropWidgetPack(20+Math.trunc(this.difficulty/2));
            this.processOnKill();
        }
        this.deleteFlag = true;
    }
}