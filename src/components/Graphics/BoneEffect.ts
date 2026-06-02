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
    private fadeTime: number = 500;
    private ofs: number[];

    constructor(scene: BaseScene, x: number, y: number, p: Player){
        super(scene, x, y);
        this.frameLength = 100;
        this.startingFrame = 0;
        this.currentFrame = 0;
        this.totalFrames = 4;
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
        if (this.timer <= this.frameLength) {
            this.timer += d;
            this.x += this.velocityX*d*0.001;
            this.y += this.velocityY*d*0.001;
            if (this.timer >= this.frameLength) {
                this.timer = 0;
                if(this.currentFrame < (this.totalFrames-1)) {
                    this.currentFrame++;
                    this.sp.setFrame(this.currentFrame);
                } else if (this.currentFrame >= (this.totalFrames-1)) {
                    if(this.isLooped) {
                        this.currentFrame = 0;
                        this.sp.setFrame(this.currentFrame);
                    } else {
                        this.deleteFlag = true;
                        this.sp.setAlpha(0);
                    }
                }
                
            }
        }
    }
}