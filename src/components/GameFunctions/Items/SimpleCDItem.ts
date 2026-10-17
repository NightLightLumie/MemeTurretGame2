import { Item } from "./Item";
import { GameScene } from "@/scenes/GameScene";
import { Player } from "@/components/Player";

export class SimpleCDItem extends Item{


    constructor(scene:GameScene, p: Player, id: string, slot: number){
        super(scene, p, id);
        this.addEffect();
    }

    addEffect(){
        switch(this.key){
            case "Cancel Death": {
                this.cooldown = 0;
                this.maxCD = 40000;
                break;
            } case "Focus Sash": {
                this.cooldown = 0;
                this.maxCD = 180000;
                this.value = 0.25;
                this.owner.sashed = true;
                break;
            }
        }
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
        } else {
            return;
        }
        switch(this.key){
            case "Cancel Death": {
                this.scene.dbTimer[0] += 25;
                this.scene.dbTimer[1] += 25;
                break;
            } case "Focus Sash": {
                let p = this.cooldown/this.maxCD;
                this.maxCD -= 3000;
                this.cooldown = this.maxCD*p;
                this.value += 0.025;
                break;
            }
        }
    }

    setCooldown(): boolean{
        if(this.cooldown == 0){
            this.cooldown = this.maxCD;
            return true;
        } else {
            return false;
        }

    }
}