import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { WeaponOperator, WeaponParams } from "./WeaponOperator";
import { emit } from "node:cluster";
import { BurstTracker } from "./Weapon";
import { Augment } from "./Weapon";
//10 upgrade slots
//up to 3, +1 for augmentation
//level goes to 10, + 13 for augmentation

export class WeaponFrame {

    public scene: BaseScene;
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

    public onHit: number = 0;

    public augVars: number[];
    public augModifier: number[];

    public arpen: number[] = [0,0];
    public acc: number = 0;

    public specialStat: number = 0;

    public crit: number[] = [0,0];
    private killtracker: number[] = [0,0];
    public pvalue: number[] = [0,0,0,0,0,0];
    public width: number = 0;
    public blast: number = 0;

    public rof: number = 0;

    public speed: number = 1;
    public repeats: number[] = [];
    public dh: number = 0;
    public shots: number = 1;


    constructor(scene: BaseScene, wp: WeaponParams, augments: Augment[] = []){
        this.scene = scene;
        this.wp = wp;
        this.augs = augments;
        this.augVars = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.augModifier = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        //console.log(this.wp.name + " COOLDOWN: " + this.maxCD);\
        this.loadAugment();
        this.loadGunValues();
        this.loadPassives();
        this.bursts = [];

    }

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
        this.maxCD = 1000/this.rof;
        this.pierce = this.wp.pen*(1+(0.1*this.augVars[9]));
        this.pcd = this.wp.pcd;
        this.shots = this.wp.shots;
        this.img = ("gun_"+this.wp.type);
        this.curAmmo = Math.trunc(Math.round(this.wp.clip)*((1+(0.1*this.augVars[3]))));
        this.maxAmmo = Math.trunc(Math.round(this.wp.clip)*((1+(0.1*this.augVars[3]))));
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
                this.killtracker = [0,8];
                this.maxCD = 1000/(this.rof*(1+0.1+(0.05*this.killtracker[2])));
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


    loadAugment(){
        this.augs.forEach((a)=> {
            if((a.index < this.augVars.length) && (a.index >= 0)){
                this.augVars[a.index] += a.level;
            } else {
                console.log("Augment out of bounds for Weapon.");
            }
        });
    }
}
