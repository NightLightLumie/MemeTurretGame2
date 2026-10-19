import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { VHLaser } from "@/components/Graphics/VHLaser";


export class KoboldMiniNova extends Item{
    public damage: number = 20;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 250;
        this.maxCD = 250;
        this.owner.addMandala();
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
                this.scene.queueGlobalDamage((1+this.owner.bonusSpellDamage)*this.damage/4)
                this.cooldown += this.maxCD;
            }
            return;
        }
    }

}