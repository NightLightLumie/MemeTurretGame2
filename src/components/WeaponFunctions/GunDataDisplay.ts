import { BaseScene } from "@/scenes/BaseScene";
import { UpgradeScene } from "@/scenes/UpgradeScene";
import { WeaponEntry } from "./Armory";
import { WeaponParams } from "./WeaponOperator";

export class GunDataDisplay extends Phaser.GameObjects.Container{
    public scene:UpgradeScene;

    private ndisp: Phaser.GameObjects.Text;
    private dmg: Phaser.GameObjects.Text;
    private rof: Phaser.GameObjects.Text;
    private cap: Phaser.GameObjects.Text;
    private reload: Phaser.GameObjects.Text;
    private pierce: Phaser.GameObjects.Text;
    private acc: Phaser.GameObjects.Text;
    private crit: Phaser.GameObjects.Text;
    private arpen: Phaser.GameObjects.Text;

    private pstitle: Phaser.GameObjects.Text;
    private psdesc: Phaser.GameObjects.Text;

    private sp: number = 32;

    private wrap: number = 472;

    constructor(scene:UpgradeScene,x:number,y:number){
        super(scene,x,y);
        this.scene=scene;

        this.ndisp = this.scene.addText({
			x: 0, y: 0, size: 40, color: "#FFFFFF", text: "",
		});
        this.ndisp.setWordWrapWidth(this.wrap);
        this.add(this.ndisp);

        this.dmg = this.scene.addText({
			x: 0, y: 70+0*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.dmg.setWordWrapWidth(this.wrap);
        this.add(this.dmg);

        this.rof = this.scene.addText({
			x: 0, y: 70+1*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.rof.setWordWrapWidth(this.wrap);
        this.add(this.rof);

        this.cap = this.scene.addText({
			x: 0, y: 70+2*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.cap.setWordWrapWidth(this.wrap);
        this.add(this.cap);

        this.reload = this.scene.addText({
			x: 0, y: 70+3*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.reload.setWordWrapWidth(this.wrap);
        this.add(this.reload);

        this.pierce = this.scene.addText({
			x: 0, y: 70+4*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.pierce.setWordWrapWidth(this.wrap);
        this.add(this.pierce);

        this.acc = this.scene.addText({
			x: 0, y: 70+5*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.acc.setWordWrapWidth(this.wrap);
        this.add(this.acc);

        this.crit = this.scene.addText({
			x: 0, y: 70+6*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.crit.setWordWrapWidth(this.wrap);
        this.add(this.crit);

        this.arpen = this.scene.addText({
			x: 0, y: 70+7*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.arpen.setWordWrapWidth(this.wrap);
        this.add(this.arpen);


        this.pstitle = this.scene.addText({
			x: 0, y: 140+7*(this.sp), size: 28, color: "#FFFFFF", text: "",
		});
        this.pstitle.setWordWrapWidth(this.wrap);
        this.add(this.pstitle);

        this.psdesc = this.scene.addText({
			x: 0, y: 200+7*(this.sp), size: 20, color: "#FFFFFF", text: "",
		});
        this.psdesc.setWordWrapWidth(this.wrap);
        this.add(this.psdesc);
    }



    /*
        {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
        {name: "Impact", index: 1, level: 0, maxlv: 10, lvcap: 10, desc: "Increased base damage."}, //base damage, +10% each
        {name: "Barrage", index: 2, level: 0, maxlv: 10, lvcap: 10, desc: "Increased rate of fire."}, //RoF, +10% each
        {name: "Magazine", index: 3, level: 0, maxlv: 10, lvcap: 10, desc: "Additional magazine capacity."}, //Capacity, +10% each
        {name: "Swiftload", index: 4, level: 0, maxlv: 10, lvcap: 10, desc: "Reduced reload speed."}, //Reload, -5% each
        {name: "Melter", index: 5, level: 0, maxlv: 10, lvcap: 10, desc: "Additional damage over time."}, //DoT damage, +10% each
        {name: "Flaying", index: 6, level: 0, maxlv: 10, lvcap: 10, desc: "Ignores a portion of resistances."}, //Armor pen, +1/+5% each
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

    redraw(tmp: WeaponEntry): WeaponEntry{
        let e = this.scene.masterData.getParams(tmp.wID);
        let ag = this.scene.masterData.inv.augmentToArray(tmp.augs);
        this.ndisp.setText(e.name);
        if(e.shots == 1){
            this.dmg.setText("Damage: " + (e.dmg*(1+(ag[1]*0.1))).toFixed(2));
        } else {
            this.dmg.setText("Damage: " + (e.dmg*(1+(ag[1]*0.1))*e.shots).toFixed(2) + " ("+(e.dmg*(1+(ag[1]*0.1))).toFixed(2) + " x " + e.shots + ")");
        }

        this.rof.setText("Cycle Rate: " + (e.rof*(1+(ag[2]*0.1))).toFixed(2) + " per second");
        this.cap.setText("Capacity: " + Math.round(e.clip*(1+(ag[3]*0.1))));
        this.reload.setText("Reload Time: " + ((1/(1+(0.1*ag[4])))*e.load).toFixed(2) + " seconds");
        this.pierce.setText("Pierce: " + (e.pen*(1+(ag[9]*0.1))).toFixed(2));
        this.acc.setText("Accuracy Cone: " + (2*e.acc*(1/(1+(0.1*ag[10])))).toFixed(2) + " degrees");
        this.crit.setText("Crit Chance/Damage: " + ((100*e.crit[0])+(2.5*ag[11])).toFixed(2) + "% / " + (100*(e.crit[1]+(0.1*ag[12]))).toFixed(2) + "%");
        this.arpen.setText("Armor Penetration: " + (e.arpen[0]+(ag[6])) + " / " + (100*(e.arpen[1]+(ag[6]*0.05))) + "%");
        if(tmp.passives.length > 0){
            let pst = "";
            let count = 0;
            for(let px = 0; px < tmp.passives.length; px++){
                if(tmp.passives[px].activated) {
                    pst += (""+tmp.passives[px].name+": "+tmp.passives[px].desc);
                    count++;
                    switch(tmp.passives[px].name){
                        case "Romp": {
                            pst+= (""+(10*(1+(ag[18]*0.15))).toFixed(2) + "x the base damage.");
                            break;
                        } default: {
                            break;
                        }
                    }
                    pst+= (""+"\n"+"\n");
                } else if (count <= 0) {
                    pst += (""+"\n"+"\n");
                    pst += (""+"???");
                    pst+= (""+"\n"+"\n");
                } else {
                    pst += (""+"???");
                    pst+= (""+"\n"+"\n");
                }
            }
            this.psdesc.setText(pst);
            if(count > 0) {
                this.pstitle.setText("Passive Abilities: ");
            } else {
                this.pstitle.setText("Passive Abilities Not Unlocked ");
            }
        } else {
            this.pstitle.setText("");
            this.psdesc.setText("");
        }

        return tmp;
   
    }
}