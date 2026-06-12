import { GameScene } from "@/scenes/GameScene";
import { Item } from "./Item";
import { Player } from "../Player";

export class Spell extends Item{

    protected cd: number[] = [1000,1000];
    constructor(scene:GameScene, p: Player, name: string){
        super(scene,p,name);
    }

    update(t: number, d: number){
        if(this.cd[0] > 0){
            this.cd[0] -= d;
            if(this.cd[0] <= 0){
                this.processReady();
                this.cd[0] = this.cd[1];
            }
        }
    }

    processReady(){

    }
}