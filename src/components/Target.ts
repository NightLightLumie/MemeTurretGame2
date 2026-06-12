import { GameScene } from "@/scenes/GameScene";
import { DmgStack, HitLog } from "./WeaponFunctions/WeaponOperator";
import { BasicEffect } from "./BasicEffect";

export class Target extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public radius: number = 100;
    public deleteFlag: boolean = false;
    public hitStun: number = 0;
    public stackLog: Map<number,DmgStack>;
    public bLog: Map<number,HitLog>;
    public mychunk: [number,number] = [0,0];
    public unstack: number[] = [0,0];
    public overlap: boolean = false;
    public colrad: number = 75;
    public ghosting: boolean = false;
    protected seeking: boolean = false;
    protected tpr: number[] = [];
    protected unstackFactor: number = 500;
    public hp: number = 500;
    public difficulty: number = 0;
    public tID: number = 0;
    public invuln: boolean = false;
    //public pID: number = 0;


    constructor(scene:GameScene,x:number,y:number){
        super(scene,x,y);
        this.scene = scene;
        this.bLog = new Map(); //log for pierce shots
        this.stackLog = new Map(); //logs of stacks for procs
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
        this.updateStacks();

        for(let nr = 0; nr < this.tpr.length; nr++) {
            //console.log("deleted stack: " + this.tpr[nr]);
            this.stackLog.delete(this.tpr[nr]);
        }
        this.tpr = [];
    }

    updateStacks(){
        let tmpr = 0;
        this.stackLog.forEach((value: DmgStack, key: number) => {
            if(value.bop) {
                value.image.setScale(value.drawsize*3);
                value.bop = false;
            } else {
                value.image.setScale(value.drawsize);
            }
            //console.log("hits: " + value.curhits);
            if(value.curhits >= value.maxhits) {
                tmpr = value.curhits-value.maxhits;
                value.image.setAlpha(1);
                this.takeDamage(value.damage);
                //console.log("boom");
                this.scene.sound.play(value.sound,{volume: 0.75});
                this.scene.addHitEffect(new BasicEffect(this.scene,"hit_spark",this.x,this.y,3,100,false,0,Math.random()*360));
                if(tmpr >= 0){
                    value.curhits = tmpr;
                    value.bop = true;
                    value.drawsize = 0.8;
                } else {
                    this.tpr.push(key);
                    value.image.destroy();
                }
            } else {
                value.image.setAlpha(0.5+(0.5*(value.curhits/value.maxhits)));
                value.image.setTint(Phaser.Display.Color.GetColor(255*(value.curhits/value.maxhits),255*(value.curhits/value.maxhits),255));
            }
        });
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

    playerCollide(){
        let r  = this.playerDist();
        let ct = 0;
        if(r < (this.radius+this.scene.player.radius)){
            ct = Math.atan2(this.y-this.scene.player.y,this.x-this.scene.player.x);
            this.x = this.scene.player.x+((this.scene.player.radius+this.radius)*Math.cos(ct));
            this.y = this.scene.player.y+((this.scene.player.radius+this.radius)*Math.sin(ct));   
        }

    }

    takeDamage(n: number): boolean{
        if(this.invuln){
            return false;
        }
        this.hp -= n;
        if(this.hp <= 0) {
            this.die();
        }
        return true;
    }

    updateUnstacking(t:number,d:number){
        this.x += (this.unstack[0]*this.unstackFactor*d/1000);
        this.y += (this.unstack[1]*this.unstackFactor*d/1000);
        this.unstack = [0,0];
    }

    playerDist(): number{
        return Math.sqrt(Math.pow(this.scene.player.x-this.x,2)+Math.pow(this.scene.player.y-this.y,2));
    }

    distanceTo(x: number, y: number): number{
        return Math.sqrt(Math.pow(x-this.x,2)+Math.pow(y-this.y,2));
    }

    playerAngle(): number {
        return Math.atan2(this.scene.player.y-this.y,this.scene.player.x-this.x);
    }

    update(t:number,d:number){

    }

    addStack(pd: number, ap: DmgStack){

    }

    takePierceDamage(n: number, p: number, wID: number): boolean{
        if(this.bLog.has(p)){
            let tr = this.bLog.get(p);
            if(tr != null) {
                if((tr.cooldown > 0) || (tr.cooldown <= -999)){
                    return false;
                } else {
                    this.hp -= n;
                }
            } else {
                this.hp -= n;
            }
        } else {
            this.hp -= n;  
        }
        let mm = this.scene.handler.getParams(wID);
        if(this.hp <= 0) {
            this.die();
            return true;
        } else {
            if(this.bLog.has(p)){
                let ii = this.bLog.get(p);
                if(ii != null){
                    ii.cooldown = mm.pcd;
                    this.bLog.set(p, ii);
                }
            } else {
                this.bLog.set(p,{cooldown: mm.pcd, weaponID: wID});
            }
            return true;
        }
    }

    hasStack(n: number): boolean{
        if(this.stackLog.has(n)){
            if(this.stackLog.get(n) != null) {
                //console.log("CHECK SUCCESS");
                return true;
            } else {
                //console.log("NULL STACK");
                return false;
            }
        } else {
            //console.log("NO STACK PRESENT: "+ n);
            //console.log(this.stackLog);
            return false;
        }
    }

    checkSeek(n: number, limit: number){
        if(n < limit){
            this.seeking = true;
        }
    }

    die(){
        if(!this.deleteFlag){
            this.scene.sound.play("dead",{volume:0.25});
        }
        this.deleteFlag = true;
    }

    unSeek(){
        this.seeking = false;
    }

    checkBulletLog(n: number): boolean{
        if(this.bLog.has(n)){
            let r = this.bLog.get(n);
            if(r != null){
                if(r.cooldown == 0){
                    //console.log("CD IS ZERO");
                    return true; //prev hit and cd IS 0
                } else {
                    //console.log("CD TOO LONG: " + r.cooldown);
                    return false; //prev hit and cd is not 0
                }
            } else {
                //console.log("NULL VALUE");
                return true;
            }
        } else {
            //console.log("NOT HIT");
            return true; //not prev hit
        }

    }
}