import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { MagicMissile } from "@/components/WeaponFunctions/MagicMissile";


export class ArcaneMissile extends Item{
    private mode: number = 0;
    public damage: number = 350;
    private shots: number = 1;
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_rd";
        this.cooldown = 10;
        this.maxCD = 3000;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 40;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 250;
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
            let ptw = Math.atan2(this.scene.closestTarget.y-this.owner.y, this.scene.closestTarget.x-this.owner.x);
            let ofs = 2*Math.PI/3;
            let val = 1;
            if(Math.random()<0.5){
                val *= -1;
            }
            for(let n = 0; n < this.shots; n++){
                this.scene.addPlayerProjectile(new MagicMissile(this.scene,this.owner.x,this.owner.y,"arcaneshot",(-0.5*Math.PI)+ptw+(Math.random()*Math.PI)+((this.shots-1)*ofs*val),1.5,this.scene.closestTarget,this));
            }
            this.cooldown = this.maxCD;
            this.scene.sound.play("magicmissile", {volume: 0.5});
            this.owner.bankedCasts++;
            this.shots++;
            if(this.shots > 3){
                this.shots = 1;
            }
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