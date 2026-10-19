import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";
import { VHLaser } from "@/components/Graphics/VHLaser";


export class BasicAttackMagic extends Item{
    public damage: number = 350;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 500;
        this.maxCD = 500;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.damage += 20;
            let e = this.cooldown/this.maxCD;
            this.maxCD -= 200;
            this.cooldown = e*this.maxCD;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), 0];
    }

    shoot(){
        let st = "x";
        if(Math.random()<0.5){
            st = "y";
        }
        this.scene.addHitEffect(new VHLaser(this.scene,this.owner.trackedCursor[0], this.owner.trackedCursor[1],"zoltraak",[0,1,0],[50,200],[1,1,0],st));
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