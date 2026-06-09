import { GlobalVariables } from "../GlobalVariables";
import { Augment, Weapon } from "./Weapon";
import { WeaponParams } from "./WeaponOperator";
import { WeaponSlot } from "./WeaponSlot";

export interface WeaponEntry{
    gID: number;
    wID: number;
    augs: Augment[];
    passives: PassiveAbility[];
}

export interface PassiveAbility{
    name: string;
    desc: string;
    activated: boolean;
}

export interface LootEntry{

}


export class Armory {
    public wlist: WeaponSlot[]; // do not push
    public curID: number = -999999993;
    public gunList: Map<number,WeaponEntry>;
    public reference: GlobalVariables;

    
    constructor(ref: GlobalVariables) {
        this.reference = ref;
        this.gunList = new Map([
            [-999999999, {gID: -999999999, wID: 0, augs: [{name: "Impact", index: 1, level: 5, maxlv: 8, lvcap: 10, desc: "Increased base damage."}], passives: this.reference.getGunPassives(0)}],
            [-999999998, {gID: -999999998, wID: 1, augs: [], passives: this.reference.getGunPassives(1)}],
            [-999999997, {gID: -999999997, wID: 2, augs: [{name: "Impact", index: 1, level: 12, maxlv: 13, lvcap: 13, desc: "Increased base damage."},
                {name: "Barrage", index: 2, level: 8, maxlv: 10, lvcap: 10, desc: "Increased rate of fire."},    
                {name: "Penetrator", index: 9, level: 6, maxlv: 8, lvcap: 10, desc: "Increases penetration capability."},
                {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}], passives: this.reference.getGunPassives(2)}],//keep these three defaults the same

            [-999999996, {gID: -999999996, wID: 4, augs: [], passives: this.reference.getGunPassives(4)}],
            [-999999995, {gID: -999999995, wID: 8, augs: [{name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
                {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
                {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
                {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
            ], passives: this.reference.getGunPassives(9)}],
            [-999999994, {gID: -999999994, wID: 2, augs: [], passives: this.reference.getGunPassives(2)}],
            [-999999993, {gID: -999999994, wID: 7, augs: [this.generateAugment(0,0,13,13), this.generateAugment(0,0,13,13), this.generateSpecialAugment(7,1,13,13), this.generateAugment(0,0,13,13), ], passives: this.reference.getGunPassives(7)}],
        ]);


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
    generateAugment(ix: number, lv: number, mxlv: number, lvcap: number): Augment{
        if((ix < this.reference.augList.length) && (ix >= 0)){
            let rt = this.copyAug(this.reference.augList[ix]);
            if(ix == 0){
                rt.level = 0;
            } else {
                rt.level = lv;
            }
            rt.maxlv = mxlv;
            rt.lvcap = lvcap;
            return rt;
        } else {
            console.log("No augment with the specified index is found for creation. Check Armory.ts and GlobalVariables.ts.");
            return {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""};
        }
    }



    addNewGun(wp: WeaponParams, auglist: Augment[]){
        let gun = {
            gID: this.curID+1,
            wID: wp.type,
            augs: auglist,
            passives: wp.passives,
        }
        this.addGun(gun.gID,gun);
        this.curID++;
    }
    /*

    rollRandomAugment(tab: number[]): Augment{
        let ap = [];
        for let

    }

    */


    generateSpecialAugment(wp: number, lv: number, mxlv: number, lvcap: number): Augment{
        if(this.reference.gunList.has(wp)){
            let xr = this.reference.gunList.get(wp);
            if(xr != null) {
                let rt = this.copyAug(xr.customaug);
                rt.level = lv;
                rt.maxlv = mxlv;
                rt.lvcap = lvcap;
                return rt;
            } else {
                console.log("Gun at index for fetching special augment is null. Check Armory.ts and GlobalVariables.ts.");
                return {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""};
            }
        } else {
            console.log("No gun with the specified index is found to fetch special augment. Check Armory.ts and GlobalVariables.ts.");
            return {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""};
        }
    }

    addGun(i: number, w: WeaponEntry){
        this.gunList.set(i, this.copy(w));
    }
    
    updateAug(id: number, index: number, ref: Augment){
        if(this.gunList.has(id)) {
            this.gunList.get(id)!.augs[index] = this.copyAug(ref);
        } else {
            console.log("INVALID GUN FETCH ID: " + id);
            return;
        }
    }

    replaceAugs(id: number, index: number, ref: Augment[]){
        if(this.gunList.has(id)) {
            this.gunList.get(id)!.augs = this.copyAugList(ref);
        } else {
            console.log("INVALID GUN FETCH ID: " + id);
            return;
        }
    }

    fetchGun(id: number): WeaponEntry{
        if(this.gunList.has(id)){
            if(this.gunList.get(id) != null){
                return this.copy(this.gunList.get(id)!);
            } else {
                console.log("NULL ENTRY IN GUN LIST: " + id);
                return {gID: -999999999, wID: 0, augs: [], passives: []};
            }
        } else {
            console.log("INVALID GUN FETCH ID: " + id);
            return {gID: -999999999, wID: 0, augs: [], passives: []};
        }
        /*
        for(let n = 0; n < this.myGuns.length; n++){
            if(this.myGuns[n].gID == id){
                return this.copy(this.myGuns[n]);
            }
        }
        console.log("INVALID GUN FETCH ID: " + id);
        return {gID: -999999999, wID: 0, augs: []};
        */
       
    }

    augmentToArray(data: Augment[]): number[] {
        let np = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        data.forEach((a)=> {
            if((a.index < np.length) && (a.index >= 0)){
                np[a.index] += a.level;
            } else {
                console.log("Augment out of bounds for Weapon.");
            }
        });

        return np;
    }

    copy(w: WeaponEntry): WeaponEntry{
        return {
            gID: w.gID,
            wID: w.wID,
            augs: w.augs,
            passives: w.passives,
        }
    }

    copyAug(a: Augment): Augment{
        return {
           name: a.name,
           index: a.index,
           level: a.level,
           maxlv: a.maxlv,
           lvcap: a.lvcap,
           desc: a.desc, 
        }
    }

    copyAugList(a: Augment[]): Augment[]{
        let rt = [];
        for(let ax = 0; ax < a.length; ax++){
            rt.push({
                name: a[ax].name,
                index: a[ax].index,
                level: a[ax].level,
                maxlv: a[ax].maxlv,
                lvcap: a[ax].lvcap,
                desc: a[ax].desc, 
            })
        }
        return rt;
    }
}