import { Item } from "../GameFunctions/Items/Item";
import { HomingTracer } from "./HomingTracer";
import { GameScene } from "@/scenes/GameScene";
import { Target } from "../Target";
import { BasicEffect } from "../Graphics/BasicEffect";

export class MagicMissile extends HomingTracer{
    private gdmg: number = 0;
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, vscale: number, t: Target, ref: Item){
        super(scene,x,y,name,angle,vscale,t);
        this.damage = ref.fetchItemData()[0];
        this.gdmg = (this.scene.player.getActiveWeapon().damage*this.scene.player.conversion*(1+this.scene.player.bonusGunDamage));

        this.radius = 25;
        this.turnAngle = 2*Math.PI;
        this.ignoreNonTargets = true;
        this.baseSpeed = 2400;
        this.addTrail();
    }

    processHit(t: Target): void {
        if(!this.deleteFlag){
            this.deleteFlag = true;
            this.px.stop();
            this.scene.playSound("arcanehit",0.5);
            t.takeTypedDamage({amt: this.damage, type: "spell", tags: ["spell", "projectile"]}, [20,20]);
            t.takeTypedDamage({amt: this.gdmg, type: "gun", tags: ["gun", "projectile", "onhit"]}, [20,20]);
            this.scene.addHitEffect(new BasicEffect(this.scene,"spellhitorange",this.x,this.y,3,100,false,0,Math.random()*360,[1.5,1.5]));
        }
    }
}