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
    public augbtnlist: AugmentSelectButton[];
    private widgetDisp: WidgetDisplay;

    public static offX: number = 500;
    public static offY: number = -100;

    public augButtons: Phaser.GameObjects.Container;
    public ovrAugTxt: Phaser.GameObjects.Text;
    public chanceTxt: Phaser.GameObjects.Text;


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
        this.ovrAugLayer = this.scene.add.container(0,0);
        this.add(this.ovrAugLayer);
        this.ovrAugLayer.setDepth(35);

        this.tempBarLayer = this.scene.add.container(0,0);
        this.add(this.tempBarLayer);
        this.tempBarLayer.setDepth(40);

        this.widgetDisp = new WidgetDisplay(this.scene,386,412);
        this.add(this.widgetDisp);
        this.widgetDisp.setVisible(false);

        this.ovrAugTxt = this.scene.addText({
			x: AugmentUI.defX+AugmentScreen.offX-16,
			y: AugmentUI.defY+AugmentScreen.offY - 80,
			size: 30,
			color: "white",
			text: "Increase augmentation cap or add an augment slot.",
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
        this.add(this.ovrAugTxt);
        this.ovrAugTxt.setDepth(45);
        this.add(this.chanceTxt);
        this.chanceTxt.setDepth(42);
        this.ovrAugTxt.setVisible(false);
        this.chanceTxt.setVisible(false);
    }

    initiate(){

    }

    close(){
        
    }

    update(t: number, d: number){
        this.closebtn.update(t, d);
        this.upbtn.update(t, d);
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
        this.upbtn.veil();
        this.closebtn.veil();
        this.widgetDisp.setVisible(true);
        this.ovrAugTxt.setVisible(true);
        this.drawOverAugButtons();
        this.drawTempBars();
    }

    getAugChance(p: number): number{
        if(p > (this.owner.augBars.length-1)){
            return 0.15;
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
            } else if (this.owner.augBars[p].ref.maxlv <= 12) {
                return 0.05;
            } else if (this.owner.augBars[p].ref.maxlv <= 13) {
                return 0.03;
            } else {
                return 0;
            }
        }
    }

    showChance(pos: number){
        let pp = this.getAugChance(pos);
        this.chanceTxt.setText("Chance: "+ (pp*100 + "%"));
        if(pp < 0.75) {
            this.chanceTxt.setColor("yellow");
        }
        if(pp < 0.25) {
            this.chanceTxt.setColor("red");
        }
        this.chanceTxt.setY(AugmentUI.defY+AugmentScreen.offY+pos*AugmentUI.defOfs);
        this.chanceTxt.setVisible(true);
    }

    hideChance(){
        this.chanceTxt.setVisible(false);
        this.chanceTxt.setText("Chance: ");
        this.chanceTxt.setColor("white");
        this.chanceTxt.setY(AugmentUI.defY+AugmentScreen.offY);
    }

    drawOverAugButtons(){
        for(let n = 0; n < this.owner.augBars.length; n++){
            if(this.owner.augBars[n].length >= 13){
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
                let back = new OverAugButton(this.scene,AugmentUI.defX+AugmentScreen.offX, AugmentUI.defY+AugmentScreen.offY+nx*AugmentUI.defOfs,nx,10, this);
                this.overAugBtns.push(back);
                this.ovrAugLayer.add(back);

                let disp = new TempBar(this.scene,AugmentUI.defX+AugmentScreen.offX, AugmentUI.defY+AugmentScreen.offY+nx*AugmentUI.defOfs,nx);
                this.tempBars.push(disp);
                this.tempBarLayer.add(disp);
            }
        }

    }

    engageAddMode(ix: number){
        this.curMode = "add";
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
        this.owner.finalizeAugments();
        this.owner.closeAugScreen("upgrade", this.augindex);
        this.clearText();
        this.augindex = -1;
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
}