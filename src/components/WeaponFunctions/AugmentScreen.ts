import { UpgradeScene } from "@/scenes/UpgradeScene";
import { AugmentSelector } from "./AugmentSelector";
import { AugmentUI } from "./AugmentUI";
import { AugmentControlButton } from "../Buttons/AugmentControlButton";

export class AugmentScreen extends Phaser.GameObjects.Container{
    public scene: UpgradeScene;
    public buttons: AugmentSelector[];
    private bkg: Phaser.GameObjects.Image;
    private owner: AugmentUI;
    private upbtn: AugmentControlButton;
    private closebtn: AugmentControlButton;
    public augindex: number = -1;
    public augButtons: Phaser.GameObjects.Container;
    public augbtnlist: AugmentControlButton[];
    public curMode: string = "upgrade";
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
        this.upbtn = new AugmentControlButton(this.scene,this,"upgradebtn", 360, 740, "upgrade");
        this.add(this.upbtn);
        this.upbtn.setDepth(20);
        this.closebtn = new AugmentControlButton(this.scene,this,"closeaugbtn", 760, 740, "close");
        this.add(this.closebtn);
        this.closebtn.setDepth(20);
        this.augButtons = this.scene.add.container(0,0);
        this.add(this.augButtons);
        this.augButtons.setDepth(30);
    }

    initiate(){

    }

    close(){
        
    }

    update(t: number, d: number){
        this.closebtn.update(t, d);
        this.upbtn.update(t, d);
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
    }

    engageAddMode(){
        this.curMode = "add";
    }

    initializeNewAugButtons(){
        for(let i = 1; i < this.scene.masterData.augList.length; i++){
            
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
        this.augindex = -1;
    }

    closeAddMode(){

    }

    checkAugCap(){
        if((this.owner.tempGun.augs[this.augindex].level >= this.owner.tempGun.augs[this.augindex].maxlv) || 
        (this.owner.tempGun.augs[this.augindex].level >= this.owner.tempGun.augs[this.augindex].lvcap)){
            this.upbtn.rest();
        } else {
            this.upbtn.unveil();
        }
    }

    buttonAction(cmd: string){
        switch(cmd) {
            case "close": {
                this.upgrade();
                break;
            } case "upgrade": {
                break;
            } default: {
                break;
            }
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