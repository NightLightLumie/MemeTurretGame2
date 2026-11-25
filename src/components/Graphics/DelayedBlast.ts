import { BasicEffect } from "./BasicEffect";
import { DamageInstance, GameScene } from "@/scenes/GameScene";

export class DelayedBlast extends BasicEffect {
    public scene: GameScene;
    private volume: number = 0.5;
    private dmgs: DamageInstance[];
    private sound: string;
    private dTimer: number = 1000;
    private rad: number = 100;
	constructor(scene: GameScene, dmg: DamageInstance[], rad: number, sound: string, delay: number, value: string, x: number, y: number, tFrames: number, fLen: number = 100, loop: boolean = false, sFrame: number = 0, angle: number = 0, scale: number[] = [1,1]) {
        super(scene,value,x,y,tFrames,fLen,loop,sFrame,angle,scale);
        this.scene = scene;
        this.dmgs = [];
        this.dmgs = dmg;
        this.sound = sound;
        this.dTimer = delay;
        this.rad = rad;
    }

    setVolume(n: number){
        this.volume = n;
    }

    update(t: number, d: number){
        if(this.deleteFlag){
            return;
        }
        if(this.dTimer > 0){
            this.dTimer -= d;
            if(this.dTimer <= 0){
                this.dTimer = 0;
                this.scene.sound.play(this.sound, {volume: this.volume});
                this.scene.simpleExplode(this.dmgs,this.x,this.y,this.rad);
            }
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