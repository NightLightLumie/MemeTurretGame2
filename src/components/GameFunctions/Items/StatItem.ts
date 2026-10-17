import { GameScene } from "@/scenes/GameScene";
import { Item } from "./Item";
import { Player } from "@/components/Player";

export class StatItem extends Item{
    constructor(scene:GameScene, p: Player, id: string, slot: number){
        super(scene, p, id);
        this.addEffect();
    }

    update(t: number, d: number){
    }

    addEffect(){
        switch(this.key){
            case "Yin-Yang Orb": {
                this.owner.shrink += 0.2;
                break;
            } case "Zoomies": {
                this.owner.upgradeSpeed(0.2);
                break;
            } case "Fortify": {
                this.owner.dmgRes += 0.15;
                break;
            } case "Light Dragon's Blessing": {
                this.owner.dmgRes += -1;
                this.owner.dmgCap = 0.25;
                break;
            } case "Vaccine": {
                this.owner.maxIFrames += 100;
                break;
            } case "Disproportionation": {
                this.owner.deferDamage += 0.2;
                break;
            } case "Void Dragon's Blessing": {
                this.owner.smite += 0.15;
                break;
            } case "Ultravibration": {
                this.owner.execute += 0.05;
                break;
            } default: {
                console.log("Cannot find item with name: " + this.key);
                break;
            }
        }
    }

    levelUp(){
        if(this.level < this.maxLevel){
            this.level++;
        }
        switch(this.key){
            case "Yin-Yang Orb": {
                this.owner.shrink += 0.03;
                break;
            } case "Zoomies": {
                this.owner.upgradeSpeed(0.05);
                break;
            } case "Fortify": {
                this.owner.dmgRes += 0.01;
                break;
            } case "Light Dragon's Blessing": {
                this.owner.dmgRes += 0.05;
                this.owner.dmgCap -= 0.01;
                break;
            } case "Vaccine": {
                this.owner.maxIFrames += 15;
                break;
            } case "Disproportionation": {
                this.owner.deferDamage += 0.03;
                break;
            } case "Void Dragon's Blessing": {
                this.owner.smite += 0.01;
                break;
            } case "Ultravibration": {
                this.owner.execute += 0.01;
                break;
            } default: {
                console.log("Cannot find item with name: " + this.key);
                break;
            }
        }
    }
}

