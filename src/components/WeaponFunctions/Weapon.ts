import { BaseScene } from "@/scenes/BaseScene";
import { WeaponOperator, WeaponParams } from "./WeaponOperator";
//10 upgrade slots
//up to 3, +1 for augmentation
//level goes to 10, + 13 for augmentation



export interface Augment{
    name: string;
    index: number;
    level: number;
    maxlv: number;
    lvcap: number;
    desc: string;

}
export interface WeaponData {
    
    rarity: number;
    type: number;     

}

export interface BurstTracker{
    amt: number;
    curCD: number;
    maxCD: number;
    special: boolean;
    ignoreAmmo: boolean;
}

export class Weapon {

    public scene: BaseScene;
    public active: boolean = false;
    public bursts: number[][];
    public type: number;
    public sprite: string;

    public damage: number;
    public dmod: number = 1;

    public cooldown: number = 0;
    public maxCD: number = 100;

    public pierce: number = -1;
    public pcd: number = -999;
    public pmod: number = 1;

    //public augmentTable: Map<string,number> = new Map([]);
    //public augmentCaps: number[] = [0,0]//1,3,5,8,10
    public augs: Augment[] = [];

    public wp: WeaponParams;
//

    public data: WeaponParams;

    public fRad: number = 144;
    //public parser: WeaponOperator;
    public muzzleDist: number;

    public img: string;
    public overflow: number = 0;
    public stored: number = 0;

    public loadTime: number = 0;
    public maxLoad: number = 0;
    public loading: boolean = false;

    public curAmmo: number = 0;
    public maxAmmo: number = 10;

    public onHit: number = 0;

    public augVars: number[];
    public augModifier: number[];

    public arpen: number[] = [0,0];
    public acc: number = 0;

    public specialStat: number = 0;

    public crit: number[] = [0,0];
    private killtracker: number[] = [0,0];
    public pvalue: number[] = [0,0,0,0,0,0];

    public rof: number = 0;



    constructor(scene: BaseScene, wp: WeaponParams, augments: Augment[] = []){
        this.scene = scene;
        this.wp = wp;
        this.augs = augments;
        this.augVars = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.augModifier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        //console.log(this.wp.name + " COOLDOWN: " + this.maxCD);\
        this.loadPassives();
        this.loadAugment();
        this.loadGunValues();
        this.bursts = [];

    }

    /*
        {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
        {name: "Impact", index: 1, level: 0, maxlv: 10, lvcap: 10, desc: "Increased base damage."}, //base damage, +10% each
        {name: "Barrage", index: 2, level: 0, maxlv: 10, lvcap: 10, desc: "Increased rate of fire."}, //RoF, +10% each
        {name: "Magazine", index: 3, level: 0, maxlv: 10, lvcap: 10, desc: "Additional magazine capacity."}, //Capacity, +10% each
        {name: "Swiftload", index: 4, level: 0, maxlv: 10, lvcap: 10, desc: "Reduced reload speed."}, //Reload, -5% each
        {name: "Melter", index: 5, level: 0, maxlv: 10, lvcap: 10, desc: "Additional damage over time."}, //DoT damage, +10% each
        {name: "Flaying", index: 6, level: 0, maxlv: 10, lvcap: 10, desc: "Ignores a portion of resistances."}, //Armor pen, +5% each
        {name: "Razor Shot", index: 7, level: 0, maxlv: 10, lvcap: 10, desc: "Increased on-hit damage."}, //On hit damage, +10% each
        {name: "Demolition", index: 8, level: 0, maxlv: 10, lvcap: 10, desc: "Enlarged blast radius."}, //Blast radius, +5% each
        {name: "Penetrator", index: 9, level: 0, maxlv: 10, lvcap: 10, desc: "Increases penetration capability."}, //Pierce, +10% each
        {name: "Concentration", index: 10, level: 0, maxlv: 10, lvcap: 10, desc: "Narrowed accuracy cone."}, //Accuracy cone, -5% each
        {name: "Critical Eye", index: 11, level: 0, maxlv: 10, lvcap: 10, desc: "Additional base critical hit chance."}, //Crit chance, +2.5% each
        {name: "Merciless", index: 12, level: 0, maxlv: 10, lvcap: 10, desc: "Increased critical hit damage."}, //Crit damage, +10% each
        {name: "Trickshot", index: 13, level: 0, maxlv: 10, lvcap: 10, desc: "Additional direct hit chance."}, //Direct shot (+50% dmg) chance, +5% each
        {name: "Focus", index: 14, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot recharge and rate of fire."}, //Special ammo recharge rate and RoF, +10% each
        {name: "Tactician", index: 15, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot damage."}, //Special ammo damage, +10% each
        {name: "Power Assist", index: 16, level: 0, maxlv: 10, lvcap: 10, desc: "Reduced movement penalty."}, //reduces movement penalty, -5% each
        {name: "Slayer", index: 17, level: 0, maxlv: 10, lvcap: 10, desc: "Increased damage to bosses and elite enemies."}, //Boss and elite damage, +2.5% each
        {name: "CUSTOM", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""},
*/
    loadPassives(){
        if(this.wp.passives.length <= 0){
            return;
        } else {
            this.wp.passives.forEach((p) => {
                if(p.activated) {
                    this.initiatePassive(p.name);
                }
            })
        }
    }

    loadGunValues(){
        this.type = this.wp.type;
        this.damage = this.wp.dmg*(1+(0.1*this.augVars[1]));
        this.rof = (this.wp.rof*(1+(0.1*this.augVars[2])));
        this.maxCD = 1/this.rof;
        this.pierce = this.wp.pen*(1+(0.1*this.augVars[9]));
        this.pcd = this.wp.pcd;
        this.img = ("gun_"+this.wp.type);
        this.curAmmo = Math.round(this.wp.clip)*((1+(0.1*this.augVars[3])));
        this.maxAmmo = Math.round(this.wp.clip)*(1+(0.1*this.augVars[3]));
        this.maxLoad = (1/(1+(0.1*this.augVars[4])))*this.wp.load*1000;
        this.onHit = (this.wp.onhit*(1+(0.1*this.augVars[7])))+(5*this.augVars[7]);
        this.specialStat = this.augVars[18];
        this.arpen = [this.wp.arpen[0]+(this.augVars[6]), this.wp.arpen[1]+(this.augVars[6]*0.05)];
        this.acc = this.wp.acc*(1/(1+(0.1*this.augVars[10])));
        this.crit[0] = this.wp.crit[0]+(0.025*this.augVars[11]);
        this.crit[1] = this.wp.crit[1]+(0.1*this.augVars[12]);
    }

    initiatePassive(name: string){
        switch(name){
            case "Shear": {} case "Quality and Quantity": {}
            case "Hi-Point": {
                this.parseBasePassives(name);
                break;
            } case "Full Tilt": {
                this.maxAmmo = Math.round(this.maxAmmo *= 1.25);
                this.killtracker = [0,8];
                this.maxCD = 1/(this.rof*(1+0.1+(0.05*this.killtracker[2])));
                break;
            } case "Snaggletooth": {
                this.pvalue[0] += 0.5
                this.pvalue[1] += 0.35;
                break;
            } case "Domination": {
                this.pvalue[0] += 0.35;
                this.pvalue[1] += 0.35;
                break;
            } case "Romp": {
                this.pvalue[0] += 1;
                break;
            } case "Otter Space": {
                this.pvalue[0] += 1;
                break;
            } default: {
                break;
            }
        }
    }

    parseBasePassives(name: string){
        switch(name){
            case "Hi-Point": {
                this.damage*=1.15;
                this.pierce += 1*(1+(0.1*this.augVars[9]));
                break;
            } case "Quality and Quantity": {
                this.onHit += 12;
                break;
            } case "Shear": {
                this.maxCD = 1/(this.rof+2);
                this.pierce += 1;
                break;
            } default: {
                break;
            }
        }
    }

    canShoot(): boolean{
        if((this.loading) || (this.cooldown > 0)) {
            return false;
        } else if (this.curAmmo < 1) {
            return false;
        } else {
            return true;
        }
    }

    loadAmmo(){

    }

    reload(){

    }

    loadAugment(){
        this.augs.forEach((a)=> {
            if((a.index < this.augVars.length) && (a.index >= 0)){
                this.augVars[a.index] += a.level;
            } else {
                console.log("Augment out of bounds for Weapon.");
            }
        });
    }



    update(t:number, d:number){
        if(this.cooldown > 0) { //fixme better overflow tracking, if it gets too close this will gradually just converge to zero
            this.cooldown -= d;
            if(this.cooldown <= 0){
                this.overflow = this.cooldown;
            }
        }

        if(this.loading){
            if(this.loadTime > 0){
                this.loadTime -= d;
                if(this.loadTime <= 0){
                    this.scene.sound.play("end_reload", {volume:0.75});
                    this.loadTime = 0;
                    this.loading = false;
                    this.curAmmo = this.maxAmmo;
                }
            }
        }

    }

    updatePassives(){
        
    }

    updateCooldown(){
        if(Math.abs(this.overflow) < (this.maxCD*1000)){
            this.cooldown = this.overflow+(this.maxCD*1000);
            //console.log(this.wp.name + "CURRENT COOLDOWN: " + this.cooldown);
            this.overflow = 0;
        } else {
            this.handleOverflow();
        }
    }

    updateAmmo(n: number){
        this.curAmmo -= n;
        if(this.curAmmo <= 0){
            this.scene.sound.play("start_reload", {volume:0.75});
            this.loadTime = this.maxLoad;
            this.loading = true;
        }
    }

    handleOverflow(){
        this.overflow = Math.abs(this.overflow);
        if(this.overflow > (this.maxCD*1000)){
            this.stored += Math.trunc(this.overflow/(this.maxCD*1000));
            this.overflow -= (this.stored*this.maxCD*1000);
            this.cooldown = (this.maxCD*1000) - this.overflow;
            if(this.cooldown < 0){
                this.cooldown = 0.0001;
            }
            this.overflow = 0;
        }
    }

    reset(){
        this.bursts = [];
        if(this.loadTime > 0) {
            this.loadTime = this.maxLoad;
        }
    }

    fire(){

    }

    upgrade(){

    }

    processAugments(){

    }

}