import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../Button";
import { AugmentBar } from "./AugmentBar";
import { AugmentScreen } from "./AugmentScreen";
import { PassiveAbility } from "../Armory";

export class PassiveDisplay extends Button{
    public scene: UpgradeScene;
    public sp: Phaser.GameObjects.Sprite;
    public myTxt: Phaser.GameObjects.Text
    public pdata: PassiveAbility;
    private lockout: boolean;
    private softlock: boolean;
    public ref: AugmentScreen;
    public stopped: boolean;
    public dpos: number;
    private primed: boolean;
    private storedamt: number;
    private success: boolean;
    constructor(scene: UpgradeScene, x: number, y: number, ps: PassiveAbility, myref: AugmentScreen, dpos: number = 0){
        super(scene, x, y);
        this.scene = scene;
        this.ref = myref;
        this.pdata = ps;
        this.dpos = dpos;
        this.sp = this.scene.add.sprite(0,0,"passiveback");
        this.add(this.sp);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.bindInteractive(this.sp)
        this.sp.setInteractive();
        this.sp.alpha = 0.35;
        this.stopped = false;
        this.myTxt = this.scene.addText({
			x: 0,
			y: 0,
			size: 28,
			color: "white",
			text: "-" + this.pdata.name + "-",
		});
        this.add(this.myTxt);
        this.myTxt.setOrigin(0.5,0.5);

        this.primed = false;
        this.storedamt = 0;
        this.lockout = false;
        this.softlock = false;
        this.adjustBack();

        if(this.pdata.activated){
            this.stopped = true;
            this.veil();
        } else {
            this.myTxt.setText("??????");
            this.adjustBack();
        }
    }

    adjustBack(){
        this.sp.setScale((24+this.myTxt.width)/256,2);
    }

    process(){
        this.pdata.activated = true;
        this.ref.unlockPassive(this.pdata);
        this.myTxt.setText("-" + this.pdata.name + "-");
        this.sp.setAlpha(0.35);
        this.adjustBack();
        this.sp.clearTint();
        this.veil();
        this.stopped = true;
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout || this.stopped || this.softlock){
            return;
        } else {
            this.lock();
            this.primed = true;
            let px = this.ref.owner.roll(this.scene.masterData.widgets,this.ref.getPsvChance());
            this.storedamt = px[0];
            this.success = px[1];
            this.sp.setTint(0xFF57CD);
            //console.log("Amount consumed: " + this.storedamt);
            this.ref.signalRoll(this.storedamt);
        }
    }

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        if(!this.stopped){
            this.ref.showPsvChance(this);
            this.sp.setAlpha(0.8);
        }
    }

    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        if(!this.stopped){
            this.ref.hideChance();
            this.sp.setAlpha(0.35);
        }
    }

    veil(){
        this.setVisible(true);
        this.setAlpha(0.5);
        this.sp.removeInteractive();
        this.disableInteractive();
        this.lockout = true;
    }

    superveil(){
        this.setVisible(true);
        this.setAlpha(0.5);
        this.sp.setAlpha(0.35);
        this.sp.removeInteractive();
        this.disableInteractive();
        this.lockout = true;
    }

    unveil(){
        this.setVisible(true);
        this.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
        this.lockout = false;
    }

    hide(){
        this.sp.setVisible(false);
        this.sp.removeInteractive();
        this.disableInteractive();
        this.lockout = true;
    }

    unhide(){
        this.sp.setVisible(true);
        this.sp.setInteractive();
        this.setInteractive();
        this.lockout = false;
    }

    lock(){
        this.lockout = true;
    }

    unlock(){
        this.lockout = false;
    }

    update(t: number, d: number){
        if(this.primed){
            if(this.ref.waiting != true){

            }
        }
    }

    softLock(){
        this.softlock = true;
    }

    unsoftLock(){
        this.softlock = false;
    }

}