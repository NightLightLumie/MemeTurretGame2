import { GameScene } from "@/scenes/GameScene";
import { Missile } from "./Missile";
import { Weapon } from "./Weapon";
import { Target } from "../Target";
import { BasicEffect } from "../Graphics/BasicEffect";
import { Item } from "../GameFunctions/Items/Item";
import { BlendModes } from "phaser";

export class SpellProjectile extends Missile{
    public scene: GameScene;
    private owner: Weapon;
    private eScale: number = 1;
    public sfile: string = "";
    public blast: number = 0;
    public pierce: number = 0;
    private multiplier: number = 1;
    private ref: Item;
    private stored: number[];
    private effectName: string;
    private boom: boolean;
    private hitScale: number[] = [1,1];
    private gunBonus: number = 0;
    private damageType: string = "spell";
    private tags: string[] = ["spell", "projectile"];


    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, owner: Weapon, ref: Item, vscale: number = 1){
        super(scene,x,y,name,angle, vscale);
        this.scene = scene;
        this.owner = owner;
        this.ref = ref;
        this.damage = 100;
        this.stored = [];
        this.effectName = "spellhitpink";
        this.boom = false;
        this.initiateParams();
        this.gunBonus = (this.scene.player.getActiveWeapon().damage*this.scene.player.conversion*(1+this.scene.player.bonusGunDamage));
    }

    initiateParams(){
        switch(this.key){
            case "fireball": {
                this.spr.setTexture("fireshot");
                this.doAnim = true;
                this.maxFrames = 4;
                if(Math.random() < 0.5){
                    this.spr.setScale(1,-1);
                }
                this.fLen = [0,50,0];
                this.trail = this.scene.add.particles(0,0,"firesq",{
                    frame: 0,
                    x: 0,
                    y: 0,
                    angle: {min: -180, max: 180},
                    speed: 120,
                    follow: this,
                    frequency: 40,
                    alpha: {start: 0.8, end: 0},
                    scale: {start: 0.75, end: 0.5},
                    rotate: {min: -180, max: 180},
                    lifespan: 300,
                    blendMode: BlendModes.ADD
                });
                this.scene.referForDelete(this.trail);
                this.v[0] *= 1800;
                this.v[1] *= 1800;
                this.damage = this.ref.fetchItemData()[0];
                this.radius = 80;
                this.pierce = 0;
                this.effectName = "spellhitorange";
                this.boom = true; 
                break;
            } case "starshot": {
                this.v[0] *= 1600;
                this.v[1] *= 1600;
                this.damage = this.ref.fetchItemData()[0];
                this.pierce = -1;
                this.radius = 120;
                this.spr.setScale(2);
                this.spin = -720 + (Math.random()*1440);
                this.effectName = "spellhitblue";
                this.boom = false; 
                break;
            } case "arrow": {
                let k = (Math.random()*800);
                this.v[0] *= 2800+k;
                this.v[1] *= 2800+k;
                this.damage = this.ref.fetchItemData()[0];
                this.radius = 20;
                this.pierce = 2;
                this.effectName = "spellhitshadow";
                this.boom = false; 
                break;
            } case "greenarrow": {
                let k = (Math.random()*0);
                this.v[0] *= 1800+k;
                this.v[1] *= 1800+k;
                this.damage = this.ref.fetchItemData()[0]*0.8;
                this.radius = 43;
                this.pierce = -10;
                this.effectName = "spellhitblue";
                this.boom = false; 
                break;
            } case "bigblue": {
                let k = (Math.random()*200);
                this.v[0] *= 700+k;
                this.v[1] *= 700+k;
                this.damage = this.ref.fetchItemData()[0]*1.5;
                this.hitScale = [2,2];
                this.radius = 72;
                this.pierce = 0;
                this.effectName = "spellhitblue";
                this.boom = false; 
                break;
            } case "purplecard": {
                let k = (Math.random()*200);
                this.v[0] *= 1500+k;
                this.v[1] *= 1500+k;
                this.damage = this.ref.fetchItemData()[0];
                this.radius = 38;
                this.pierce = 3;
                this.effectName = "spellhitshadow";
                this.boom = false; 
                break;
            } case "reddiamond": {
                let k = (Math.random()*200);
                this.v[0] *= 1100+k;
                this.v[1] *= 1100+k;
                this.damage = this.ref.fetchItemData()[0];
                this.radius = 27;
                this.pierce = 1;
                this.effectName = "spellhitorange";
                this.boom = false; 
                break;
            } case "yellowknife": {
                let k = (Math.random()*200);
                this.v[0] *= 1200+k;
                this.v[1] *= 1200+k;
                let ct = Math.random();
                if(ct < 0.4){
                    ct = 2;
                    this.damageType = "spellcrit";
                    this.tags.push("crit");
                } else {
                    ct = 1;
                }
                this.damage = this.ref.fetchItemData()[0]*ct;
                this.radius = 48;
                this.pierce = 1;
                this.effectName = "spellhitorange";
                this.boom = false; 
                break;
            } default: {
                break;
            }
        }
    }
    
    rollDirectHit(){
        
    }


    hitCheck(t: Target){
        let r = this.targetDist(t);
        if(r < (this.radius+t.radius)){
            this.processHit(t);
        }
    }

    logEnemy(t: Target){
        if(!this.stored.includes(t.tID)){
            this.stored.push(t.tID);
        }
    }

    processHit(t: Target): void {
        if(!this.deleteFlag){
            if(this.stored.includes(t.tID)){
                return;
            } else if(t.takeTypedDamage({amt: this.damage,type: this.damageType, tags: this.tags}, [20,20])){
                if(this.pierce == 0){
                    this.deleteFlag = true;
                    if(this.trail != null){
                        this.trail.stop();
                    }
                } else {
                    if(this.pierce > 0){
                        this.pierce--;
                    }
                    this.stored.push(t.tID);
                }
                if(this.boom){
                    this.scene.playSound("meme_explosion",0.5);
                    this.scene.addHitEffect(new BasicEffect(this.scene,"exp",this.x,this.y,25,15,false,2,Math.random()*360,[this.eScale,this.eScale]));
                }
                this.scene.addHitEffect(new BasicEffect(this.scene,this.effectName,t.x,t.y,3,100,false,0,Math.random()*360,this.hitScale));
                if(this.scene.player.conversion > 0){
                    t.takeTypedDamage({amt: this.gunBonus, type: "gun", tags: ["gun", "projectile", "onhit"]}, [20,20]);
                }
            }

        }

    }
}