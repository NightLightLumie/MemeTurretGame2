import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { VHLaser } from "@/components/Graphics/VHLaser";
import { LavaPool } from "@/components/WeaponFunctions/LavaPool";


export class LavaBucket extends Item{
    public damage: number = 250;
    protected spawnRadius: number = 600;
    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_rd";
        this.cooldown = 10;
        this.maxCD = 12500;
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 25;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), 0];
    }

    findSpawn(): number[] {
        let rr = (-1*Math.PI)+(Math.random()*2*Math.PI);
        let xx = this.owner.x+(this.spawnRadius*Math.cos(rr));
        let yy = this.owner.y+(this.spawnRadius*Math.sin(rr));
        if(xx < this.scene.boundary[0]){
            xx = this.scene.boundary[0];
        }
        if(xx > this.scene.boundary[1]){
            xx = this.scene.boundary[1];
        }

        if(yy < this.scene.boundary[2]){
            yy = this.scene.boundary[2];
        }
        if(yy > this.scene.boundary[3]){
            yy = this.scene.boundary[3];
        }

        return[xx,yy];
    }

    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                let px = this.findSpawn();
                this.scene.addGroundHazard(new LavaPool(this.scene,px[0],px[1],this.owner.getActiveWeapon(),this));
                this.cooldown += this.maxCD;
                this.owner.bankedCasts++;
            }
            return;
        }
    }

}