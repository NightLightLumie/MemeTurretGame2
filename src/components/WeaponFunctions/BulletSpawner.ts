import { GameScene } from "@/scenes/GameScene";
import { PlayerObject } from "../PlayerObject";
import { Weapon } from "./Weapon";
import { BonusCommand, Bullet } from "./Bullet";

export class BulletSpawner extends PlayerObject{
    public scene: GameScene;
    private params: {
        rp: number;
        amt: number;
        cd: number;
        type: number;
        angle: number;
        damage: number;
        spd: number;
        acc: number;
        pierce: number;
        w: Weapon;
        cmd: BonusCommand[];
        ep: number[];
    }
    private sound: string;
    private velocity: {
        x: number;
        y: number;
    };
    public timer: number[] = [0,0];
    private bstr: string;
    private hasKill: boolean = false;
    private kills: number = 0;
    private tags: string[];


    constructor(scene: GameScene, x: number, y: number, repeats: number, amt: number, cooldown: number, type: number, angle: number, damage: number, spd: number, acc: number, pierce: number, w: Weapon, cmds: BonusCommand[] = [], ep: number[] = [], tags: string[] = [], sound: string = "default", bstr: string = "default"){
        super(scene,x,y);
        this.scene = scene;
        this.params = {
            rp: repeats,
            amt: amt,
            cd: cooldown,
            type: type,
            angle: angle,
            damage: damage,
            spd: spd,
            acc: acc,
            pierce: pierce,
            w: w,
            cmd: cmds,
            ep: ep,
        }
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.sound = sound;
        this.bstr = bstr;
        this.timer = [1, this.params.cd];
        this.tags = tags;
    }

    setMotion(x: number, y: number){
        this.velocity.x = x;
        this.velocity.y = y;
    }

	notify(type: string, amt: number){
        switch(type){
            case "kill": {
                if(this.params.w.type == 12){
                    this.kills++;
                    if((this.kills >= 3) && (!this.hasKill)){
                        this.hasKill = true;
                        console.log(this.kills);
                        this.params.w.instantLoad();
                    }
                }
                break;
            } default: {
                break;
            }
        }
	}

    update(t: number, d: number){
        this.x += this.velocity.x*(d/1000);
        this.y += this.velocity.y*(d/1000);   

        if(this.timer[0] > 0){
            this.timer[0] -= d;
            if(this.timer[0] <= 0){
                this.shoot();
                this.timer[0] += this.timer[1];
            }
        }       
    }

    shoot(){
        if(this.params.rp >= 1){
            let ofs = 0;
            if(this.sound != "default"){
                this.scene.sound.play(this.sound,{volume: 0.7});
            }

            for(let r = 0; r < this.params.amt; r++) {
                ofs = Phaser.Math.DegToRad(-1*this.params.acc+(Math.random()*2*this.params.acc));
                let bx = new Bullet(this.scene,this.x, this.y, this.params.type, this.params.spd, this.params.angle+ofs, this.params.damage, this.params.pierce, this.params.w, structuredClone(this.params.cmd), structuredClone(this.params.ep));
                bx.addTracker(this);
                if(this.bstr != "default"){
                    bx.setSprite(this.bstr);
                }
                this.scene.addBullet(bx);
            }

            this.params.rp -= 1;
            if(this.params.rp <= 1){
                this.deleteFlag = true;
            }
        }
    }
}