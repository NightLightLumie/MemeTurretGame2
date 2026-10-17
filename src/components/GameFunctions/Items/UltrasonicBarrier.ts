import { Item } from "./Item";
import { GameScene } from "@/scenes/GameScene";
import { Player } from "@/components/Player";

export class UltrasonicBarrier extends Item {
    private shieldCoeff: number = 0.25;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.owner.pShield = [(this.shieldCoeff*this.owner.maxHP), (this.shieldCoeff*this.owner.maxHP)];
        this.owner.on("ouch", this.pauseShield, this);
        this.cooldown = 0;
        this.maxCD = 3000;
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.shieldCoeff += 0.01;
            this.owner.pShield[1] = (this.shieldCoeff*this.owner.maxHP);
        }
    }

    pauseShield(){
        this.cooldown = this.maxCD;
    }

    update(t: number, d: number){
        this.owner.pShield[1] = (this.shieldCoeff*this.owner.maxHP);
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
            }
            return;
        }
        if(this.owner.pShield[0] < this.owner.pShield[1]){
            this.owner.pShield[0] += (0.01*this.owner.pShield[1])*(d/1000);
            if(this.owner.pShield[0] > this.owner.pShield[1]){
                this.owner.pShield[0] = this.owner.pShield[1];
            }
        }
    }
}

