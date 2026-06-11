import { GameScene } from "@/scenes/GameScene";
import { Missile } from "./Missile";
import { Weapon } from "./Weapon";
import { Target } from "../Target";
import { BasicEffect } from "../BasicEffect";

export class Rocket extends Missile{
    public scene: GameScene;
    private owner: Weapon;
    private eScale: number = 1;
    public sfile: string = "";
    public blast: number = 0;
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, owner: Weapon){
        super(scene,x,y,name,angle);
        this.scene = scene;
        this.owner = owner;
        this.damage = this.owner.damage;
        this.initiateParams();
    }

    initiateParams(){
        switch(this.owner.wp.type){
            case 6: {
                this.v[0] *= this.owner.wp.spd;
                this.v[1] *= this.owner.wp.spd;
                this.damage = this.owner.damage;
                this.blast = this.owner.width;
                this.radius = 18;
                this.eScale = 2*this.owner.width/256;
                this.sfile = "meme_explosion";
                break;
            }
             default: {
                break;
            }
        }
    }

    processHit(t: Target): void {
        this.deleteFlag = true;
        this.scene.simpleExplode(this.damage,this.x,this.y,this.blast);
        this.scene.addHitEffect(new BasicEffect(this.scene,"exp",this.x,this.y,25,15,false,2,Math.random()*360,[this.eScale,this.eScale]));
    }
}