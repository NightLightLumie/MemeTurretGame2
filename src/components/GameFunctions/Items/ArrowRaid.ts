import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";

export class ArrowRaid extends Item{
    private mode: number = 0;
    public damage: number = 295;
    private shots: number = 13;
    private dist: number = 0;
    private maxDist: number = 600;
    private fRad: number = 144; //super hacky
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 0;
        this.maxCD = 500;
    }


    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.shots += 1;
        }
    }

    fetchItemData(): number[] {
        return[this.damage*(1+this.owner.bonusSpellDamage), 0];
    }

    shootArrows(){
        let gx = this.owner.x + (Math.cos(this.owner.curGunAngle)*this.fRad);
        let gy = this.owner.y + (Math.sin(this.owner.curGunAngle)*this.fRad);
        let part = Math.PI/6;
        let start = this.owner.curGunAngle-(part/2)
        let slice = part/(this.shots-1);
        for(let n = 0; n < this.shots; n++){
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,gx,gy,"arrow",start+(n*slice),this.owner.getActiveWeapon(),this,1));
        }
    }


    update(t: number, d: number){
        this.dist += this.owner.distanceElapsed;
        /*
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
            }
            return;
        }*/
        if(this.dist >= this.maxDist) {
            this.dist = 0;
            this.shootArrows();
        }
    }

}