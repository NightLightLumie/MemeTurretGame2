import { GlobalVariables } from "@/components/GlobalVariables";
import { BaseScene } from "./BaseScene";
import { Lootbox } from "@/components/WeaponFunctions/Lootbox";
import { AugmentDisplayBar } from "@/components/WeaponFunctions/AugmentDisplayBar";
import { WeaponEntry } from "@/components/WeaponFunctions/Armory";

export class LootScene extends BaseScene{

    
    public lootTable: number [] = [];
    public masterData: GlobalVariables;
    public curBox: Lootbox;
    public curIndex: number = 0;
    private gImage: Phaser.GameObjects.Image;
    private tOff: number = 0;
    private bkg: Phaser.GameObjects.Image;
    private state: string = "waiting";
    private waitTime: number[] = [1000,1000];
    private displayBars: AugmentDisplayBar[];
    private xps: number = 960;
    private yps: number = 840;
    private spacer: number = 68;
    private skip: boolean = false;

	constructor() {
		super({ key: "LootScene" });
	}

    resetVariables(){
        this.lootTable = [];
        this.displayBars = []
        this.waitTime = [1000,1000];
        this.state = "waiting";
        this.xps = 960;
        this.yps = 810;
        this.spacer = 68;
        this.skip = false;
    }

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
	}

    create(): void {
        this.resetVariables();
        console.log("Amount of boxes: " + this.masterData.lootBoxes.length);
        if(this.masterData.lootBoxes.length <= 0){
            this.skip = true;
            this.progress();
            return;
        } else {
            this.bkg = this.add.image(0, 0, "lootbkg");
            this.bkg.setOrigin(0,0);
            this.add.existing(this.bkg);
            this.bkg.setDepth(-20);
            this.curIndex = this.masterData.lootBoxes.length-1;
            this.tOff = Math.random()*200000;
            console.log("Generating Box");
            this.curBox = new Lootbox(this,960,540,this.masterData.lootBoxes[this.curIndex],this.generateLootTable(this.masterData.lootBoxes[this.curIndex]));
            this.add.existing(this.curBox);
            this.curBox.setDepth(5);
            this.curBox.lock();
            this.gImage = this.add.image(960,420,"blank");
            this.gImage.setScale(2,2);
            this.add.existing(this.gImage);
            this.gImage.setVisible(false);
            this.gImage.setDepth(20);
            this.initTouchControls();
            this.fade(false, 200, 0x000000);
        }
    }

    generateLootTable(q: number): number[]{
        this.lootTable = [];
        let pr = 0;
        let ir = 4;
        let wp = this.masterData.getGun(0);
        for(let i = 0; i < this.masterData.gunList.size; i++){
            wp = this.masterData.getGun(i);
            pr = wp.rarity-q;
            if(pr < 3){
                pr = Math.abs(pr);
                ir -= pr;
                if(ir <= 0){
                    ir = 1;
                }
                for(let n = 0; n < ir; n++){
                    this.lootTable.push(wp.type);
                }
            }
            ir = 4;
            pr = 0;
        }
        return this.lootTable;
    }

    initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			if(this.state == "finished"){
				this.nextBox();
			}

		});

	}


    reveal(){
        if(this.curBox != null){
            this.flash(250,0xFFFFFF,1);
            this.state = "transition";
            this.waitTime[0] = 500;
            let r = this.masterData.generateGun(this.curBox.selectedGun);
            let w = this.masterData.inv.fetchGun(r);
            this.curBox.setAlpha(0.5);
            this.gImage.setTexture("gun_"+w.wID);
            this.gImage.setScale(2,2);
            this.gImage.setVisible(true);
            this.drawBars(w);
        }
    }

    drawBars(w: WeaponEntry){
        let ag = w.augs;
        if(ag.length <= 0) {
            return;
        }
        for(let n = 0; n < ag.length; n++){
            this.displayBars.push(new AugmentDisplayBar(this,this.xps,this.yps+(n*this.spacer),ag[n]));
        }
    }

    destroyBars(){
        this.displayBars.forEach((d)=>{
            d.destroy();
        });
        this.displayBars = [];
    }

    nextBox(){
        this.state = "waiting";
        this.waitTime[0] = 500;
        this.flash(250,0xFFFFFF,1);
        this.gImage.setTexture("blank");
        this.gImage.setScale(2,2);
        this.gImage.setVisible(false);
        this.masterData.lootBoxes.splice(this.curIndex);
        this.destroyBars();
        this.curIndex--;
        if(this.masterData.lootBoxes.length >= 1){
            this.curBox.destroy();
            this.curBox = new Lootbox(this,960,540,this.masterData.lootBoxes[this.curIndex],this.generateLootTable(this.masterData.lootBoxes[this.curIndex]));
            this.curBox.setAlpha(1);
            this.curBox.lock();
        } else {
            this.curBox.setVisible(false);
            this.progress();
        }
    }

    update(time: number, delta: number){
        if(this.skip){
            return;
        }
        this.tOff += delta;
        if(this.tOff > 200000) {
            this.tOff -= 200000;
        }
        this.gImage.setY(420+(40*Math.sin(this.tOff/400)));
        if(this.curBox != null){
            this.curBox.update(time,delta);
        }
        this.updateState(time,delta);
    }

    updateState(t: number, d: number){
        switch(this.state){
            case "waiting": {
                if(this.waitTime[0] > 0) {
                    this.waitTime[0] -= d;
                    if(this.waitTime[0] <= 0){
                        this.waitTime[0] = 0;
                        if(this.curBox != null){
                            this.curBox.unlock();
                        }
                        console.log("finished wait time")
                        this.state = "active";
                    }
                }
                break;
            } case "active": {
                break;
            } case "transition": {
                if(this.waitTime[0] > 0) {
                    this.waitTime[0] -= d;
                    if(this.waitTime[0] <= 0){
                        this.waitTime[0] = 0;
                        this.state = "finished";
                    }
                }
                break;
            } case "finished": {
                break;
            }
        }
    }

    progress(){
		this.addEvent(0, () => {
			//this.musicTitle.stop();
			this.scene.start("UpgradeScene", {gameData: this.masterData});
		});
	}
}