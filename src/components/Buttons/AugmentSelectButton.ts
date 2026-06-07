import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../WeaponFunctions/Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";
import { AugmentScreen } from "../WeaponFunctions/AugmentScreen";
import { Augment } from "../WeaponFunctions/Weapon";

export class AugmentSelectButton extends Button{
    public scene: BaseScene;
    private sp: Phaser.GameObjects.Sprite;
    private img: Phaser.GameObjects.Image;
    private bkg: Phaser.GameObjects.Image;
    public owner: AugmentScreen;
    public aug: Augment;
    private internalCooldown: number[] = [0,250];
    private index: number = 0;
    constructor(scene: BaseScene, own:AugmentScreen, x: number, y: number, aug: Augment, allowed: boolean = false){
        super(scene, x, y);
        this.scene = scene;
        this.owner = own;
        this.aug = aug;
        this.bkg = this.scene.add.image(0,0,"aug_select_back");
        this.add(this.bkg);
        this.bkg.setAlpha(0.5);
        this.sp = this.scene.add.sprite(0,0,"aug_select_frame");
        this.add(this.sp);
        this.img = this.scene.add.image(0,0,"aug_"+this.aug.index);
        this.img.setScale(1.5,1.5);
        this.add(this.img);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.bindInteractive(this.sp);
        this.setInteractive();
        this.setScale(1,1);

        if(!allowed){
            this.rest();
        }
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        this.scene.sound.play("scroll");
        this.trigger();
    }

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        this.sp.setFrame(1);
        this.bkg.setAlpha(1);
        this.owner.updateAugText(this.aug);
    }

    onOut(){
        this.sp.setFrame(0);
        this.bkg.setAlpha(0.5);
        this.owner.clearText();
    }

    trigger(){
        this.owner.replaceEmptyAugment(this.aug);
        this.owner.closeAddMode();
    }

    rest(){
        this.setAlpha(0.25);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    veil(){
        this.setAlpha(0);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    unveil(){
        this.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
    }

    update(t: number, d: number){
    }

}