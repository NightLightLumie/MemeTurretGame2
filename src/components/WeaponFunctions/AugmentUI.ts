import { BaseScene } from "@/scenes/BaseScene";
import { UpgradeScene } from "@/scenes/UpgradeScene";
import { AugmentBar } from "./AugmentBar";
import { WeaponEntry } from "./Armory";
import { GunDataDisplay } from "./GunDataDisplay";
import { AugmentScreen } from "./AugmentScreen";

export class AugmentUI extends Phaser.GameObjects.Container{

    private overlay: Phaser.GameObjects.Container;
    private dispBars: Phaser.GameObjects.Container;
    private g1: Phaser.GameObjects.Graphics;
    private g2: Phaser.GameObjects.Graphics;
    private fill: Phaser.GameObjects.Container;
    public scene:UpgradeScene;

    private augBars: AugmentBar[];

    private curGun: number;
    public tempGun: WeaponEntry;
    private gunJargon: GunDataDisplay;

    private augscreen: AugmentScreen;

    private test: Phaser.GameObjects.Text;

    private static WRAP: number = 472;
    public index: number; //which weapon is selected
    constructor(scene:UpgradeScene,x:number,y:number,gun:number){
        super(scene,x,y);
        this.scene = scene;

        this.augscreen = new AugmentScreen(this.scene,this,0,0);
        this.add(this.augscreen);
        this.augscreen.setVisible(false);
        this.augscreen.setDepth(30);

        this.overlay = new Phaser.GameObjects.Container(this.scene,0,0);
        this.g1 = this.scene.add.graphics();
        this.overlay.add(this.g1);
        this.add(this.overlay);
        this.overlay.setDepth(1);

        this.fill = new Phaser.GameObjects.Container(this.scene,0,0);
        this.g2 = this.scene.add.graphics();
        this.fill.add(this.g2);
        this.add(this.fill);
        this.overlay.setDepth(10);
        this.fill.setDepth(5);

        this.dispBars = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.dispBars);
        this.dispBars.setDepth(15);

        /*
        this.test = this.scene.addText({
			x: 0, y: 0, size: 120, color: "#FFFFFF", text: "TESTING",
		});

        this.add(this.test);*/

        this.curGun = gun;

        this.augBars = [];

        this.loadGun();
        this.gunJargon = new GunDataDisplay(this.scene,1428,307);
        this.gunJargon.redraw(this.tempGun.wID); 
        this.add(this.gunJargon);
        this.gunJargon.setDepth(25);
        this.scene.add.existing(this);
        this.initBars();

    }

    clear(){
        this.augBars = [];
        this.dispBars.destroy();
        this.dispBars = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.dispBars);
    }


    initBars(){
        console.log("CUR GUN: " + this.tempGun.augs);
        for(let n = 0; n < this.tempGun.augs.length; n++){
            this.augBars.push(new AugmentBar(this.scene,this,960,840+(n*68),this.tempGun.augs[n],n));
            this.dispBars.add(this.augBars[n]);
            console.log("Adding bar for: " + this.tempGun.augs[n]);
        }
    }

    loadGun(){
        this.tempGun = this.scene.fetchGun(this.curGun);
		//the ONLY thing that should change dynamically about the gun in the upgrade scene should be the augments
		//therefore after each augment we just update bars -> recalc
	}

    upgrade(ix: number){
        if((ix < this.tempGun.augs.length) && (ix >= 0)){
            if(this.tempGun.augs[ix].level < this.tempGun.augs[ix].maxlv){
                this.tempGun.augs[ix].level++;
            } else {
                console.log("Attempted to upgrade maximally leveled augment.")
            }
        } else {
            console.log("Index out of range for gun augments.")
        }
    }



    swapGun(id: number){
        this.curGun = id;
        this.tempGun = this.scene.fetchGun(this.curGun);
        this.gunJargon.redraw(this.tempGun.wID);
        this.clear();
        this.initBars();
    }

    openAugScreen(mode: string, index: number){
        switch (mode){
            case "upgrade": {
                this.scene.lockButtons();
                this.swapScreen(index);
                this.hideOtherBars(index);
                break;
            } case "add": {
                break;
            } default: {
                break;
            }
        }
    }

    closeAugScreen(mode: string, index: number){
        switch (mode){
            case "upgrade": {
                this.hideAugScreen();
                this.dispBars.setDepth(15);
                this.refreshBars();
                this.scene.unlockButtons();
                break;
            } case "add": {
                break;
            } default: {
                break;
            }
        }
    }

    hideAugScreen(){
        this.augscreen.setVisible(false);
        this.augscreen.setDepth(30);
    }

    swapScreen(ix: number){
        this.augscreen.engageUpgradeMode(ix);
        this.augscreen.setVisible(true);
        this.augscreen.setDepth(40);
        this.dispBars.setDepth(35);
    }

    hideOtherBars(ix: number){
        if((ix < this.augBars.length) && (ix >= 0)){
            for(let ii = 0; ii < this.augBars.length; ii++){
                this.augBars[ii].passivate();
                if(ii == ix){
                    this.augBars[ii].setScale(2);
                    this.augBars[ii].setPosition(920,360);
                } else {
                    this.augBars[ii].setVisible(false);
                }
            }
        } else {
            console.log("No augment with this index exists for opening augment screen.");
        }
    }

    finalizeAugments(){
        this.scene.masterData.replaceAugs(this.tempGun.gID, this.augscreen.augindex, this.tempGun.augs);
    }

    refreshBars(){
        this.clear();
        this.initBars();
    }

    redrawSingleBarByAug(ix: number){
        if((ix < this.tempGun.augs.length) && (ix >= 0)){
            if((ix < this.augBars.length) && (ix >= 0)){
                this.augBars[ix].set(this.tempGun.augs[ix]);
            }
        }
    }

    relightSingleBarByAug(ix: number){
        if((ix < this.tempGun.augs.length) && (ix >= 0)){
            if((ix < this.augBars.length) && (ix >= 0)){
                this.augBars[ix].relightBars();
            }
        }
    }

    update(t: number, d: number){
        this.augscreen.update(t, d);
    }

    unhideOtherBars(){

    }

    loadInfo(){

    }

    loadAugBars(){

    }

    redraw(){

    }
}