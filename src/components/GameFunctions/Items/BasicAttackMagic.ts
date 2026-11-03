import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { VHLaser } from "@/components/Graphics/VHLaser";


export class BasicAttackMagic extends Item{
    public damage: number = 250;
    public crit: number = 0.2;
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_rd";
        this.cooldown = 10;
        this.maxCD = 5000;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 20;
            this.crit += 0.03;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 400;
            this.cooldown *= this.maxCD;
        } else {
            console.log("Item already at max level.");
            return;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), this.owner.conversion*this.owner.getActiveWeapon().damage*(1+this.owner.bonusGunDamage), this.crit];
    }

    shoot(){
        let st = "x";
        if(Math.random()<0.5){
            st = "y";
        }
        this.scene.addHitEffect(new VHLaser(this.scene,this.owner.trackedCursor[0], this.owner.trackedCursor[1],"zoltraak",[0,1,0],[50,200],[1,1,0.75],st, this.fetchItemData()));
        this.scene.sound.play("basicmagicblast", {volume: 0.25});
        this.cooldown = this.maxCD;
        this.owner.bankedCasts++;
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