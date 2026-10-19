import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";


export class ArcaneMissile extends Item{
    private mode: number = 0;
    public damage: number = 350;
    private shots: number = 0;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 3000;
        this.maxCD = 3000;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 20;
            let e = this.cooldown/this.maxCD;
            this.maxCD -= 200;
            this.cooldown = e*this.maxCD;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), (1+this.owner.bonusGunDamage)*this.owner.conversion*this.owner.getActiveWeapon().damage];
    }

    shoot(){
        if(this.scene.closestTarget != null){
            //console.log("Shoot missile");
            this.scene.addPlayerProjectile(new HomingTracer(this.scene,this.owner.x,this.owner.y,"arcaneshot",(-1*Math.PI)+(Math.random()*2*Math.PI),1,this.scene.closestTarget));
            this.cooldown = this.maxCD;
            this.owner.bankedCasts++;
        } else {
            //console.log("Null target");
        }
        return;

    }

    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
            }
            return;
        }
        if(this.cooldown == 0){
            this.shoot();
        }
    }

}