import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class CementEater extends Item{
    public cement: number = 3;
    public mitigation: number = 0.5;

    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_gr";
        this.cooldown = 10;
        this.maxCD = 15000;
        this.cement = 3;
    }

    fetchItemData(): number[] {
        return[(1-this.mitigation)*(1/(1+this.owner.bonusSpellDamage)), 0];
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.mitigation += 0.03;
            this.maxCD -= 500;
        } else {
            console.log("Item already at max level.");
            return;
        }
    }

    update(t: number, d: number){
        if(this.cement >= 3){
            this.owner.bankedCasts = 0;
        }
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
                this.refreshCement();
            }
        } else {
            this.refreshCement();
        }
    }

    refreshCement(){
        if((this.owner.bankedCasts >= 10) && (this.cement < 3)){
            this.owner.bankedCasts = 0;
            this.cement++;
            this.cooldown += this.maxCD;
        } 
    }

    setCooldown(): boolean {
        if(this.cooldown <= 0) {
            this.cooldown = this.maxCD;
            return true;
        } else {
            return false;
        }

    }

}