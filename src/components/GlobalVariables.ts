import { Armory, PassiveAbility, WeaponEntry } from "./WeaponFunctions/Armory";
import { WeaponParams } from "./WeaponFunctions/WeaponOperator";
import { Augment } from "./WeaponFunctions/Weapon";
import { WeaponButton } from "./WeaponFunctions/WeaponButton";

export class GlobalVariables {

    public curGunID: number = -999999999;
    public inv: Armory;
    public maxAugOverLevel: number = 13;
    public maxAugLevel: number = 10;

    public augmentWeights: number[][] = [
        [0, 2], // default
        [1, 2], // impact
        [2, 3], // barrage
        [3, 4], // magazine
        [4, 3], // swiftload
        [5, 2], // melter
        [6, 3], // flaying
        [7, 2], // razor shot
        [8, 3], // demolition
        [9, 3], // penetrator
        [10, 4], // concentration
        [11, 2], // critical eye
        [12, 4], // merciless
        [13, 2], // trickshot
        [14, 3], // focus
        [15, 3], // tactician
        [16, 4], // power assist
        [17, 3], // slayer
        [18, 2], // special augment
    ];

    public lootBoxes: number[] = [0,0,0,0];

    public lootTable: number[][] = [

    ]

    public defaultParam: WeaponParams = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
     arpen: [0,0], crit: [0,1], ele: 1, onhit:0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: []};

    public augList: Augment[] = [
        {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
        {name: "Impact", index: 1, level: 0, maxlv: 10, lvcap: 10, desc: "Increased base damage. +10% per upgrade."}, //base damage, +10% each
        {name: "Barrage", index: 2, level: 0, maxlv: 10, lvcap: 10, desc: "Increased rate of fire. +10% per upgrade."}, //RoF, +10% each
        {name: "Magazine", index: 3, level: 0, maxlv: 10, lvcap: 10, desc: "Additional magazine capacity. +10% per upgrade."}, //Capacity, +10% each
        
        {name: "Swiftload", index: 4, level: 0, maxlv: 10, lvcap: 10, desc: "Faster reload speed. +10% per upgrade"}, //Reload, -5% each
        {name: "Melter", index: 5, level: 0, maxlv: 10, lvcap: 10, desc: "Additional damage over time. +10% per upgrade"}, //DoT damage, +10% each
        {name: "Flaying", index: 6, level: 0, maxlv: 10, lvcap: 10, desc: "Ignores a portion of resistances. +1 flat armor ignore and +5% armor ignore per upgrade."}, //Armor pen, +5% each
        {name: "Razor Shot", index: 7, level: 0, maxlv: 10, lvcap: 10, desc: "Increased on-hit damage. +10% and +5 flat damage per upgrade."}, //On hit damage, +10% each
        
        {name: "Demolition", index: 8, level: 0, maxlv: 10, lvcap: 10, desc: "Enlarged blast radius. +5% per upgrade."}, //Blast radius, +5% each
        {name: "Penetrator", index: 9, level: 0, maxlv: 10, lvcap: 10, desc: "Increases penetration capability. +10% per upgrade."}, //Pierce, +10% each
        {name: "Concentration", index: 10, level: 0, maxlv: 10, lvcap: 10, desc: "Increased accuracy. +10% per upgrade."}, //Accuracy cone, -5% each
        {name: "Critical Eye", index: 11, level: 0, maxlv: 10, lvcap: 10, desc: "Additional base critical hit chance. +2.5% per upgrade."}, //Crit chance, +2.5% each
        
        {name: "Merciless", index: 12, level: 0, maxlv: 10, lvcap: 10, desc: "Increased critical hit damage. +10% per upgrade."}, //Crit damage, +10% each
        {name: "Trickshot", index: 13, level: 0, maxlv: 10, lvcap: 10, desc: "Additional direct hit chance. +5% per upgrade"}, //Direct shot (+50% dmg) chance, +5% each
        {name: "Focus", index: 14, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot recharge rate. +10% per upgrade."}, //Special ammo recharge rate and RoF, +10% each
        {name: "Tactician", index: 15, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot damage. + 15% per upgrade."}, //Special ammo damage, +10% each
        
        {name: "Power Assist", index: 16, level: 0, maxlv: 10, lvcap: 10, desc: "Increased movement speed while holding weapon. Stacks additively with movement penalties. +5% per upgrade."}, //reduces movement penalty, -5% each
        {name: "Slayer", index: 17, level: 0, maxlv: 10, lvcap: 10, desc: "Increased damage to bosses and elite enemies. +10% per upgrade."}, //Boss and elite damage, +2.5% each
        {name: "CUSTOM", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""},
    ];


    /*
        augs for: 
        generic anything -      [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0]
        dot weapons -           [0,1,1,1, 1,1,1,1, 0,1,1,1, 1,1,0,0, 1,1,0]
        blast weapons(nocrit) - [0,1,1,1, 1,0,1,1, 1,1,1,0, 0,1,0,0, 1,1,0]
        blast weapons(crit)   - [0,1,1,1, 1,0,1,1, 1,1,1,0, 0,1,0,0, 1,1,0]
        snipers -               [0,1,1,1, 1,0,1,1, 0,1,0,1, 1,1,0,0, 1,1,0]  
    */
    public gunList: Map<number,WeaponParams> = new Map([
        //starting weps
        [0, {type:0,name:"WS-Lontra",class:"pistol", dmg: 115, spd: 20000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: 20, clip: 18, load: 1.5, width: 1, rad: 1,
         acc: 2, arpen: [0,0], crit: [0.001,2.75], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Hi-Point", desc: "Base damage increased by 15%. Base pierce increased by 1.", activated: false}]}],
        [1, {type:1,name:"WS-Windmill",class:"smg", dmg: 95, spd: 20000, rof: 8, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 32, load: 1.5, width: 1, rad: 1,
         acc: 6.5, arpen: [0,0], crit: [0.001,2], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Full Tilt", desc: "Magazine size increased by 25% and rate-of-fire increased by 10%. Hits further increase the rate-of-fire by 2% each, up to 20. Bonus resets on switch.", activated: false}]}],
        [2, {type:2,name:"ANTIK",class:"shotgun", dmg: 115, spd: 20000, rof: 2.5, spcd: 10000, shots: 6, pen: 1.5, pcd: -999, clip: 8, load: 2.5, width: 1, rad: 1,
         acc: 15, arpen: [0,0], crit: [0.001,1.5], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: []}],
        
        [3, {type:3,name:"WS-Broadhead",class:"sniper", dmg: 765, spd: 50000, rof: 1.5, spcd: 10000, shots: 1, pen: 3, pcd: -999, clip: 5, load: 1.75, width: 1, rad: 100,
         acc: 0, arpen: [0,0], crit: [0.001,3], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,0,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: []}],
        [4, {type:4,name:"BJURÖN",class:"assault", dmg: 175, spd: 28000, rof: 6, spcd: 10000, shots: 1, pen: 2, pcd: -999, clip: 40, load: 2, width: 1, rad: 1,
         acc: 4, arpen: [0,0], crit: [0.001,2.5], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Clearance", desc: "Hits from this weapon have a 40% chance to deal damage twice.", activated: false}]}],
        [5, {type:5,name:"TS-Cropper",class:"lmg", dmg: 215, spd: 28000, rof: 7, spcd: 10000, shots: 1, pen: 2.5, pcd: -999, clip: 60, load: 3.5, rad: 1,
         width: 1, acc: 15, arpen: [0.001,2.5], crit: [0,1], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Shear", desc: "+2 flat rate of fire, +1 flat pierce.",activated:false}]}],
        [6, {type:6,name:"LOSSNEN",class:"rocket", dmg: 1125, spd: 28000, rof: 0.8, spcd: 10000, shots: 6, pen: 3, pcd: -999, clip: 5, load: 3.5, width: 20, rad: 1,
         acc: 15, arpen: [0,0], crit: [0.001,1], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 1,1,1,0, 0,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: []}],

        [7, {type:7,name:"Ottertail",class:"smg", dmg: 185, spd: 22000, rof: 11, spcd: 10000, shots: 1, pen: 1.2, pcd: -999, clip: 42, load: 1.75, width: 1, rad: 1,
         acc: 9, arpen: [0,0], crit: [0.001,2], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,1], customaug: {name: "Spiral Shots", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: "Increased stack damage of Romp. +20% per upgrade."},
        passives: [{name: "Romp", desc: "Hits from this weapon apply a stack of Romp. At 7 stacks, detonate to deal ", activated: true},
            {name: "Screwdriver", desc: "Alt-fire to shoot a rapid burst of 7 shots.", activated: true},
            {name: "Otter Space", desc: "Each shot inflicts an additional stack of Romp.", activated: true}
        ]}],
        [8, {type:8,name:"NTR-141",class:"pistol", dmg: 60, spd: 20000, rof: 16, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 21, load: 1.75, width: 1, rad: 1,
         acc: 2, arpen: [0,0], crit: [0.001,2.75], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Quality and Quantity", desc: "+12 flat on-hit damage", activated: false}]}],
        [9, {type:9,name:"Two-Fanged Wolf",class:"smg", dmg: 230, spd: 20000, rof: 5, spcd: 10000, shots: 2, pen: 1.75, pcd: -999, clip: 210, load: 1.75, width: 1, rad: 1,
         acc: 1.5, arpen: [0,0], crit: [0.001,2.25], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Snaggletooth", desc: "50% chance to fire a third, inaccurate shot with 35% increased critical strike chance.", activated: true},
            {name: "Pack Tactics", desc: "All shots will critically strike if any shot rolls a critical strike.", activated: true},
            {name: "Domination", desc: "Third shot fire chance and critical strike chance increased by 35% each.", activated: false},
         ]}],

    ]);



    public side: WeaponEntry;
    public primary: WeaponEntry;
    public secondary: WeaponEntry;

    constructor(){
        this.inv = new Armory(this);
        this.side = this.inv.fetchGun(-999999999);
        this.primary = this.inv.fetchGun(-999999998);
        this.secondary = this.inv.fetchGun(-999999997);
        
    }

    generateLootTable(){
        
    }


    getParams(n: number): WeaponParams{
        if(this.gunList.has(n)){
            let k = this.gunList.get(n);
            if(k != null) {
                return this.copyParam(k);
            } else {
                return this.copyParam(this.defaultParam);
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + n);
            return this.copyParam(this.defaultParam);
        }
    }

    getGun(ix: number): WeaponParams{
        return this.getParams(ix);
    }

    getGunPassives(ix: number): PassiveAbility[]{
        return this.getParams(ix).passives;
    }

    generateGun(ix: number): number{
        let r = this.getParams(ix);
        let ap = [];
        let ac = Math.random();
        if(ac < 0.75) {
            ap.push(this.getRandomAugment(r.type));
            ac = Math.random();
            if(ac < 0.5) {
                ap.push(this.getRandomAugment(r.type));
                ac = Math.random(); 
                if(ac < 0.5) {
                    ap.push(this.getRandomAugment(r.type));
                    ac = Math.random(); 
                    if(ac < 0.5){
                        ap.push(this.getRandomAugment(r.type));
                    } 
                } 
            }
        }
        return this.inv.storeNewGun(r,ap);
    }

    getRandomAugment(ix: number): Augment{
        let r = this.getParams(ix).augs;
        let list = [];
        let pool = [];

        for(let i = 0; i < r.length; i++){
            if(r[i] > 0) {
                list.push(i);
            }
        }
        list.push(0); // have a chance for blank augment
        console.log ("List of augments for selection: " + list);
        
        list.forEach((l) =>{
            if((l >= 0) && (l < this.augmentWeights.length)){
                for(let n = 0; n < this.augmentWeights[l][1]; n++){
                    pool.push(this.augmentWeights[l][0]);
                }
            }
        })

        ix = Math.trunc(Math.random()*pool.length);
        let ag = this.adjustAugmentToLevelWeight(this.copyAug(ix));
        return ag;
    }

    adjustAugmentToLevelWeight(ag: Augment): Augment{
        let n = this.getRandomLevel();
        ag.lvcap = this.maxAugLevel;
        ag.maxlv = n;
        if(ag.index == 0){
            ag.level = 0;
        } else {
            if(n > 1) {
                ag.level = (1+Math.trunc(Math.random()*n));
            } else {
                ag.level = 1;
            }
        }
        return ag;
    }


    getRandomLevel(): number{
        let r = Math.random();
        //.2 [1] .25 [3] .25 [5] .2 [8] .05 [9] .05 [10]
        if(r < 0.05) {
            return 10;
        } else if (r < 0.1) {
            return 9;
        } else if (r < 0.3) {
            return 8;
        } else if (r < 0.55) {
            return 5;
        } else if (r < 0.8) {
            return 3;
        } else {
            return 1;
        }
    }

    copyParam(w: WeaponParams): WeaponParams {
        return {
            type:w.type,name:w.name,class:w.class, dmg:w.dmg, spd:w.spd, rof:w.rof, spcd:w.spcd, shots:w.shots, pen:w.pen, pcd:w.pcd, clip:w.clip, load:w.load,
             width:w.width, rad:w.rad, acc:w.acc, arpen:w.arpen, crit:w.crit, ele:w.ele, augs:w.augs, onhit:w.onhit, weight: w.weight, rarity: w.rarity, dot: w.dot,
             customaug:w.customaug, passives: w.passives};
    }

    checkAugCompatibility(w: number, aug: number): boolean{
        if(this.gunList.has(w)){
            let kt = this.gunList.get(w);
            if(kt != null){
                if((aug >= 0) && (aug <= kt.augs.length)) {
                    if(kt.augs[aug] > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    console.log("No augment with this index exists for augment check, or the augment table for this weapon is filled incorrectly.");
                    return false;
                }
            } else {
                console.log("Null entry in weapon list for augment check.");
                return false;
            }
        } else {
            console.log("No weapon with this ID exists for augment check.");
            return false;
        }
    }

    getGunID(): number{
        this.curGunID++;
        if(this.curGunID > 999999999) {
            this.curGunID = -999999999
        }
        return this.curGunID;
    }

    equipLoadout(wl: WeaponButton[]){
        if (wl.length >= 3){
            this.side = this.inv.fetchGun(wl[0].gID);
            this.primary = this.inv.fetchGun(wl[1].gID);
            this.secondary = this.inv.fetchGun(wl[2].gID);
        } else {
            return;
        }
    }

    replaceAugs(id: number, index: number, ref: Augment[]){
        this.inv.replaceAugs(id,index,ref);
    }

    copyAug(id: number): Augment{
        if((id >= 0) && (id < this.augList.length)){
            return this.inv.copyAug(this.augList[id]);
        } else {
            console.log("No augment with the specified id exists to copy.");
            return {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""};
        }
    }

    swapLoadout(){
        
    }
}