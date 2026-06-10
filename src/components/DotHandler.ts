import { Target } from "./Target";

export class DotHandler{
    private key: string;
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

    constructor(owner: Target){
        this.owner = owner;
    }

    increment(){
        this.curDmg += this.dmgInc;
        this.ticks += this.tickInc;
        this.curTickDmg = this.curDmg/this.ticks;
    }


}