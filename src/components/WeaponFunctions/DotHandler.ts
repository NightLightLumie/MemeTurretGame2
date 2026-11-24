import { DamageInstance } from "@/scenes/GameScene";
import { Target } from "../Target";

export class DotInstance {
    public key: string;
    public gID: number;
    public tags: string[];
    private wID: number;
    private ticks: number = 0;
    private maxTicks: number = 25;
    private tickTime: number = 250;
    private timer: number = 250;
    private maxDmg: number = 100;
    private inc: number = 10;
    private tickInc: number = 1;
    private dmgInc: number = 0;
    private curTickDmg: number = 0;
    private curDmg: number = 0;
    private owner: Target;
    private deleteFlag: boolean = false;

    constructor(owner: Target){
        this.owner = owner;
    }

    increment(){
        this.curDmg += this.dmgInc;
        this.ticks += this.tickInc;
        if(this.maxTicks > 0){
            if(this.ticks > this.maxTicks){
                this.ticks = this.maxTicks;
            }
        }
        if(this.maxDmg > 0){
            if(this.curDmg > this.maxDmg){
                this.curDmg = this.maxDmg;
            }
        }
        this.curTickDmg = this.curDmg/this.ticks;
    }

    update(t: number, d: number){
        if(this.timer > 0){
            this.timer -= d;
            if(this.timer <= 0){
                this.timer += this.tickTime;
                if((this.ticks > 0) && (this.curDmg > 0)){
                    this.dealDamage();
                } else {
                    this.deleteFlag = true;
                }

                if(this.timer <= 0){
                    this.timer = 1;
                }
            }
        }
    }

    dealDamage(){
        if(this.owner != null){
            let dmg: DamageInstance = {
                amt: this.curTickDmg,
                type: "gun",
                tags: ["gun","dot"]
            };
            this.owner.takeTypedDamage(dmg, [20,20]);
        }
    }


}