import { Ufo } from "./Ufo";
import { GameScene } from "@/scenes/GameScene";
import { EnemyBullet } from "../EnemyBullet";
import { GibEffect } from "../GibEffect";

export class GreenUfo extends Ufo {
    protected atkState: number = 0;
    constructor(scene:GameScene,x:number,y:number, ofs: number = 0, diff: number = -1){
        super(scene,x,y,ofs,diff);
        this.bound = 750;
        this.hp = 10000;
        this.setDifficulty(diff);
        this.aRange = 850;
        this.av = (2*Math.PI)/10;
        this.rv = 650;
        this.aCD = [0, 1750];
        this.spr.setTexture("enemy_2_gr");
        this.spr.setScale(1.5,1.5);
        this.radius = Math.trunc(1.5*this.radius);
        this.value = Math.trunc(500*(1+(this.difficulty/10)));
        if(Math.random() < 0.5){
            this.atkState = 1;
        }
    }

    attack(t: number, d: number){
        if(this.aCD[0] <= 0) {
            if(this.playerDist() < (this.scene.player.radius+this.radius+this.aRange))
            {
                this.scene.playSound("rocket", 0.5);
                let a = this.playerAngle();
                if(this.atkState == 1){
                    a += Math.PI/16;
                }
                this.scene.addEnemyBullet(new EnemyBullet(this.scene,this.x+(Math.cos(a)*this.radius),this.y+(Math.sin(a)*this.radius),
                "uforocket",this.difficulty,a,this.buff*this.debuff));
                this.aCD[0] = this.aCD[1];
                if(this.atkState == 1){
                    let b = a - (Math.PI/8);
                    this.scene.addEnemyBullet(new EnemyBullet(this.scene,this.x+(Math.cos(b)*this.radius),this.y+(Math.sin(b)*this.radius),
                    "uforocket",this.difficulty,b,this.buff*this.debuff));
                    this.atkState = 0;
                } else {
                    this.atkState = 1;
                }

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

    gib(){
        for(let n = 0; n < 7; n++){
            let g = new GibEffect(this.scene,this.x,this.y,"u" + (n+1),[-1800+Math.random()*3600,-1200+Math.random()*2400],
            [0,0],Math.random()*360,1500+(Math.random()*3000),Math.random()*3600,5000);
            g.setTint(0x80b853);
            this.scene.addPartEffect(g);
        }
    }

    die(){
        if(!this.deleteFlag){
            this.gib();
            this.scene.sound.play("dead",{volume:0.25});
            if(Math.random() < this.scene.getDropChance("ufo")){
                this.scene.dropBox();
            }
            if(Math.random() < this.scene.getWidgetChance("ufo")){
                this.scene.dropWidget();
            }
            this.processOnKill();
        }
        this.deleteFlag = true;
    }
}