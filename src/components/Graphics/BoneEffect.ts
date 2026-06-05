import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "../Effect";
import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";


export class BoneEffect extends Effect{
    //public scene: GameScene;
    public sp: Phaser.GameObjects.Sprite;
    private isLooped: boolean;
    private frameLength: number;
    private timer: number = 0;
    private totalFrames: number;
    private startingFrame: number;
    private currentFrame: number = 0;
    public deleteFlag: boolean = false;
    public velocityX: number = 0;
    public velocityY: number = 0;
    public spAngle: number;
    private fadeTime: number = 250;
    private ofs: number[];
    public owner: Player;

    constructor(scene: BaseScene, x: number, y: number, p: Player){
        super(scene, x, y);


        this.scene = scene;
		this.sp = this.scene.add.sprite(0, 0, "boneattack");
		this.sp.setOrigin(0.5, 0.5);
        this.sp.setScale(1.5,1.5);
        this.sp.setAngle(0);
        this.isLooped = false;
        this.frameLength = 25;
        this.startingFrame = 0;
        this.currentFrame = 0;
        this.totalFrames = 4;
        this.sp.setFrame(this.startingFrame);
        this.add(this.sp);
        this.setDepth(2);
        this.owner = p;
        this.ofs = [(-1+(Math.random()*2))*0.5*p.radius, (-1+(Math.random()*2))*0.5*p.radius];
        this.x = this.owner.x+this.ofs[0];
        this.y = this.owner.y+this.ofs[1];
    }

    setVelocityX(v: number){
        this.velocityX = v;
    }

    setVelocityY(v: number) {
        this.velocityY = v;
    }

    stopMovement(){
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(t: number, d: number){
        if(this.deleteFlag){
            return;
        }
        if(this.timer <= this.frameLength) {
            this.timer += d;
            this.ofs[0] += this.velocityX*d*0.001;
            this.ofs[1] += this.velocityY*d*0.001;
            this.x = this.owner.x+this.ofs[0];
            this.y = this.owner.y+this.ofs[1];
            if (this.timer >= this.frameLength) {
                this.timer = 0;
                if(this.currentFrame < (this.totalFrames-1)) {
                    this.currentFrame++;
                    this.sp.setFrame(this.currentFrame);
                }
        }
        if (this.currentFrame >= (this.totalFrames-1)) {
                if(this.fadeTime > 0) {
                    this.fadeTime -= d;
                    if(this.fadeTime <= 0){
                        this.fadeTime = 0;
                    }
                    this.sp.setAlpha(this.fadeTime/250);
                } else {
                    this.deleteFlag = true;
                    this.sp.setAlpha(0);
                }
            }
        }
    }
}