import { UpgradeScene } from "@/scenes/UpgradeScene";
import { AugmentSelector } from "./AugmentSelector";
import { AugmentUI } from "./AugmentUI";
import { AugmentControlButton } from "../Buttons/AugmentControlButton";
import { AugmentSelectButton } from "../Buttons/AugmentSelectButton";
import { Augment } from "./Weapon";

export class AugmentScreen extends Phaser.GameObjects.Container{
    public scene: UpgradeScene;
    public buttons: AugmentSelector[];
    private bkg: Phaser.GameObjects.Image;
    private owner: AugmentUI;
    private upbtn: AugmentControlButton;
    private closebtn: AugmentControlButton;
    public augindex: number = -1;
    public augButtons: Phaser.GameObjects.Container;
    public augbtnlist: AugmentSelectButton[];
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

    engageMacguffinMode(){
        this.curMode = "macguffin";
        this.closebtn.unveil();
        this.printOverAugButtons();
    }

    printOverAugButtons(){

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