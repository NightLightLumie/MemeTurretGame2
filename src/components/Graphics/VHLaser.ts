import { Effect } from "@/components/Graphics/Effect";
import { GameScene } from "@/scenes/GameScene";

export class VHLaser extends Effect{
    protected phase: number = 0;
    protected pTimer: number = 0;
    protected lScale: number[];
    protected tLengths: number[];
    protected lAlpha: number[];
    protected spr: Phaser.GameObjects.Sprite;
    protected yscale: number = 5;
    protected mode: string;
    protected damage: number = 250;
    public scene: GameScene;
    constructor(scene: GameScene, x: number, y: number, name: string = "zoltraak", scale: number[] = [0,100,0], time: number[] = [50,200], alpha: number[] = [1,1,0], mode: string = "x"){
        super(scene,x,y);
        this.scene = scene;
        this.lScale = scale;
        this.tLengths = time;
        this.lAlpha = alpha;
        this.spr = this.scene.add.sprite(0,0,name);
        this.mode = mode;
        this.spr.setScale(this.lScale[0], 5);
        this.spr.setAlpha(this.lAlpha[0])
        switch(mode){
            case "x": {
                this.setPosition(x,this.scene.player.y);
                break;
            } case "y": {
                this.spr.setAngle(90);
                this.setPosition(this.scene.player.x,y);
                break;
            }
        }
        this.add(this.spr);
    }

    update(t: number, d: number){
        switch(this.phase){
            case 0: {}
            case 1:{
                    if(this.pTimer < this.tLengths[this.phase]){
                        this.pTimer += d;
                        if(this.pTimer >= this.tLengths[this.phase]){
                            this.phase++;
                            this.pTimer = 0;
                            this.spr.setScale(this.lScale[this.phase],this.yscale);
                            this.spr.setAlpha(this.lScale[this.phase]);
                            if(this.phase == 1){
                                switch(this.mode){
                                    case "x":{
                                        this.scene.vExplode(this.damage,this.x,80,"spell");
                                        break;
                                    } case "y": {
                                        this.scene.hExplode(this.damage,this.y,80,"spell");
                                        break;
                                    }
                                }
                            }
                        } else {
                            this.spr.setScale(this.lScale[this.phase] + ((this.pTimer/this.tLengths[this.phase])*(this.lScale[this.phase+1]-this.lScale[this.phase])), this.yscale);
                            this.spr.setAlpha(this.lAlpha[this.phase] + ((this.pTimer/this.tLengths[this.phase])*(this.lAlpha[this.phase+1]-this.lAlpha[this.phase])));
                        }
                    }
                break;
            } case 2 :{
                this.deleteFlag = true;
                break;
            }
        }
    }
}