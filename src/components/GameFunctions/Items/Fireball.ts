import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class Fireball extends Item{
    private fired: number[];
    public damage: number = 350;
    private baseFireballs: number = 8;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.fired = [];
        this.owner.on("startReload", this.logReloadData, this);
        this.owner.on("finishReload", this.clearReloadData, this);
        this.tileType = "item_rd";
    }

    logReloadData(){
        let n = this.owner.activeWeapon;
        if(!this.fired.includes(n)){
            this.fired.push(n);
            this.shootFireballs();
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

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 50;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), 0];
    }

    shootFireballs(){
        let rad = Math.random()*2*Math.PI;
        let vector = 0.8+(Math.random()*0.4);
        for(let xx = 0; xx < this.baseFireballs; xx++){
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x+(this.owner.radius*Math.cos(rad)),
            this.owner.y+(this.owner.radius*Math.sin(rad)),"fireball",rad,this.owner.getActiveWeapon(),this, vector));
            rad = Math.random()*2*Math.PI;
            vector = 0.8+(Math.random()*0.4);
        }
    }

}