import { GameScene } from "@/scenes/GameScene";
import { Player } from "./Player";
import { BasicEffect } from "./BasicEffect";

export class EnemyBullet extends Phaser.GameObjects.Container{
    private spr: Phaser.GameObjects.Sprite;
    public scene: GameScene;
    private key: string = "";
    private diff: number = 0;
    public damage: number = 10;
    public v: number[] = [0,0];
    public radius: number = 10;
    private hitAnim: string = "hit_spark";
    private hitAnimFrames: number = 3;
    public deleteFlag: boolean = false; 
    public vangle: number = 0;
    constructor(scene: GameScene, x: number, y: number, name: string, difficulty: number, angle: number){
        super(scene,x,y);
        this.scene = scene;
        this.spr = this.scene.add.sprite(0,0,name);
        this.add(this.spr);
        this.key = name;
        this.diff = difficulty;
        this.v = [Math.cos(angle),Math.sin(angle)];
        this.vangle = angle;
        console.log("BULLET ANGLE: " + this.angle);
        this.setAngle(this.vangle*(180/Math.PI));
        this.initiateParams();
    }

    initiateParams(){
        switch(this.key){
            case "ufobullet": {
                this.damage = 50 * Math.trunc(1+(0.1*this.diff));
                this.hitAnim = "hit_purple";
                this.spr.setScale(2,2);
                this.v[0] *= 750;
                this.v[1] *= 750;
                this.radius = 16;
                break;
            } default: {
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

    hitCheck(){
        let r = this.playerDist();
        if(r < (this.radius+this.scene.player.hitsize)){
            this.scene.playSound("turret_hit", 0.5);
            this.scene.player.takeDamage(this.damage);
            this.scene.addPlayerEffect(new BasicEffect(this.scene,this.hitAnim,this.x,this.y,this.hitAnimFrames,150,false,0,Math.random()*360,[1,1]));
            this.deleteFlag = true;
        }
    }

    playerDist(): number{
        return Math.sqrt(Math.pow(this.scene.player.x-this.x,2)+Math.pow(this.scene.player.y-this.y,2));
    }
}