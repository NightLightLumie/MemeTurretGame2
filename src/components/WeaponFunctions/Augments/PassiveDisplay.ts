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
    private hbox: Phaser.Geom.Rectangle;
    private ctext: Phaser.GameObjects.Text;
    private basePos: number[]
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
        this.basePos = [x,y];
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

        this.ctext = this.scene.addText({
			x: -28-(this.myTxt.width/2),
			y: 0,
			size: 28,
			color: "white",
			text: "Chance: ",
		});
        this.add(this.ctext);
        this.ctext.setOrigin(1,0.5);
        this.ctext.setVisible(false);

        this.hbox = new Phaser.Geom.Rectangle(this.x-12-(this.myTxt.width/2),this.y+(52/2),this.myTxt.width+24,52);
    }

    adjustBack(){
        this.sp.setScale((24+this.myTxt.width)/256,2);
    }

    showChance(){
        let pp = this.ref.getPsvChance();
        this.ctext.setText("Chance: "+ (pp*100 + "%"));
        if(pp < 0.75) {
            this.ctext.setColor("yellow");
        }
        if(pp < 0.25) {
            this.ctext.setColor("red");
        }
        this.ctext.setVisible(true);
    }

    hideChance(){
        this.ctext.setColor("white");
        this.ctext.setText("Chance: ");
        this.ctext.setVisible(false);
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
        this.ref.resetAugWidgetButtons();
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
            this.showChance();
            this.sp.setAlpha(0.8);
        }
    }

    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        if(!this.stopped){
            this.hideChance();
            this.sp.setAlpha(0.35);
        }
    }
    forceOver(){
        if(!this.stopped){
            this.showChance();
            this.sp.setAlpha(0.8);
        }
    }

    hoverCheck(){
        if(!this.lockout){
            //console.log("Pointer at: " + this.scene.input.activePointer.x + ", " + this.scene.input.activePointer.y);
            if(Phaser.Geom.Rectangle.ContainsPoint(this.hbox,new Phaser.Geom.Point(this.scene.input.activePointer.x, this.scene.input.activePointer.y))){
                this.forceOver();
            }
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
                this.primed = false;
                this.ref.executeRoll(this.storedamt,this.success);
                this.ref.subtractWidgets(this.storedamt);
                this.storedamt = 0;
                if(this.success){
                    this.success = false;
                    this.process();
                } else {
                    this.success = false;
                    this.ref.failRoll();
                }
            } else {
                this.x = this.basePos[0] + -6 + (Math.random()*12);
                this.y = this.basePos[1] + -6 + (Math.random()*12);
            }
        }
    }

    softLock(){
        if(!this.stopped){
            this.softlock = true;
        }

    }

    unsoftLock(){
        if(!this.stopped){
            this.softlock = false;
        }
    }

}