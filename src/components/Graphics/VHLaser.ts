import { Effect } from "@/components/Graphics/Effect";
import { DamageInstance, GameScene } from "@/scenes/GameScene";

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
    protected gdmg: number = 0;
    protected dtype: string = "spell";
    public scene: GameScene;
    constructor(scene: GameScene, x: number, y: number, name: string = "zoltraak", scale: number[] = [0,100,0], time: number[] = [50,200], alpha: number[] = [1,1,0], mode: string = "x", dmg: number[]){
        super(scene,x,y);
        this.scene = scene;
        this.lScale = scale;
        this.tLengths = time;
        this.lAlpha = alpha;
        this.spr = this.scene.add.sprite(0,0,name);
        this.mode = mode;
        this.spr.setScale(this.lScale[0], 5);
        this.spr.setAlpha(this.lAlpha[0]);
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
        this.damage = dmg[0];
        this.gdmg = dmg[1];
        if(Math.random()<0.2){
            this.dtype = "spellcrit";
            this.damage *= 2;
        }
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
                            let dmgs: DamageInstance[] = [];
                            dmgs.push({
                                amt: this.damage,
                                type: this.dtype,
                                tags: ["aoe", "spell"],
                            });
                            if(this.dtype == "spellcrit") {
                                dmgs[0].tags.push("crit");
                            }
                            if(this.gdmg > 0) {
                                dmgs.push({
                                    amt: this.gdmg,
                                    type: "gun",
                                    tags: ["aoe", "gun"],
                                });
                            }
                            if(this.phase == 1){
                                switch(this.mode){
                                    case "x":{
                                        this.scene.vExplode(dmgs,this.x,80,this.dtype);
                                        break;
                                    } case "y": {
                                        this.scene.hExplode(dmgs,this.y,80,this.dtype);
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