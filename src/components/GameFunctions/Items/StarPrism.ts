import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class StarPrism extends Item{
    private mode: number = 0;
    public damage: number = 175;
    private shots: number = 0;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 0;
        this.maxCD = 500;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 20;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), (1+this.owner.bonusGunDamage)*this.owner.conversion*this.owner.getActiveWeapon().damage];
    }

    shootStars(){
        if(this.mode == 0){
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x+100,this.owner.y,"starshot",0,this.owner.getActiveWeapon(),this,1));
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x,this.owner.y+100,"starshot",Math.PI/2,this.owner.getActiveWeapon(),this,1));
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x-100,this.owner.y,"starshot",Math.PI,this.owner.getActiveWeapon(),this,1));
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x,this.owner.y-100,"starshot",3*Math.PI/2,this.owner.getActiveWeapon(),this,1));
        } else {
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x+(100*Math.cos(Math.PI/4)),this.owner.y+(100*Math.sin(Math.PI/4)),"starshot",Math.PI/4,this.owner.getActiveWeapon(),this,1));
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x+(100*Math.cos(3*Math.PI/4)),this.owner.y+(100*Math.sin(3*Math.PI/4)),"starshot",3*Math.PI/4,this.owner.getActiveWeapon(),this,1));
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x+(100*Math.cos(5*Math.PI/4)),this.owner.y+(100*Math.sin(5*Math.PI/4)),"starshot",5*Math.PI/4,this.owner.getActiveWeapon(),this,1));
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,this.owner.x+(100*Math.cos(7*Math.PI/4)),this.owner.y+(100*Math.sin(7*Math.PI/4)),"starshot",7*Math.PI/4,this.owner.getActiveWeapon(),this,1));
        }
        this.owner.bankedCasts++;
    }

    update(t: number, d: number){
        this.shots += this.owner.trackShots;
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
            }
            return;
        }
        if(this.shots >= 5) {
            this.shots = 0;
            this.shootStars();
            this.mode++;
            if(this.mode > 1){
                this.mode = 0;
            }
            this.cooldown = this.maxCD;
        }
    }

}