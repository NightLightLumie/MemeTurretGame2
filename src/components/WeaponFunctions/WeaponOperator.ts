import { Player } from "../Player"
import { Target } from "../Target";
import { PassiveAbility } from "./Armory";
import { Bullet } from "./Bullet";
import { Augment, Weapon } from "./Weapon";

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
    type: number; name: string; class: string; dmg: number; spd:number; rof: number; spcd: number; shots: number; pen: number, pcd: number; clip: number; load: number; width: number; rad: number;
    acc: number; arpen: number[]; crit: number[]; ele: number; onhit: number; weight: number; rarity: number; dot: DotParams[]; augs: number[]; customaug: Augment; passives: PassiveAbility[];
}

export class WeaponOperator{
    public p: Player;
//stats: per-pellet damage, DoT damage, magazine capacity, movement penalty, pierce, splash, custom, fire rate, reload speed, accuracy cone, critical strike chance
//status damage, armor penetration, direct shot chance, ???recoil, onhit damage,

    public defaultParam: WeaponParams = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
     arpen: [0,0], crit: [0,1], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: []};
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
        return {
            type:w.type,name:w.name,class:w.class, dmg:w.dmg, spd:w.spd, rof:w.rof, spcd:w.spcd, shots:w.shots, pen:w.pen, pcd:w.pcd, clip:w.clip, load:w.load,
             width:w.width, rad:w.rad, acc:w.acc, arpen:w.arpen, crit:w.crit, ele:w.ele, onhit:w.onhit, weight: w.weight, rarity: w.rarity, dot: w.dot, augs:w.augs, customaug:w.customaug, passives: w.passives};
    }



    shoot(a:number, w: Weapon, recur: boolean = false, unsafe: boolean = false){
        if(!unsafe){
            if(!w.canShoot()){
                return;
            }
        }

        
        if((!recur) && (w.curAmmo >= 2)){ //take care of overflow shots, if the firing interval is lower than the tick rate of the computer
            if((w.stored > 0) && (w.curAmmo >= 2)) {
                let rr = w.stored;
                console.log("STORED SHOTS: " + w.stored);
                for(let n = 0; n < rr; n++) {
                    this.shoot(a,w,true,false);
                }
            }
            w.updateCooldown(); //DO NOT MOVE ME - here so it skips cooldown update for extra shots to not make them fail
        } else {
            w.stored -= 1;
        }
        
        w.updateAmmo(1);
        switch(w.type){
             case 0: { //lutra
                let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
				this.p.scene.sound.play("gun_0",{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
                break;
            } case 1: { //windmill
            } case 3: { //broadhead
            } case 8: { //NTR-141
            } case 4: { //bjuron
                let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
				this.p.scene.sound.play(("gun_"+w.type),{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
                break;
            } case 7: { //ottertail
                let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
				this.p.scene.sound.play(("gun_"+w.type),{volume: 0.7});
				this.p.scene.addBullet(new Bullet(this.p.scene,this.p.x+(w.fRad*Math.cos(a)), this.p.y+(w.fRad*Math.sin(a)), w.wp.type, w.wp.spd,a+ofs,w.damage,w.pierce, w));
                break; 
            } case 2: { //ANTEK
                let ofs = Phaser.Math.DegToRad(-1*w.acc+(Math.random()*2*w.acc));
				this.p.scene.sound.play("machinegun",{volume: 0.7});
                for(let r = 0; r < w.wp.shots; r++) {
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
            }
            default: {
                break;
            }
        }

    }

    processSpecial(t: Target, wp: number, w: Weapon, dt: number){
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
                    t.addStack(wp, {type: wp, damage: (wr.dmg*10)*(1+(0.15*w.specialStat)), curhits: w.pvalue[0], maxhits: 7, image: this.p.scene.add.image(0,0,"stackcircle"),drawsize: 0.8+(0.15*(w.pvalue[0]-1)), bop: true,
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