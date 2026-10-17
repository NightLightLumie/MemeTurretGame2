import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";
import { ScalingEffect } from "@/components/Graphics/ScalingEffect";

export class RuneCircle extends Item{
    public percent: number = 0.5;
    private dmgRadius: number = 600;
    private fRad: number = 144; //super hacky
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 5000;
        this.maxCD = 5000;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.percent += 0.05;
        }
    }

    fetchItemData(): number[] {
        return[this.percent*this.owner.health*(1+this.owner.bonusSpellDamage), 0];
    }

    shock(){
        this.scene.simpleExplode(this.percent*this.owner.health*(1+this.owner.bonusSpellDamage),this.owner.x,this.owner.y,this.dmgRadius,"spell");
        let i = 360;
        if(Math.random()<0.5){
            i *= -1;
        }
        this.scene.addHitEffect(new ScalingEffect(this.scene,this.owner.x,this.owner.y,"bigrune",500,Math.random()*360,i,[2.5,2.5],[1,0],"follow"));
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