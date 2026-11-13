import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
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
    overflow: number;
    stored: number;
}

export class Weapon extends Phaser.Events.EventEmitter{

    public scene: GameScene;
    public active: boolean = false;
    public bursts: BurstTracker[];
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

    public spDmg: number = 1;

    public onHit: number = 0;

    public augVars: number[];
    public augModifier: number[];

    public arpen: number[] = [0,0];
    public acc: number = 0;

    public specialStat: number = 0;

    public crit: number[] = [0,0];
    public killtracker: number[] = [0,0];
    public conv: number = 0;
    public pvalue: number[] = [0,0,0,0,0,0];
    public width: number = 0;
    public blast: number = 0;
    public burstData: number[] = [1,1];

    public rof: number = 0;

    public speed: number = 1;
    public repeats: number[] = [];
    public dh: number = 0;
    public shots: number = 1;
    public lastAmmoReloaded = 0;
    public updaters: string[] = [];

    public curSp: number = 1000;
    public spCost: number = -1;
    public spRegen: number = 10;
    public spCap: number = 1000;
    public spCD: number[] = [0,10000];
    public spAccel: number = 1;


    constructor(scene: GameScene, wp: WeaponParams, augments: Augment[] = []){
        super();
        this.scene = scene;
        this.wp = wp;
        this.augs = augments;
        this.augVars = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.augModifier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.loadAugment();
        //console.log("augments: " + this.augVars);

        this.loadGunValues();
        this.loadPassives();
        this.bursts = [];
        this.burstData = wp.burst;

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
                //console.log("initiating passive: " + p.name + ", " + p.activated);
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
        this.maxCD = 1000/this.rof;
        this.pierce = this.wp.pen*(1+(0.1*this.augVars[9]));
        this.pcd = this.wp.pcd;
        this.shots = this.wp.shots;
        this.img = ("gun_"+this.wp.type);
        this.curAmmo = Math.trunc(Math.round(this.wp.clip)*((1+(0.1*this.augVars[3]))));
        this.maxAmmo = Math.trunc(Math.round(this.wp.clip)*((1+(0.1*this.augVars[3]))));
        this.spDmg = 1+(0.15*this.augVars[15]);
        this.spCost = this.wp.spcd[0];
        this.spCap = this.wp.spcd[1];
        this.curSp = this.spCap;
        this.spAccel = 1+(0.1*this.augVars[14]);
        this.spRegen = this.wp.spcd[2]*this.spAccel;
        this.spCD = [0,this.wp.spcd[3]*(1/this.spAccel)];
        this.maxLoad = (1/(1+(0.1*this.augVars[4])))*this.wp.load*1000;
        this.onHit = (this.wp.onhit*(1+(0.1*this.augVars[7])))+(3*this.augVars[7]);
        this.arpen = [this.wp.arpen[0]+(this.augVars[6]), this.wp.arpen[1]+(this.augVars[6]*0.05)];
        this.acc = this.wp.acc*(1/(1+(0.1*this.augVars[10])));
        this.crit[0] = this.wp.crit[0]+(0.025*this.augVars[11]);
        this.crit[1] = this.wp.crit[1]*(1+(0.06*this.augVars[12]));
        this.blast = this.wp.rad*(1+(0.05*this.augVars[8]));
        this.speed = (1-this.wp.weight)+(0.05*this.augVars[16]);
        this.dh += 0.1*this.augVars[13];
        this.specialStat = this.augVars[18];
        this.parseSpecialStat()
    }

    parseSpecialStat(){
        switch(this.type){
            case 10: {
                this.pierce += 0.2*this.specialStat;
                this.onHit += 2*this.specialStat;
                break;
            } default: {
                break;
            }
        }
    }

    hasPassive(name: string){
        this.wp.passives.forEach((w) => {
            if(w.name == name){
                return true;
            }
        })
        return false;
    }

    initiatePassive(name: string){
        switch(name){
            case "Shear": {} case "Quality and Quantity": {} case "Wholesale": {}  case "Long Bolts": {}
            case "Hi-Point": {
                this.parseBasePassives(name);
                break;
            } case "Timeless": {
                this.rof += 1;
                this.maxCD = 1000/this.rof;
                this.shots += 3;
                break;
            } case "Full Tilt": {
                this.maxAmmo = Math.trunc(Math.round(this.maxAmmo *= 1.25));
                this.curAmmo = this.maxAmmo;
                this.killtracker = [0,10];
                this.conv = 0.04;
                this.maxCD = 1000/(this.rof*(1+0.1+(this.conv*this.killtracker[0])));
                this.updaters.push(name);
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
            } case "Clearance": {
                this.repeats.push(0.4);
                break;
            } case "Flail": {
                break;
            } case "Havoc": {
                this.pvalue[0] = 1;
            } default: {
                break;
            }
        }
    }

    parseBasePassives(name: string){
        switch(name){
            case "Hi-Point": {
                this.damage*=1.3;
                this.pierce += 1*(1+(0.1*this.augVars[9]));
                break;
            } case "Quality and Quantity": {
                this.onHit += 22;
                break;
            } case "Shear": {
                this.rof += 2;
                this.maxCD = 1000/(this.rof);
                this.pierce += 1;
                break;
            } case "Long Bolts": {
                this.crit[1] += 0.4;
                break;
            } case "Wholesale": {
                this.damage *= 1.6;
                break;
            } default: {
                break;
            }
        }
    }

    canShootSpecial(): boolean{
        if(this.spCost < 0){
            return false;
        }
        
        if(this.curSp < this.spCost){
            return false;
        } else if ((this.spCD[0] > 0)){
            return false;
        } else {
            return true;
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

    canShootBurst(): boolean{
        if((this.loading) || (this.cooldown > 0)) {
            return false;
        } else if (this.getUnallocatedAmmo() < 1) {
            return false;
        } else {
            return true;
        }
    }

    createBurst(sp: boolean): BurstTracker{
        let bb: BurstTracker;
        bb = {
            amt: this.burstData[0],
            curCD: 0,
            maxCD: 1000/this.burstData[1],
            special: sp,
            ignoreAmmo: false,
            overflow: 0,
            stored: 0,
        }
        return bb;
    }
    addBurst(b: BurstTracker){
        this.bursts.push(b);
    }

    getUnallocatedAmmo(): number{
        if(this.bursts.length > 0){
            let ct = 0;
            this.bursts.forEach((b) => {
                if(!b.ignoreAmmo){
                    ct += b.amt;
                }
            })
            let rm = this.curAmmo - ct;
            if(rm <= 0){ 
                rm = 0;
            }
            return rm;
        } else {
            return this.curAmmo;
        }
    }

    rollDirectHit(): number{
        let r = 1;
        let nm = Math.trunc(this.dh);
        let res = this.dh-nm;
        if(nm > 0){
            for(let ii = 0; ii < nm; ii++){
                r*=1.25;
            }
        }
        if(Math.random() < res){
            r*=1.25;
        }
        return r;
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
                this.overflow += Math.abs(this.cooldown);
            }
        }

        if(this.spCD[0] > 0){
            this.spCD[0] -= d;
            if(this.spCD[0] <= 0){
                this.spCD[0] = 0;
            }
        }
        if(this.curSp < this.spCap){
            this.curSp += (this.spRegen*d/1000);
            if(this.curSp > this.spCap){
                this.curSp = this.spCap;
            }
        }

        if(this.loading){
            if(this.loadTime > 0){
                this.loadTime -= d;
                this.killtracker[0] = 0;
                if(this.loadTime <= 0){
                    this.scene.sound.play("end_reload", {volume:0.75});
                    this.loadTime = 0;
                    this.loading = false;
                    this.curAmmo = this.maxAmmo;
                    this.scene.player.emit("finishReload");
                    this.lastAmmoReloaded = 0;
                }
            }
        }

        if(this.updaters.length > 0){
            this.updatePassives();
        }

    }

    updatePassives(){
        this.updaters.forEach((u) => {
            switch(u){
                case "Full Tilt": {
                    this.cooldown = this.cooldown/this.maxCD;
                    this.maxCD = 1000/(this.rof*(1+0.1+(this.conv*this.killtracker[0])));
                    this.cooldown *= this.maxCD;
                    break;
                } default: {
                    break;
                }
            }
        })
    }

    updateCooldown(){
        if(this.overflow < (this.maxCD)){
            this.cooldown = this.maxCD-this.overflow;
            //console.log(this.wp.name + "CURRENT COOLDOWN: " + this.cooldown);
            this.overflow = 0;
        } else {
            this.handleOverflow();
        }
    }

    updateSpCooldown(){
        this.spCD[0] = this.spCD[1];
    }

    updateSpEnergy(){
        this.curSp -= this.spCost;
        if(this.curSp < 0){
            console.log("Special Shot Energy error");
        }
    }

    updateBurstCD(b: BurstTracker){
        
    }

    updateAmmo(n: number){
        this.curAmmo -= n;
        if(this.curAmmo <= 0){
            this.startReload();
        }
    }

    startReload(){
        if((!this.loading) && (this.curAmmo < this.maxAmmo)){
            this.scene.sound.play("start_reload", {volume:0.75});
            this.loadTime = this.maxLoad;
            this.loading = true;
            this.lastAmmoReloaded = this.maxAmmo-this.curAmmo;
            this.scene.player.emit("startReload");
            this.killtracker[0] = 0;
        }
    }

    handleOverflow(){
        if(this.overflow > (this.maxCD)){
            let cn = Math.trunc(this.overflow/this.maxCD)
            this.stored += cn;
            this.overflow -= (cn*this.maxCD);
            this.cooldown = this.maxCD - this.overflow;
            if(this.cooldown < 0){
                this.cooldown = 1;
            }
            this.overflow = 0;
        }
    }

    reset(){
        this.bursts = [];
        this.killtracker[0] = 0;
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