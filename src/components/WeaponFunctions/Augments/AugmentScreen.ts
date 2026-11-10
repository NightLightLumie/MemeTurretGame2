import { UpgradeScene } from "@/scenes/UpgradeScene";
import { AugmentSelector } from "./AugmentSelector";
import { AugmentUI } from "./AugmentUI";
import { AugmentControlButton } from "../../Buttons/AugmentControlButton";
import { AugmentSelectButton } from "../../Buttons/AugmentSelectButton";
import { Augment } from "../Weapon";
import { OverAugButton } from "./OverAugButton";
import { TempBar } from "./TempBar";
import { WidgetDisplay } from "./WidgetDisplay";
import { AugmentBar } from "./AugmentBar";
import { PassiveDisplay } from "./PassiveDisplay";
import { PassiveAbility } from "../Armory";
import { BasicEffect } from "@/components/Graphics/BasicEffect";
import { ExpandEffect } from "@/components/Graphics/ExpandEffect";
import { DamageText } from "@/components/Graphics/DamageText";



export class AugmentScreen extends Phaser.GameObjects.Container{
    public scene: UpgradeScene;
    public buttons: AugmentSelector[];
    private bkg: Phaser.GameObjects.Image;
    public owner: AugmentUI;
    private upbtn: AugmentControlButton;
    private closebtn: AugmentControlButton;
    public augindex: number = -1;
    public ovrAugLayer: Phaser.GameObjects.Container;
    public tempBarLayer: Phaser.GameObjects.Container;
    public tempBars: TempBar[];
    public psvBars: PassiveDisplay[];
    public augbtnlist: AugmentSelectButton[];
    private widgetDisp: WidgetDisplay;

    public static offX: number = 500;
    public static offY: number = -100;

    public augButtons: Phaser.GameObjects.Container;
    public ovrAugTxt: Phaser.GameObjects.Text;
    public chanceTxt: Phaser.GameObjects.Text;
    public ovrPassTxt: Phaser.GameObjects.Text;

    public animpause: number[];
    public waiting: boolean;

    public overAugBtns: OverAugButton[];
    public curMode: string = "upgrade";
    public wrap: number[] = [800,600];
    public augData: Phaser.GameObjects.Text;
    public title: Phaser.GameObjects.Text;
    public tl: number[] = [180,540,50,1250,200,50];
    public dt: number[] = [180,640,30,1250,310,30];


    constructor(scene: UpgradeScene, own:AugmentUI, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.owner = own;
        this.augbtnlist = [];

        this.animpause = [0,1000];
        this.waiting = false;

        this.bkg = this.scene.add.image(0, 0, "augbkg");
        this.add(this.bkg);
		this.bkg.setOrigin(0,0);
		this.bkg.setScale(1);
		this.bkg.setDepth(0);
        this.upbtn = new AugmentControlButton(this.scene,this,"upgradebtn", 370, 880, "upgrade");
        this.add(this.upbtn);
        this.upbtn.setDepth(20);
        this.closebtn = new AugmentControlButton(this.scene,this,"closeaugbtn", 1050, 880, "close");
        this.add(this.closebtn);
        this.closebtn.setDepth(20);
        this.augButtons = this.scene.add.container(0,0);
        this.add(this.augButtons);
        this.augButtons.setDepth(30);

        this.initWidgetDisplayGfx();

        this.title = this.scene.addText({
		x: this.tl[0], y: this.tl[1], size: this.tl[2], color: "#FFFFFF", text: "",
		});
        this.title.setWordWrapWidth(this.wrap[0]);
        this.add(this.title);
        this.title.setDepth(20);

        this.augData = this.scene.addText({
		x: this.dt[0], y: this.dt[1], size: this.dt[2], color: "#FFFFFF", text: "",
		});
        this.augData.setWordWrapWidth(this.wrap[0]);
        this.add(this.augData);
        this.augData.setDepth(19);
    }

    initWidgetDisplayGfx(){
        this.overAugBtns = [];
        this.tempBars = [];
        this.psvBars = [];
        this.ovrAugLayer = this.scene.add.container(0,0);
        this.add(this.ovrAugLayer);
        this.ovrAugLayer.setDepth(35);

        this.tempBarLayer = this.scene.add.container(0,0);
        this.add(this.tempBarLayer);
        this.tempBarLayer.setDepth(40);

        this.widgetDisp = new WidgetDisplay(this.scene,386,362);
        this.add(this.widgetDisp);
        this.widgetDisp.setVisible(false);

        this.ovrAugTxt = this.scene.addText({
			x: AugmentUI.defX+AugmentScreen.offX-16,
			y: AugmentUI.defY+AugmentScreen.offY - 80,
			size: 30,
			color: "white",
			text: "Increase augment cap or add an augment slot:",
		});

        this.ovrPassTxt = this.scene.addText({
			x: AugmentUI.defX+AugmentScreen.offX-32,
			y: AugmentUI.defY+AugmentScreen.offY - 600,
			size: 30,
			color: "white",
			text: "Unlock a passive ability:",
		});

        this.chanceTxt = this.scene.addText({
			x: AugmentUI.defX+AugmentScreen.offX+AugmentBar.begin-72-42,
			y: AugmentUI.defY+AugmentScreen.offY,
			size: 24,
			color: "white",
			text: "Chance: ",
		});
        this.ovrAugTxt.setOrigin(0.5,0.5);
        this.chanceTxt.setOrigin(1,0.5);
        this.ovrPassTxt.setOrigin(0.5,0.5);
        this.add(this.ovrAugTxt);
        this.ovrAugTxt.setDepth(45);
        this.add(this.chanceTxt);
        this.chanceTxt.setDepth(42);
        this.add(this.ovrPassTxt);
        this.ovrPassTxt.setDepth(45);
        this.ovrPassTxt.setVisible(false);
        this.ovrAugTxt.setVisible(false);
        this.chanceTxt.setVisible(false);
    }

    initiate(){

    }

    close(){
        
    }

    resetCloseBtnPos(){
        this.closebtn.setPosition(1050, 880);
    }

    update(t: number, d: number){
        this.closebtn.update(t, d);
        this.upbtn.update(t, d);
        if(this.animpause[0] > 0){
            this.animpause[0] -= d;
            if(this.animpause[0] <= 0){
                this.animpause[0] = 0;
                this.waiting = false;
            }
        }
        if(this.curMode == "macguffin"){
            this.overAugBtns.forEach ((ob) => ob.update(t,d));
            this.psvBars.forEach((ps) => ps.update(t,d));
        }
    }

    replaceEmptyAugment(ag: Augment){
        this.owner.tempGun.augs[this.augindex].index = ag.index;
        this.owner.tempGun.augs[this.augindex].desc = ag.desc;
        this.owner.tempGun.augs[this.augindex].level = 1;
        this.owner.tempGun.augs[this.augindex].name = ag.name;
    }

    checkAugmentCompatibility(index: number): boolean{
        for(let i = 0; i < this.owner.tempGun.augs.length; i++){
            if(this.owner.tempGun.augs[i].index == index){
                return false;
            } 
        }

        return this.scene.masterData.checkAugCompatibility(this.owner.tempGun.wID, index);
    }

    engageUpgradeMode(ix: number){
        this.curMode = "upgrade";
        this.closebtn.setMode("close");
        this.augindex = ix;
        this.closebtn.unveil();
        this.checkAugCap();
        this.title.setPosition(this.tl[0], this.tl[1]);
        this.title.setFontSize(this.tl[2]);
        this.augData.setPosition(this.dt[0], this.dt[1]);
        this.augData.setFontSize(this.dt[2]);
        this.title.setWordWrapWidth(this.wrap[0]);
        this.augData.setWordWrapWidth(this.wrap[0]);
        this.updateText();
    }

    getRefLength(p: number): number{
        if(p < this.owner.augBars.length){
            return this.owner.augBars[p].ref.maxlv;
        } else {
            return -1;
        }
    }

    engageMacguffinMode(){
        this.curMode = "macguffin";
        this.closebtn.setMode("macguffin");
        this.closebtn.setPosition(386,900);
        this.upbtn.veil();
        this.closebtn.unveil();
        this.widgetDisp.setVisible(true);
        this.widgetDisp.updateCount();
        this.ovrAugTxt.setVisible(true);
        this.ovrPassTxt.setVisible(true);
        this.drawOverAugButtons();
        this.bkg.setTexture("corebkg");
        this.drawTempBars();
        this.drawPassiveButtons();
        this.checkOverAugs();
        this.checkPassives();

    }

    checkOverAugs(){
        let maxed = true;
        let adj = false;
        if(this.owner.tempGun.augs.length < 4){
            maxed = false;
        }
        this.owner.tempGun.augs.forEach((ag) => {
            if(ag.maxlv < 13){
                maxed = false;
            }
            if(ag.maxlv > ag.lvcap){
                adj = true;
                ag.maxlv = ag.lvcap;
            }
        })
        if(adj){
            this.owner.finalizeAugments();
        }
        if(maxed || (this.scene.masterData.widgets <= 0)){
            this.ovrAugTxt.setAlpha(0.5);
            this.owner.augBars.forEach((ag) => ag.shade());
            this.tempBars.forEach((tb) => {
                tb.shade();
            })
            this.overAugBtns.forEach((oa) => {
                oa.superveil();
            })
        }
    }

    checkPassives(){
        let maxed = true;
        this.owner.tempGun.passives.forEach((ps) => {
            if(!ps.activated){
                maxed = false;
            }
        })
        if(maxed || (this.scene.masterData.widgets <= 0)){
            this.ovrPassTxt.setAlpha(0.5);
            this.psvBars.forEach((ps) => {
                ps.superveil();
            })
        }
    }

    signalRoll(c: number){
        if(c <= 5){
            this.scene.sound.play("succ_low", {volume: 0.5});
            this.scene.addEffect(new BasicEffect(this.scene,"spellhitblue",this.widgetDisp.x,this.widgetDisp.y,3,100,false,0,Math.random()*360,[3,3]));
            this.animpause = [250,250];
            this.waiting = true;
            this.scene.masterData.widgets -= 1;
            return true;
        }
        this.scene.sound.play("suck", {volume: 0.75});
        this.animpause = [1500,1500];
        this.waiting = true;
        this.scene.addEffect(new ExpandEffect(this.scene, this.widgetDisp.x, this.widgetDisp.y, "nova", 1000, Math.random()*360, 120, [2,2], [1,0], [1,0]));
    }

    executeRoll(c: number, b: boolean){
        if(c <= 5){

        }
        else if(c < 15){
            this.scene.sound.play("cmt", {volume: 0.5});
            this.scene.addEffect(new BasicEffect(this.scene,"hit_spark",this.widgetDisp.x,this.widgetDisp.y,3,50,false,0,Math.random()*360,[3,3]));
            //this.animpause = [500,500];
        } else if (c < 50) {
            this.scene.sound.play("smash", {volume: 0.5});
            this.scene.sound.play("oof", {volume: 0.5});
            let c = 1;
            if(Math.random()<0.5){
                c *= -1;
            }
            this.scene.addEffect(new BasicEffect(this.scene,"explosion_tiny",this.widgetDisp.x,this.widgetDisp.y-100,6,75,false,0,0,[c*1.25,1.25]));
            //this.animpause = [500,500];
        } else {
            this.scene.sound.play("turret_dead", {volume: 0.5});
            this.scene.sound.play("meme_explosion", {volume: 0.5});
            this.scene.addEffect(new BasicEffect(this.scene,"meme_exp",this.widgetDisp.x,this.widgetDisp.y,18,40,false,0,Math.random()*360,[6,6]));
            //this.animpause = [1000,1000];
        }
        
    }


    getPsvChance(): number{
        return 0.1;
    }

    getAugChance(p: number): number{
        if(p > (this.owner.augBars.length-1)){
            return 0.03;
        } else {
            if(this.owner.augBars[p].ref.maxlv < 5){
                return 1;
            } else if (this.owner.augBars[p].ref.maxlv < 8) {
                return 0.8;
            } else if (this.owner.augBars[p].ref.maxlv < 9) {
                return 0.5;
            } else if (this.owner.augBars[p].ref.maxlv < 10) {
                return 0.25;
            } else if (this.owner.augBars[p].ref.maxlv < 11) {
                return 0.1;
            } else if (this.owner.augBars[p].ref.maxlv < 12) {
                return 0.05;
            } else if (this.owner.augBars[p].ref.maxlv < 13) {
                return 0.03;
            } else {
                return 0;
            }
        }
    }

    drawPassiveButtons(){
        let nn = 1;
        this.owner.tempGun.passives.forEach((ps) => {
            let pb = new PassiveDisplay(this.scene,AugmentUI.defX+AugmentScreen.offX-32,(72*nn)+AugmentUI.defY+AugmentScreen.offY-600,
                this.scene.masterData.inv.copyPassive(ps),this, nn);
            this.tempBarLayer.add(pb);
            this.psvBars.push(pb);
            nn++;
        })
    }

    resetAugWidgetButtons(){
        this.psvBars.forEach((pb) => pb.destroy());
        this.psvBars = [];
        this.overAugBtns.forEach((ob) => ob.destroy());
        this.overAugBtns = [];
        this.tempBars.forEach((tb) => tb.destroy());
        this.tempBars = [];
        this.drawOverAugButtons();
        this.drawTempBars();
        this.drawPassiveButtons();
        let css = this.scene.input.hitTestPointer(this.scene.input.activePointer);
        console.log(css);
        this.overAugBtns.forEach((os) => {
            if(this.waiting){
                os.softLock();
            }
            os.hoverCheck();
        })
        this.psvBars.forEach((pb) => {
            if(this.waiting){
                pb.softLock();
            }
            pb.hoverCheck();
        })
        this.checkOverAugs();
        this.checkPassives();
    }

    drawOverAugButtons(){
        for(let n = 0; n < this.owner.augBars.length; n++){
            if(this.owner.augBars[n].ref.maxlv >= 13){
                this.owner.augBars[n].shade();
            } else {
                let bkg = new OverAugButton(this.scene,AugmentUI.defX+AugmentScreen.offX, AugmentUI.defY+AugmentScreen.offY+n*AugmentUI.defOfs,n,this.owner.augBars[n].getLength(), this);
                this.overAugBtns.push(bkg);
                this.ovrAugLayer.add(bkg);
            }
        }
    }

    drawTempBars(){
        if(this.owner.augBars.length < 4){
            for(let nx = this.owner.augBars.length; nx < 4; nx ++){
                if(nx <= this.owner.augBars.length){
                    let back = new OverAugButton(this.scene,AugmentUI.defX+AugmentScreen.offX, AugmentUI.defY+AugmentScreen.offY+nx*AugmentUI.defOfs,nx,10, this);
                    this.overAugBtns.push(back);
                    this.ovrAugLayer.add(back);
                }

                let disp = new TempBar(this.scene,AugmentUI.defX+AugmentScreen.offX, AugmentUI.defY+AugmentScreen.offY+nx*AugmentUI.defOfs,nx);
                this.tempBars.push(disp);
                this.tempBarLayer.add(disp);
                if(nx > this.owner.augBars.length){
                    disp.shade();
                }
            }
        }

    }

    engageAddMode(ix: number){
        this.curMode = "add";
        this.closebtn.setMode("add");
        this.augindex = ix;
        this.upbtn.veil();
        this.closebtn.veil();
        this.title.setPosition(this.tl[3], this.tl[4]);
        this.title.setFontSize(this.tl[5]);
        this.augData.setPosition(this.dt[3], this.dt[4]);
        this.augData.setFontSize(this.dt[5]);
        this.title.setWordWrapWidth(this.wrap[1]);
        this.augData.setWordWrapWidth(this.wrap[1]);
        this.initializeNewAugButtons();
    }

    updateText(){
        this.title.setText(this.owner.tempGun.augs[this.augindex].name);
        this.augData.setText(this.owner.tempGun.augs[this.augindex].desc);
    }

    updateAugText(ag: Augment){
        this.title.setText(ag.name);
        this.augData.setText(ag.desc);
    }

    clearText(){
        this.title.setText("");
        this.augData.setText("");
    }


    initializeNewAugButtons(){
        let xx = 200;
        let yy = 200;
        let agg: Augment;
        let bl: boolean;
        for(let i = 1; i < this.scene.masterData.augList.length; i++){
            agg = this.scene.masterData.copyAug(i);
            bl = this.checkAugmentCompatibility(i);
            if((i == 18) && (bl)){
                agg = this.scene.masterData.getCustomAugment(this.owner.tempGun.wID);
            }
            this.augbtnlist.push(new AugmentSelectButton(this.scene, this, xx, yy, agg, bl));
            this.augButtons.add(this.augbtnlist[i-1]);
            xx += 210;
            if(xx >= 1250) {
                yy += 210;
                xx = 200;
            }
        }
    }

    closeScreen(){
        switch(this.curMode){
            case "upgrade": {
                this.closeUpgradeMode();
                break;
            } case "add": {
                this.closeAddMode();
                break;
            } default: {
                break;
            }
        }
    }

    closeUpgradeMode(){
        this.closebtn.veil();
        this.upbtn.veil();
        this.resetCloseBtnPos();
        this.owner.finalizeAugments();
        this.owner.closeAugScreen("upgrade", this.augindex);
        this.clearText();
        this.augindex = -1;
    }

    closeMacguffinMode(){
        this.closebtn.veil();
        this.upbtn.veil();
        this.resetCloseBtnPos();
        this.owner.finalizeAugments();
        this.owner.finalizePassives();
        this.augindex = -1;
        this.widgetDisp.setVisible(false);
        this.ovrAugTxt.setVisible(false);
        this.ovrAugTxt.setAlpha(1);
        this.ovrPassTxt.setVisible(false);
        this.ovrPassTxt.setAlpha(1);
        this.bkg.setTexture("augbkg");
        this.tempBars.forEach((tb) => {
            tb.destroy();
        })
        this.tempBars = [];
        this.psvBars.forEach((pb) => {
            pb.destroy();
        })
        this.psvBars = [];
        this.overAugBtns.forEach((ov) => {
            ov.destroy();
        })
        this.overAugBtns = [];
        this.owner.closeAugScreen("macguffin", this.augindex);
    }

    closeAddMode(){
        this.augbtnlist.forEach((bt)=> {
            bt.destroy();
        })
        this.augbtnlist = [];
        this.owner.closeAugScreen("add", this.augindex);
        this.clearText();
        this.owner.openAugScreen("upgrade", this.augindex);
    }

    checkAugCap(){
        if((this.owner.tempGun.augs[this.augindex].level >= this.owner.tempGun.augs[this.augindex].maxlv) || 
        (this.owner.tempGun.augs[this.augindex].level >= this.owner.tempGun.augs[this.augindex].lvcap)){
            this.upbtn.rest();
        } else {
            this.upbtn.unveil();
        }
    }

    upgrade(){
        if((this.owner.tempGun.augs[this.augindex].level < this.owner.tempGun.augs[this.augindex].maxlv) && 
        (this.owner.tempGun.augs[this.augindex].level < this.owner.tempGun.augs[this.augindex].lvcap)) {
            this.owner.tempGun.augs[this.augindex].level += 1;
            this.checkAugCap();
            this.owner.relightSingleBarByAug(this.augindex);
        } else {
            console.log("Attempted to upgrade past cap.");
            this.upbtn.rest();
        }
    }


    createButtons(){
        //auglist is in globalvariables

        let t = 0;
        let iy = 0;
        for(let s = 1; s < this.scene.masterData.augList.length; s++) {
            if(t > 4) {
                t = 0;
                iy++;
            }
            this.buttons.push(new AugmentSelector(this.scene,210+(t*300),140+(iy*300),s));
            this.add(this.buttons[s-1]);
        }
    }

    addAugmentSlot(p: number){
        let tx = this.getAugChance(p);
        console.log("Adding new augment slot");
        this.owner.addNewAug(p);
        this.owner.redrawBarsWithOffset(AugmentScreen.offX, AugmentScreen.offY);
        this.resetAugWidgetButtons();
    }

    unlockPassive(ps: PassiveAbility){
        this.owner.unlockPassive(ps);
    }

    increaseAugmentCap(p: number){
        console.log("Increasing augment cap");
        this.owner.augCapPlus(p);
        this.owner.redrawBarsWithOffset(AugmentScreen.offX, AugmentScreen.offY);
        this.resetAugWidgetButtons();
    }

    subtractWidgets(n: number){
        this.scene.masterData.widgets -= n;
        this.widgetDisp.updateCount();
        this.scene.addEffect(new DamageText(this.scene,this.widgetDisp.x,this.widgetDisp.y+264,"-"+n,"widgetloss"));
    }

    failRoll(){
        this.resetAugWidgetButtons();

    }

    failPassiveRoll(){
    this.resetAugWidgetButtons();
    
    }
}