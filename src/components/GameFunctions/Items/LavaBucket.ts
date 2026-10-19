import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { VHLaser } from "@/components/Graphics/VHLaser";
import { LavaPool } from "@/components/WeaponFunctions/LavaPool";


export class LavaBucket extends Item{
    public damage: number = 250;
    protected spawnRadius: number = 600;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 10;
        this.maxCD = 12500;
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 10;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), 0];
    }

    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                let rr = (-1*Math.PI)+(Math.random()*2*Math.PI);
                this.scene.addGroundHazard(new LavaPool(this.scene,this.owner.x+(this.spawnRadius*Math.cos(rr)),this.owner.y+(this.spawnRadius*Math.sin(rr)),this.owner.getActiveWeapon(),this));
                this.cooldown += this.maxCD;
                this.owner.bankedCasts++;
            }
            return;
        }
    }

}