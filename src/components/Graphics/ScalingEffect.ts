import { BaseScene } from "@/scenes/BaseScene";
import { Effect } from "./Effect";
import { GameScene } from "@/scenes/GameScene";

export class ScalingEffect extends Effect{
    public scene: GameScene;
    public sprite: Phaser.GameObjects.Sprite;
    private time: number;
    private maxTime: number;
    private spin: number;
    private sc: number[];
    private alp: number[];
    private scv: number;
    private alpv: number;
    private follow: boolean;
    constructor(scene: GameScene, x: number, y: number, spr: string, time: number, angle: number, spin: number = 0, scale: number[] = [1,1], alpha: number[] = [1,1], options: string = ""){
        super(scene, x, y);
        this.scene = scene;
        this.sprite = this.scene.add.sprite(0,0,spr);
        this.add(this.sprite);
        this.setAngle(angle);
        this.time = 0;
        this.maxTime = time;
        this.spin = spin;
        this.sc = scale;
        this.alp = alpha;
        this.scv = (this.sc[1]-this.sc[0])/this.maxTime;
        this.alpv = (this.alp[1]-this.alp[0])/this.maxTime;
        this.sprite.setAlpha(this.alp[0]);
        this.sprite.setScale(this.sc[0]);
        this.parseOptions(options);
    }

    parseOptions(str: string){
        switch(str){
            case "follow": {
                this.follow = true;
                break;
            } default: {
                break;
            }
        }
    }

    update(t: number, d: number){
        if(this.deleteFlag){
            return;
        }
        if(this.follow){
            this.x = this.scene.player.x;
            this.y = this.scene.player.y;
        }

        this.time += d;
        if(this.time >= this.maxTime){
            this.time = this.maxTime;
            this.deleteFlag = true;
        }
        this.angle += this.spin*(d/1000);
        this.sprite.setScale(this.sc[0]+((this.sc[1]-this.sc[0])*(this.time/this.maxTime))  );
        //this.sprite.setScale(this.sc[0]+(this.scv*d));
        this.sprite.setAlpha(this.alp[0]+((this.alp[1]-this.alp[0])*(this.time/this.maxTime))  );

    }
}