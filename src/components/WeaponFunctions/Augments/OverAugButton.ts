import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";
import { AugmentBar } from "./AugmentBar";
import { AugmentScreen } from "./AugmentScreen";

export class OverAugButton extends Button{
    public scene: UpgradeScene;
    public sp: Phaser.GameObjects.Sprite;
    public back: Phaser.GameObjects.Rectangle;
    public pos: number;
    private lockout: boolean;
    public ref: AugmentScreen;
    private maxLen: number;
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
        this.back.setOrigin(0,0.5);
        this.back.setVisible(true);
        this.back.setAlpha(0.01);
        this.add(this.back);
        this.bindInteractive(this.back)
        this.back.setInteractive();
        this.lockout = false;
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        this.process();
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

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
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
        this.sp.setVisible(true);
        this.sp.setAlpha(0.5);
        this.sp.disableInteractive();
        this.disableInteractive();
        this.lockout = true;
    }

    unveil(){
        this.sp.setVisible(true);
        this.sp.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
        this.lockout = false;
    }

    hide(){
        this.sp.setVisible(false);
        this.sp.disableInteractive();
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
            this.ref.addAugmentSlot(this.pos);
        } else {
            this.ref.increaseAugmentCap(this.pos);
        }
    }

}