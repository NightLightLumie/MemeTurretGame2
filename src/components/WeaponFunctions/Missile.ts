import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { BasicEffect } from "../Graphics/BasicEffect";
import { Target } from "../Target";

export class Missile extends Phaser.GameObjects.Container{
    protected spr: Phaser.GameObjects.Sprite;
    public scene: GameScene;
    protected key: string = "";
    public damage: number = 10;
    public v: number[] = [0,0];
    public radius: number = 10;
    protected hitAnim: string = "hit_spark";
    protected hitAnimFrames: number = 3;
    public deleteFlag: boolean = false; 
    public vangle: number = 0;
    public globalDamageScale: number = 0;
    protected spin: number = 0;
    protected vscale: number = 0;
    protected doAnim: boolean = false;
    protected fLen: number[] = [0,100,0];
    protected maxFrames: number = 0;
    protected trail: Phaser.GameObjects.Particles.ParticleEmitter;
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, vscale: number = 1){
        super(scene,x,y);
        this.scene = scene;
        this.spr = this.scene.add.sprite(0,0,name);
        this.add(this.spr);
        this.key = name;
        this.v = [vscale*Math.cos(angle),vscale*Math.sin(angle)];
        this.vangle = angle;
        this.vscale = vscale;
        //console.log("BULLET ANGLE: " + this.angle);
        this.setAngle(this.vangle*(180/Math.PI));
    }

    initiateParams(){
        switch(this.key){
             default: {
                break;
            }
        }
    }

    update(t: number, d: number){
        if(this.doAnim){
            this.updateAnim(t,d);
        }
        this.x += this.v[0]*(d/1000);
        this.y += this.v[1]*(d/1000);
        this.spr.angle += this.spin*(d/1000);
        this.checkBounds();
    }

    updateAnim(t: number, d: number){
        if(this.fLen[0] < this.fLen[1]){
            this.fLen[0] += d;
            if(this.fLen[0] >= this.fLen[1]){
                this.fLen[0] = 0;
                this.fLen[2] += 1;
                if(this.fLen[2] >= this.maxFrames){
                    this.fLen[2] = 0;
                }
                this.spr.setFrame(this.fLen[2]);
            }
        }
    }

    checkBounds(){
        if(this.playerDist() > (this.scene.getCameraDiag()+ 3*this.radius)){
            this.deleteFlag = true;
        }
    }

    hitCheck(t: Target){
        let r = this.targetDist(t);
        if(r < (this.radius+t.radius)){
            this.processHit(t);
        }
    }

    processHit(t: Target){
        this.deleteFlag = true;
    }

    targetDist(t: Target): number{
        return Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2));
    }

    
    playerDist(): number{
        return Math.sqrt(Math.pow(this.scene.player.x-this.x,2)+Math.pow(this.scene.player.y-this.y,2));
    }

}