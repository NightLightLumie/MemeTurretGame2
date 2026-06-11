import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { BasicEffect } from "../BasicEffect";
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
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number){
        super(scene,x,y);
        this.scene = scene;
        this.spr = this.scene.add.sprite(0,0,name);
        this.add(this.spr);
        this.key = name;
        this.v = [Math.cos(angle),Math.sin(angle)];
        this.vangle = angle;
        console.log("BULLET ANGLE: " + this.angle);
        this.setAngle(this.vangle*(180/Math.PI));
        this.initiateParams();
    }

    initiateParams(){
        switch(this.key){
             default: {
                break;
            }
        }
    }

    update(t: number, d: number){
        this.x += this.v[0]*(d/1000);
        this.y += this.v[1]*(d/1000);
        this.checkBounds();
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
            this.deleteFlag = true;
        }
    }

    processHit(t: Target){

    }

    targetDist(t: Target): number{
        return Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2));
    }

    
    playerDist(): number{
        return Math.sqrt(Math.pow(this.scene.player.x-this.x,2)+Math.pow(this.scene.player.y-this.y,2));
    }

}