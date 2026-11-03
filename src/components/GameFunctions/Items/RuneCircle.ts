import { DamageInstance, GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";
import { ScalingEffect } from "@/components/Graphics/ScalingEffect";

export class RuneCircle extends Item{
    public percent: number = 0.5;
    private dmgRadius: number = 600;
    private fRad: number = 144; //super hacky
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_rd";
        this.cooldown = 10;
        this.maxCD = 5000;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.percent += 0.2;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 200;
            this.cooldown *= this.maxCD;
        } else {
            console.log("Item already at max level.");
            return;
        }
    }

    fetchItemData(): number[] {
        return[this.percent*this.owner.health*(1+this.owner.bonusSpellDamage), 0];
    }

    shock(){
        let dlist: DamageInstance[] = [];
        dlist.push({amt: this.percent*this.owner.health*(1+this.owner.bonusSpellDamage), type: "spell", tags: ["spell","aoe"]});
        if(this.owner.conversion > 0){
            dlist.push({amt: (this.owner.conversion*this.owner.getActiveWeapon().damage), type: "gun", tags: ["gun","aoe"]});
        }

        this.scene.simpleExplode(dlist,this.owner.x,this.owner.y,this.dmgRadius);
        let i = 360;
        if(Math.random()<0.5){
            i *= -1;
        }
        this.scene.addHitEffect(new ScalingEffect(this.scene,this.owner.x,this.owner.y,"bigrune",500,Math.random()*360,i,[2.5,2.5],[1,0],"follow"));
        this.scene.sound.play("runethud", {volume: 0.75});
        this.owner.bankedCasts++;
    }


    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.shock();
                this.cooldown = this.maxCD;
            }
        }
    }

}