import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";
import { ShieldSource } from "../../Player";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class GunFu extends Item{
    private fired: number[];
    private rate: number = 0;
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.fired = [];
        this.rate = 2;
        this.owner.on("startReload", this.logReloadData, this);
        this.owner.on("finishReload", this.clearReloadData, this);
        this.cooldown = 10;
        this.maxCD = 30000;
    }

    logReloadData(){
        if(this.cooldown > 0){
            return;
        }
        let n = this.owner.activeWeapon;
        if(!this.fired.includes(n)){
            this.fired.push(n);
            this.shieldMe(this.rate*(1+this.owner.bonusSpellDamage)*this.owner.getActiveWeapon().lastAmmoReloaded);
            this.cooldown += this.maxCD;
            this.owner.bankedCasts++;
        }
    }
    levelUp() {
        if(this.level < this.maxLevel){
            this.level++;
            this.rate += 0.2;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 1500;
            this.cooldown *= this.maxCD;
        } else {
            console.log("Item already at max level.");
            return;
        }
    }


    clearReloadData(){
        let n = this.owner.activeWeapon;
        if(this.fired.length < 1){
            return;
        }

		for(let nx = (this.fired.length-1); nx >= 0; nx--){
			if(this.fired[nx] == n) {
				this.fired.splice(nx,1);
			}
		}
    }

    fetchItemData(): number[] {
        return[this.rate, 0];
    }

    shieldMe(n: number){
        this.owner.addShield({
            source: this,
            amount: n,
            duration: -1,
        });
    }

    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            /*
            if(this.cooldown <= 0){
                this.cooldown = 0;
            }*/
            return;
        }
    }

    deplete(){
        
    }

}