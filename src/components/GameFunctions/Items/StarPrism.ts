import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class StarPrism extends Item{
    private mode: number = 0;
    public damage: number = 175;
    public shots: number = 0;
    public maxShots: number = 5;
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_rd";
        this.cooldown = 0;
        this.maxCD = 500;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 25;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 10;
            this.cooldown *= this.maxCD;
        } else {
            console.log("Item already at max level.");
            return;
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
        if(this.shots >= this.maxShots) {
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