import { Missile } from "./Missile";
import { GameScene } from "@/scenes/GameScene";
import { Weapon } from "./Weapon";
import { Item } from "../GameFunctions/Items/Item";
import { Target } from "../Target";


export class LavaPool extends Missile{
    private owner: Weapon;
    private ref: Item;
    private tickLength: number;

    private phase: number = 0;
    private ttimer = 0;
    private ftimer = 200;
    private curFrame: number = 0;
    private lScale: number = 4;
    constructor(scene: GameScene, x: number, y: number, owner: Weapon, ref: Item){
        super(scene,x,y,"lava",Math.random()*360,0);
        this.setAngle(Math.random()*360);
        this.owner = owner;
        this.ref = ref;
        this.radius = 1;
        this.setScale(0);
        this.curFrame = Math.trunc(Math.random()*12);
        if((this.curFrame == 0) || (this.curFrame == 6)){
            this.ftimer = 1000;
        } else {
            this.ftimer = 200;
        }
        this.spin = 30;
        if(Math.random() < 0.5){
            this.spin *= -1;
        }
        this.tickLength = 1;
        this.damage = ref.fetchItemData()[0];
    }

    update(t: number, d: number){
        if(this.ftimer > 0){
            this.ftimer -= d;
            if(this.ftimer <= 0){
                this.advanceFrame();
            }
        }
        switch(this.phase){
            case 0: {
                if(this.ttimer < 1000) {
                    this.ttimer += d;
                    if(this.ttimer >= 1000){
                        this.ttimer = 0;
                        this.radius = this.lScale*100;
                        this.setScale(this.lScale);
                        this.phase = 1;
                    } else {
                        this.radius = this.lScale*100*(this.ttimer/1000);
                        this.setScale(this.lScale*this.ttimer/1000);
                    }
                }
                break;
            } case 1: {
                if(this.ttimer < 8000){
                    this.ttimer += d;
                    if(this.ttimer >= 8000){
                        this.ttimer = 0;
                        this.phase = 2;
                    }
                }
                break;
            } case 2: {
                if(this.ttimer < 1000) {
                    this.ttimer += d;
                    if(this.ttimer >= 1000){
                        this.ttimer = 0;
                        this.radius = 1;
                        this.setScale(0);
                        this.phase = 3;
                        this.deleteFlag = true;
                    } else {
                        this.radius = this.lScale*100*((1000-this.ttimer)/1000);
                        this.setScale(this.lScale*(1000-this.ttimer)/1000);
                        this.setAlpha(0.5+ (0.5*(1000-this.ttimer)/1000));
                    }
                }
                break;
            } case 3: {
                this.setVisible(false);
                break;
            }
        }
        this.spr.angle += this.spin*(d/1000);
        this.checkBounds();
        this.tickLength = d;
    }

    advanceFrame(){
        this.curFrame++;
        if(this.curFrame > 11){
            this.curFrame = 0;
        }
        this.spr.setFrame(this.curFrame);
        if((this.curFrame == 0) || (this.curFrame == 6)){
            this.ftimer = 1000;
        } else {
            this.ftimer = 200;
        }
    }

    processHit(t: Target){
        t.takeBatchedDamage("lava",(1+this.scene.player.bonusSpellDamage)*this.damage*this.tickLength/1000,"spell",["spellhitorange"]);
    }

}