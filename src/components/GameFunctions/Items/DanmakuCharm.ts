import { GameScene } from "@/scenes/GameScene";
import { Player } from "../../Player";
import { Item } from "./Item";

import { SpellProjectile } from "@/components/WeaponFunctions/SpellProjectile";
import { HomingTracer } from "@/components/WeaponFunctions/HomingTracer";


export class DanmakuCharm extends Item{
    private mode: number = 0;
    public damage: number = 120;
    private shots: number = 0;
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
        this.tileType = "item_rd";
        this.cooldown = 10;
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
        return[this.damage*(1+this.owner.bonusSpellDamage), (1+this.owner.bonusGunDamage)*this.owner.conversion*this.owner.getActiveWeapon().damage];
    }

    getRandomBullet(): string{
        let tt = Math.random();
        if(tt < 0.2){
            return "greenarrow";
        } else if (tt < 0.4) {
            return "purplecard";
        } else if (tt < 0.6) {
            return "yellowknife";
        } else if (tt < 0.8) {
            return "bigblue";
        } else {
            return "reddiamond";
        }
    }

    shoot(xx: number, yy: number){
        let xmode = 0;

        switch(xmode){

        }
        this.owner.bankedCasts++;
        this.owner.danmaku = false;
        let bb = (-1*Math.PI)+(Math.random()*2*Math.PI);
        for(let xn = 0; xn < 16; xn++){
            this.scene.addPlayerProjectile(new SpellProjectile(this.scene,xx,yy,this.getRandomBullet(),bb,this.owner.getActiveWeapon(),this,1));
            bb += 2*Math.PI/16;
            if(bb > Math.PI){
                bb -= 2*Math.PI;
            }
        }
        this.cooldown += this.maxCD;
        this.scene.sound.play("thshoot", {volume: 0.25});

        /*

        if(this.scene.closestTarget != null){
            //console.log("Shoot missile");
            this.scene.addPlayerProjectile(new HomingTracer(this.scene,this.owner.x,this.owner.y,"arcaneshot",(-1*Math.PI)+(Math.random()*2*Math.PI),1,this.scene.closestTarget));
            this.cooldown = this.maxCD;
            this.owner.bankedCasts++;
        } else {
            //console.log("Null target");
        }
        */
        return;

    }

    update(t: number, d: number){
        if(this.cooldown > 0){
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.cooldown = 0;
                this.owner.danmaku = true;
            }
            return;
        }
    }

}