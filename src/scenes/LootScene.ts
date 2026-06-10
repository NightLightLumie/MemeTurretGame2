import { GlobalVariables } from "@/components/GlobalVariables";
import { BaseScene } from "./BaseScene";
import { Lootbox } from "@/components/WeaponFunctions/Lootbox";

export class LootScene extends BaseScene{

    
    public lootTable: number [] = [];
    public masterData: GlobalVariables;
    public curBox: Lootbox;
    public curIndex: number = 0;
    private gImage: Phaser.GameObjects.Image;
    private tOff: number = 0;
    private bkg: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "LootScene" });
	}



	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
        if(this.masterData.lootBoxes.length <= 0){
            this.progress();
            return;
        }
        this.bkg = this.add.image(0, 0, "lootbkg");
        this.bkg.setOrigin(0,0);
        this.add.existing(this.bkg);
        this.bkg.setDepth(-20);
        this.curIndex = this.masterData.lootBoxes.length-1;
        this.tOff = Math.random()*200000;
        this.curBox = new Lootbox(this,960,540,this.masterData.lootBoxes[this.curIndex],this.generateLootTable(this.masterData.lootBoxes[this.curIndex]));
        this.add.existing(this.curBox);
        this.curBox.setDepth(5);
        this.gImage = this.add.image(960,420,"blank");
        this.gImage.setScale(2,2);
        this.add.existing(this.gImage);
        this.gImage.setVisible(false);
        this.gImage.setDepth(20);
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

    reveal(){
        if(this.curBox != null){
            this.flash(250,0xFFFFFF,1);
            let r = this.masterData.generateGun(this.curBox.selectedGun);
            this.curBox.setAlpha(0.5);
            this.gImage.setTexture("gun_"+this.masterData.inv.fetchGun(r).wID);
            this.gImage.setScale(2,2);
            this.gImage.setVisible(true);
        }

    }

    nextBox(){
        this.gImage.setTexture("blank");
        this.gImage.setScale(2,2);
        this.gImage.setVisible(false);
        this.masterData.lootBoxes.splice(this.curIndex);
        this.curIndex++;
        if(this.masterData.lootBoxes.length >= 1){
            this.curBox.destroy();
            this.curBox = new Lootbox(this,960,540,this.masterData.lootBoxes[this.curIndex],this.generateLootTable(this.masterData.lootBoxes[this.curIndex]));
            this.curBox.setAlpha(1);
        } else {
            this.curBox.setVisible(false);
            this.progress();
        }
    }

    update(time: number, delta: number){
        this.tOff += delta;
        if(this.tOff > 200000) {
            this.tOff -= 200000;
        }
        this.gImage.setY(420+(40*Math.sin(this.tOff/400)));
        if(this.curBox != null){
            this.curBox.update(time,delta);
        }
    }

    progress(){
		this.addEvent(1050, () => {
			//this.musicTitle.stop();
			this.scene.start("UpgradeScene", {gameData: this.masterData});
		});
	}
}