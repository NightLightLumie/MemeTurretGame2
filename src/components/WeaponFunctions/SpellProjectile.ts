import { GameScene } from "@/scenes/GameScene";
import { Missile } from "./Missile";
import { Weapon } from "./Weapon";
import { Target } from "../Target";
import { BasicEffect } from "../BasicEffect";
import { Item } from "../GameFunctions/Item";

export class SpellProjectile extends Missile{
    public scene: GameScene;
    private owner: Weapon;
    private eScale: number = 1;
    public sfile: string = "";
    public blast: number = 0;
    private multiplier: number = 1;
    private ref: Item;
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, owner: Weapon, ref: Item){
        super(scene,x,y,name,angle);
        this.scene = scene;
        this.owner = owner;
        this.ref = ref;
        this.damage = 100;
        this.initiateParams();
    }

    initiateParams(){
        switch(this.key){
            case "fireball": {
                this.v[0] *= 1800;
                this.v[1] *= 1800;
                this.damage = this.owner.damage;
                this.radius = 18;
                break;
            }
             default: {
                break;
            }
        }
    }
    
    rollDirectHit(){
        
    }

    processHit(t: Target): void {
        if(!this.deleteFlag){
            if(t.takeDamage(this.damage)){
                this.deleteFlag = true;
                this.scene.playSound("meme_explosion",0.5);
                this.scene.addHitEffect(new BasicEffect(this.scene,"exp",this.x,this.y,25,15,false,2,Math.random()*360,[this.eScale,this.eScale]));
            }

        }

    }
}