import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { MagicMissile } from "@/components/WeaponFunctions/MagicMissile";


export class ArcaneMissile extends Item{
    private mode: number = 0;
    public damage: number = 350;
    private shots: number = 0;
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_rd";
        this.cooldown = 10;
        this.maxCD = 3000;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 30;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 200;
            this.cooldown *= this.maxCD;
        } else {
            console.log("Item already at max level.");
            return;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), (1+this.owner.bonusGunDamage)*this.owner.conversion*this.owner.getActiveWeapon().damage];
    }

    shoot(){
        if(this.scene.closestTarget != null){
            //console.log("Shoot missile");
            this.scene.addPlayerProjectile(new MagicMissile(this.scene,this.owner.x,this.owner.y,"arcaneshot",(-1*Math.PI)+(Math.random()*2*Math.PI),1,this.scene.closestTarget,this));
            this.cooldown = this.maxCD;
            this.scene.sound.play("magicmissile", {volume: 0.5});
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