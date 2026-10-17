import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class ReactiveBarrier extends Item{
    public multiplier: number = 5;
    private baseFireballs: number = 8;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_gr";
        this.cooldown = 0;
        this.maxCD = 60000;
        this.owner.reactive = true;
    }

    fetchItemData(): number[] {
        return[this.multiplier*(1+this.owner.bonusSpellDamage), 0];
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.multiplier += 1;
        }
    }

    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
                this.owner.reactive = true;
            }
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