import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";
import { AugmentBar } from "./AugmentBar";
import { AugmentScreen } from "./AugmentScreen";
import { ExpandEffect } from "@/components/Graphics/ExpandEffect";

export class OverAugButton extends Button{
    public scene: UpgradeScene;
    public sp: Phaser.GameObjects.Sprite;
    public back: Phaser.GameObjects.Rectangle;
    public pos: number;
    private lockout: boolean;
    private softlock: boolean;
    public ref: AugmentScreen;
    private maxLen: number;
    private primed: boolean;
    private storedamt: number;
    private hbox: Phaser.Geom.Rectangle;
    private success: boolean;
    private txt: Phaser.GameObjects.Text;
    private basePos: number[];
    constructor(scene: UpgradeScene, x: number, y: number, pos: number, len: number, myref: AugmentScreen){
        super(scene, x, y);
        this.scene = scene;
        this.pos = pos;
        this.ref = myref;
        this.sp = this.scene.add.sprite(0,0,"aug");
        this.maxLen = this.ref.getRefLength(pos);
        if(this.maxLen >= 10){
            this.sp.setTexture("aug_extra");
        }
        this.add(this.sp);
        this.sp.x = AugmentBar.begin+AugmentBar.offset*(this.maxLen);
        this.sp.setAlpha(0.35);
        this.sp.setVisible(false);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.sp.setScale(1,1);
        this.back = this.scene.add.rectangle(AugmentBar.begin-72-32-2,0,72+4+AugmentBar.offset*len,66,0xFFFFFF,1);
        this.hbox = new Phaser.Geom.Rectangle(this.x+AugmentBar.begin-72-32-2,this.y-33,72+4+AugmentBar.offset*len,66);
        this.back.setOrigin(0,0.5);
        this.back.setVisible(true);
        this.back.setAlpha(0.01);
        this.add(this.back);
        this.bindInteractive(this.back)
        this.back.setInteractive();
        this.basePos = [this.x,this.y];

        this.primed = false;
        this.success = false;
        this.storedamt = 0;
        this.lockout = false;
        this.softlock = false;
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout || this.softlock){
            return;
        }
        this.lock();
        this.primed = true;
        let px = this.ref.owner.roll(this.scene.masterData.widgets,this.ref.getAugChance(this.pos));
        this.storedamt = px[0];
        this.success = px[1];
        this.back.fillColor = 0xFF57CD;
        //console.log("Amount consumed: " + this.storedamt);
        this.ref.signalRoll(this.storedamt);
        //this.process();
        /*
        this.sp.setFrame(0);
        this.scene.sound.play("scroll");
        this.veil();
        this.scene.openMacguffinMode();
        */
    }

    setRef(ref: AugmentScreen){
        this.ref = ref;
    }

    forceOver(){
        if(this.maxLen > 0){
            if(this.maxLen < this.ref.owner.augBars[this.pos].ref.lvcap){
                this.ref.owner.augBars[this.pos].flashBar(this.maxLen);
            }
            this.sp.setVisible(true);
        }
        this.ref.showChance(this.pos);
        this.back.setAlpha(0.5);

    }

    forceOut(){
        if(this.maxLen > 0){
            if(this.maxLen < this.ref.owner.augBars[this.pos].ref.lvcap){
                this.ref.owner.augBars[this.pos].unflashBar(this.maxLen);
            }
            this.sp.setVisible(false);
        }

        this.ref.hideChance();
        this.back.setAlpha(0.01);
    }

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        if(this.maxLen > 0){
            if(this.maxLen < this.ref.owner.augBars[this.pos].ref.lvcap){
                this.ref.owner.augBars[this.pos].flashBar(this.maxLen);
            }
            this.sp.setVisible(true);
        }
        this.ref.showChance(this.pos);
        this.back.setAlpha(0.5);
    }

    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        if(this.maxLen > 0){
            if(this.maxLen < this.ref.owner.augBars[this.pos].ref.lvcap){
                this.ref.owner.augBars[this.pos].unflashBar(this.maxLen);
            }
            this.sp.setVisible(false);
        }

        this.ref.hideChance();
        this.back.setAlpha(0.01);
    }

    veil(){
        this.setVisible(true);
        this.setAlpha(0.5);
        this.back.removeInteractive();
        this.disableInteractive();
        this.lockout = true;
    }

    superveil(){
        this.setVisible(true);
        this.setAlpha(0.5);
        this.back.setAlpha(0.01);
        this.back.removeInteractive();
        this.disableInteractive();
        this.lockout = true;
    }

    unveil(){
        this.setVisible(true);
        this.setAlpha(1);
        this.back.setInteractive();
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

    process(){
        if(this.maxLen < 0){
            let bx = this.basePos[0]+AugmentBar.begin-32+6+(AugmentBar.offset*(1))-(AugmentBar.offset/2);
            this.ref.scene.addEffect(new ExpandEffect(this.scene,bx,this.basePos[1],"augboxwhite",500,0,0,[1,1],[1,20],[0.35,0]));
            this.ref.scene.addEffect(new ExpandEffect(this.scene,bx,this.basePos[1],"augboxwhite",500,0,0,[1,1],[1,10],[0.75,0]));
            this.ref.addAugmentSlot(this.pos);

        } else {
            let bx = this.basePos[0]+AugmentBar.begin-32+6+(AugmentBar.offset*(this.maxLen+1))-(AugmentBar.offset/2);
            this.ref.scene.addEffect(new ExpandEffect(this.scene,bx,this.basePos[1],"augboxwhite",500,0,0,[1,1],[1,20],[0.35,0]));
            this.ref.scene.addEffect(new ExpandEffect(this.scene,bx,this.basePos[1],"augboxwhite",500,0,0,[1,1],[1,10],[0.75,0]));
            this.ref.increaseAugmentCap(this.pos);
        }
    }

    lock(){
        this.lockout = true;
    }

    unlock(){
        this.lockout = false;
    }

    softLock(){
        this.softlock = true;
    }

    unsoftLock(){
        this.softlock = false;
    }

    hoverCheck(){
        if(!this.lockout){
            //console.log("Pointer at: " + this.scene.input.activePointer.x + ", " + this.scene.input.activePointer.y);
            if(Phaser.Geom.Rectangle.ContainsPoint(this.hbox,new Phaser.Geom.Point(this.scene.input.activePointer.x, this.scene.input.activePointer.y))){
                this.forceOver();
            }
        }
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

}