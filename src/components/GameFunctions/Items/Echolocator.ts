import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

export class Echolocator extends Item{
    public spellBoost: number = 0;
    public gunBoost: number = 0;
    private spellStackValue: number = 0.1;
    private gunStackValue: number = 0.05;
    public spellStackTimer: number[] = [0,10000];
    public gunStackTimer: number[] = [0,10000];
    private spcd: number = 0;
    private maxSpcd: number = 0;

    constructor(scene: GameScene, p: Player, name: string, slot: number){
        super(scene, p, name, slot);
        this.tileType = "item_gr";
        this.cooldown = 10;
        this.maxCD = 1000;
        this.spcd = 10;
        this.maxSpcd = 1000;
        this.spellStackValue = 0.1;
        this.gunStackValue = 0.05;
    }

    fetchItemData(): number[] {
        return[this.gunBoost*this.gunStackValue, this.spellBoost*this.spellStackValue];
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
            this.cooldown = this.cooldown/this.maxCD;
            this.maxCD -= 50;
            this.cooldown *= this.maxCD;

            this.spellStackTimer[0] = this.spellStackTimer[0]/this.spellStackTimer[1];
            this.spellStackTimer[1] += 1;
            this.spellStackTimer[0] *= this.spellStackTimer[1];

            this.gunStackTimer[0] = this.gunStackTimer[0]/this.gunStackTimer[1];
            this.gunStackTimer[1] += 1;
            this.gunStackTimer[0] *= this.gunStackTimer[1];

            this.owner.bonusGunDamage -= (this.gunBoost*this.gunStackValue);
            this.owner.bonusSpellDamage -= (this.spellBoost*this.spellStackValue);
            this.gunStackValue += 0.005;
            this.spellStackValue += 0.01;
            this.owner.bonusGunDamage += (this.gunBoost*this.gunStackValue);
            this.owner.bonusSpellDamage += (this.spellBoost*this.spellStackValue);
        } else {
            console.log("Item already at max level.");
            return;
        }
    }

    updateStackExpiration(t: number, d: number){
        if(this.spellStackTimer[0] > 0){
            this.spellStackTimer[0] -= d;
            if(this.spellStackTimer[0] <= 0){
                this.owner.bonusSpellDamage -= this.spellBoost*this.spellStackValue;
                this.spellBoost = 0;
            }
        }
        if(this.gunStackTimer[0] > 0){
            this.gunStackTimer[0] -= d;
            if(this.gunStackTimer[0] <= 0){
                this.owner.bonusGunDamage -= this.gunBoost*this.gunStackValue;
                this.gunBoost = 0;
            }
        }
    }

    updateStackAddition(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
                this.owner.canResonate[0] = true;
            }
        }
        if(this.spcd > 0){
            this.spcd -= d;
            if(this.spcd <= 0){
                this.spcd = 0;
                this.owner.canResonate[1] = true;
            }
        }
    }

    update(t: number, d: number){
        this.updateStackExpiration(t, d);
        this.updateStackAddition(t, d);
    }

    resonate(typ: string){
        if(typ == "spell"){
            if((this.cooldown <= 0)){
                if(this.gunBoost < 10)
                {
                    this.gunBoost++;
                    this.owner.bonusGunDamage += (this.gunStackValue);
                }
                this.cooldown = this.maxCD;
                this.owner.canResonate[0] = false;
                this.gunStackTimer[0] = this.gunStackTimer[1];
            }
        } else if(typ == "gun"){
            if((this.spcd <= 0)){
                if(this.spellBoost < 10){
                    this.spellBoost++;
                    this.owner.bonusSpellDamage += (this.spellStackValue);
                }
                this.spcd = this.maxSpcd;
                this.owner.canResonate[1] = false;
                this.spellStackTimer[0] = this.spellStackTimer[1];
            }
        }
    }

    setCooldown(): boolean {
        let bx = 0;
        if(this.cooldown <= 0) {
            this.cooldown = this.maxCD;
            this.owner.canResonate[0] = false;
            bx++;
        }
        if(this.spcd <= 0){
            this.spcd = this.maxSpcd;
            this.owner.canResonate[1] = false;
            bx++;
        }
        if(bx > 0){
            return true;
        } else {
            return false;
        }
    }

}