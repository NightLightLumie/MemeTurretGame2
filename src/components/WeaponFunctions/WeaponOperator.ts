import { Player } from "../Player"
import { Target } from "../Target";
import { PassiveAbility } from "./Armory";
import { Bullet } from "./Bullet";
import { Rocket } from "./Rocket";
import { Augment, BurstTracker, Weapon } from "./Weapon";

export interface HitInfo{
    tg: Target;
    vt: Phaser.Math.Vector2;
}

export interface HitLog{
    cooldown: number;
    weaponID: number;
}

export interface DmgStack{
    type: number;
    damage: number;
    curhits: number;
    maxhits: number;
    image: Phaser.GameObjects.Image;
    drawsize: number;
    bop: boolean;
    alpha: number;
    sound: string;
    explode: string;
}

export interface DotParams{

}

//element: 0 = phys, 1 = fire, 2 = thunder, 3 = poison/acid, 4 = ice, 5 = plasma
export interface WeaponParams{
    type: number; name: string; class: string; dmg: number; spd:number; rof: number; spcd: number[]; shots: number; pen: number, pcd: number; clip: number; load: number; width: number; rad: number;
    acc: number; arpen: number[]; crit: number[]; ele: number; onhit: number; weight: number; rarity: number; burst: number[]; dot: DotParams[]; 
    augs: number[]; customaug: Augment; passives: PassiveAbility[];
}

export interface BurstParam{
    amount: number;
    rof: number;
}

export class WeaponOperator{
    public p: Player;
//stats: per-pellet damage, DoT damage, magazine capacity, movement penalty, pierce, splash, custom, fire rate, reload speed, accuracy cone, critical strike chance
//status damage, armor penetration, direct shot chance, ???recoil, onhit damage,

    public defaultParam: WeaponParams = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: [-1, 1000, 10], shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
     arpen: [0,0], crit: [0,1], ele: 1, onhit: 0, weight: 0, rarity: 1, burst:[1,1], dot: [], augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: []};
    //public database: Map<number,WeaponParams> = new Map;


    constructor(owner:Player){
        this.p=owner;
        //this.database = this.p.scene.masterData.gunList;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    }

    getParams(n: number): WeaponParams{
        return this.p.scene.masterData.getParams(n);
        /*

        if(this.database.has(n)){
            let k = this.database.get(n);
            if(k != null) {
                return this.copyParam(k);
            } else {
                return this.copyParam(this.defaultParam);
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + n);
            return this.copyParam(this.defaultParam);
        }
        */
    }

    copyParam(w: WeaponParams): WeaponParams {
        return structuredClone(w);
    }





    /*
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
    */

    fire(a:number, w: Weapon){
        if(w.burstData[0] > 1){
            this.shootBurst(a,w);
        } else {
            this.shoot(a,w,false,false,false);
        }

    }

    fireSpecial(a: number, w: Weapon){
        if(!w.canShootSpecial()){
            return;
        }
        w.updateSpCooldown();
        w.updateSpEnergy();
        this.fireSpecialShot(a,w,true,true);
    }

    checkBursts(t: number, d: number, a: number, w: Weapon){
        if(w.bursts.length <= 0){
            return;
        }

        for(let bb = (w.bursts.length-1); bb >= 0; bb--){
            if(w.bursts[bb].curCD > 0) {
                w.bursts[bb].curCD -= d;
                if(w.bursts[bb].curCD <= 0){
                    w.bursts[bb].overflow += Math.abs(w.bursts[bb].curCD);

                    //manage overflow
                    if(w.bursts[bb].overflow < w.bursts[bb].maxCD){
                        w.bursts[bb].curCD = (w.bursts[bb].maxCD - w.bursts[bb].overflow);
                    } else {
                        let cn = Math.trunc(w.bursts[bb].overflow/w.bursts[bb].maxCD);
                        w.bursts[bb].stored += cn;
                        w.bursts[bb].overflow -= (cn * w.bursts[bb].maxCD);
                        w.bursts[bb].curCD = w.bursts[bb].maxCD-w.bursts[bb].overflow;
                        if(w.bursts[bb].curCD <= 0){
                            w.bursts[bb].curCD = 1;
                        }
                    }
                    w.bursts[bb].overflow = 0;
                    this.burstFire(a,w,w.bursts[bb],false,false,w.bursts[bb].special);
                }
                //FIXME no safe check for if this actually fired a bullet
            }
            if(w.bursts[bb].amt <= 0){
                w.bursts.splice(bb,1);
            }
		}

    }

    recalculateBurst(){

    }

    burstFire(a: number, w: Weapon, b: BurstTracker, recur: boolean = false, unsafe: boolean = false, special: boolean = false){
        if(!b.ignoreAmmo){
            if(!unsafe){
                if(w.curAmmo < 1){
                    console.log("Attempted to effect burst with no ammo, this should not happen")
                    return;
                }
            }
            if((!recur)){ //take care of overflow shots, if the firing interval is lower than the tick rate of the computer
                if((w.curAmmo >= 2) && (b.amt >= 2) && (b.stored > 0)) {
                    let rr = b.stored;
                    for(let n = 0; n < rr; n++) {
                        if((w.curAmmo >= 2) && (b.amt >= 2)){
                            this.burstFire(a,w,b,true,true,special);
                        }
                    }
                }
                this.p.trackShots++; //Don't track overflow shots, avoid weirdness
            } else {
                b.stored -= 1;
            }
        } else {
            if((!recur)){ //take care of overflow shots, if the firing interval is lower than the tick rate of the computer
                if((b.amt >= 2) && (b.stored > 0)) {
                    let rr = b.stored;
                    for(let n = 0; n < rr; n++) {
                        if((b.amt >= 2)){
                            this.burstFire(a,w,b,true,true,special);
                        }
                    }
                }
                this.p.trackShots++; //Don't track overflow shots, avoid weirdness
            } else {
                b.stored -= 1;
            }
        }
        b.amt -= 1;
        this.fireBullet(a,w,special,b.ignoreAmmo);
    }

    shootBurst(a: number, w: Weapon, recur: boolean =  false, unsafe: boolean = false, special: boolean = false){
        if(!unsafe){
            if(!w.canShootBurst()){
                return;
            }
        }

        if(!recur){ //take care of overflow shots, if the firing interval is lower than the tick rate of the computer
            if((w.getUnallocatedAmmo() >= (2*w.burstData[0])) && (w.stored > 0)) {
                let rr = w.stored;
                for(let n = 0; n < rr; n++) {
                    if((w.getUnallocatedAmmo() >= 2*w.burstData[0])){
                        this.shootBurst(a,w,true,true,special);
                    }
                }
            }
            w.updateCooldown(); //DO NOT MOVE ME - here so it skips cooldown update for extra shots to not make them fail
        } else {
            w.stored -= 1;
        }
        let cb = w.createBurst(special);
        let ammo = w.getUnallocatedAmmo();
        if(ammo < w.burstData[0]){
            if(ammo > 0){
                cb.amt = ammo;
            } else {
                console.log("tried to fire zero length burst");
                return;
            }
        }
        cb.curCD = cb.maxCD;
        cb.amt -= 1;
        this.fireBullet(a,w,special);
        if(cb.amt > 0){
            w.addBurst(cb);
        }
    }

    shoot(a:number, w: Weapon, recur: boolean = false, unsafe: boolean = false, special: boolean = false){
        if(!unsafe){
            if(!w.canShoot()){
                return;
            }
        }
        if((!recur)){ //take care of overflow shots, if the firing interval is lower than the tick rate of the computer
            if((w.curAmmo >= 2) && (w.stored > 0)){
                let rr = w.stored;
                for(let n = 0; n < rr; n++) {
                    if((w.curAmmo >= 2)){
                        this.shoot(a,w,true,true,special);
                    }
                }
            }
            w.updateCooldown(); //DO NOT MOVE ME - here so it skips cooldown update for extra shots to not make them fail
            this.p.trackShots++; //Don't track overflow shots, avoid weirdness
        } else {
            w.stored -= 1;
        }
        this.fireBullet(a,w,special);
    }

    fireSpecialShot(a: number, w: Weapon, special: boolean, ignoreAmmo: boolean = false){
        switch(w.type){
            case 0: { //lutra
           } case 1: { //windmill
           } case 3: { //broadhead
           } case 8: { //NTR-141
           } case 5: { //windmill
           } case 2: { //ANTEK
           } case 9: { //Two-fanged wolf
           } case 6: { //LOSSNEN
           } case 10: { //WS-Crossfade SE
           } case 4: { //bjuron
            console.log("Error firing special on gun with no special shot");
            break;
           } case 7: { //ottertail
                let cb: BurstTracker;
                cb = {
                    amt: 7,
                    curCD: 0,
                    maxCD: 50,
                    special: true,
                    ignoreAmmo: true,
                    overflow: 0,
                    stored: 0,
                }
                cb.curCD = cb.maxCD;
                cb.amt -= 1;
                this.fireBullet(a,w,special,true);
                w.addBurst(cb);
               break; 
           } default: {
               break;
           }
       }
    }

    fireBullet(a: number, w: Weapon, special: boolean, ignoreAmmo: boolean = false){
        if(!ignoreAmmo){
            w.updateAmmo(1);
        }
        switch(w.type){
            case 0: { //lutra
               let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
               this.p.scene.sound.play("gun_0",{volume: 0.7});
               this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
               break;
           } case 1: { //windmill
           } case 3: { //broadhead
           } case 8: { //NTR-141
           } case 5: { //windmill
           } case 4: { //bjuron
               let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
               this.p.scene.sound.play(("gun_"+w.type),{volume: 0.7});
               this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
               break;
           } case 7: { //ottertail
               let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));

               let mult = 1;
               if(special){
                    mult = w.spDmg;
                    ofs *= 0.25;
                    this.p.scene.sound.play(("gun_"+w.type+"_low"),{volume: 0.9});
               } else {
                    this.p.scene.sound.play(("gun_"+w.type),{volume: 0.7});
               }
               this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage*mult,w.pierce, w));
               break; 
           } case 2: { //ANTEK
               let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
               this.p.scene.sound.play("machinegun",{volume: 0.7});
               for(let r = 0; r < w.shots; r++) {
                   ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
                   this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
               }
               break; 
           } case 9: { 
               //2-fanged wolf
               let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
               this.p.scene.sound.play(("gun_1"),{volume: 0.7});
               let bx = this.p.x+(w.fRad*Math.cos(a));
               let by = this.p.y+(w.fRad*Math.sin(a));

               let aa = new Bullet(this.p.scene,bx+(10*Math.cos(a+(Math.PI/2))), by+(15*Math.sin(a+(Math.PI/2))), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w, [{cmd: "holdcrit", amt: 1}]);
               let bb = new Bullet(this.p.scene,bx-(10*Math.cos(a+(Math.PI/2))), by-(15*Math.sin(a+(Math.PI/2))), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w, [{cmd: "holdcrit", amt: 1}]);
               aa.addLinkedBullets(bb);
               bb.addLinkedBullets(aa);
               this.p.scene.addBullet(aa);
               this.p.scene.addBullet(bb);
               if(Math.random() < w.pvalue[0]){
                   ofs = Phaser.Math.DegToRad(-2*w.acc+(Math.random()*4*w.acc));
                   let cc = new Bullet(this.p.scene,bx, by, w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w, [{cmd: "holdcrit", amt: 1},{cmd: "bonuscrit", amt: w.pvalue[1]}]);
                   aa.addLinkedBullets(cc);
                   bb.addLinkedBullets(cc);
                   cc.addLinkedBullets(aa);
                   cc.addLinkedBullets(bb);
                   this.p.scene.addBullet(cc);
                   cc.recalculateCrit();
               }
               aa.recalculateCrit();
               bb.recalculateCrit();
               break;
           } case 6: {//LOSSNEN
               let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
               this.p.scene.sound.play("rocket",{volume: 0.7});
               this.p.scene.addPlayerProjectile(new Rocket(this.p.scene,this.p.x+(w.fRad*Math.cos(a)),this.p.y+(w.fRad*Math.sin(a)),"missile",a+ofs,w));
               //Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
               break; 
           } case 10: {// crossfade SE
               let ofsn = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
               let rlt = [1,2,3];
               if(w.pvalue[0] >= 1){
                   rlt.push(4);
               }
               let st = Math.trunc(Math.random()*rlt.length);
               let ofs = Phaser.Math.DegToRad(-1*(w.acc/4)+(Math.random()*2*(w.acc/4)));
               for(let r = 0; r < rlt[st]; r++) {
                   ofs = ofsn+Phaser.Math.DegToRad(-1*(w.acc/4)+(Math.random()*2*(w.acc/4)));
                   this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce+(0.2*w.specialStat), w));
               }
               this.p.scene.sound.play("gun_10",{volume: 0.7});
               break;
           } default: {
               break;
           }
       }
    }

    processSpecial(t: Target, wp: number, w: Weapon, dmg: number){
        if(t.deleteFlag == true){
            return;
        }
        let wr = this.getParams(wp);
        switch(wp){
            case 7: {
                if(t.hasStack(wp)) {
                    let mm = t.stackLog.get(wp);
                    if(mm != null){
                        mm.curhits += w.pvalue[0];
                        mm.bop = true;
                        mm.drawsize+=0.15*w.pvalue[0];
                    }
                } else {
                    t.addStack(wp, {type: wp, damage: (wr.dmg*10)*(1+(0.2*w.specialStat)), curhits: w.pvalue[0], maxhits: 7, image: this.p.scene.add.image(0,0,"stackcircle"),drawsize: 0.8+(0.15*(w.pvalue[0]-1)), bop: true,
                    alpha: 1, sound: "stackexplode", explode:"hit_spark"});
                    //console.log("ADD STACK: ");
                    //console.log(t.stackLog);
                }
                break;
            } default: {
                break;
            }
        }

    }
}