import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../WeaponFunctions/Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";

export class NextSceneButton extends Button{
    public scene: BaseScene;
    public sp: Phaser.GameObjects.Image;
    constructor(scene: BaseScene, x: number, y: number){
        super(scene, x, y);
        this.scene = scene;
        this.sp = this.scene.add.image(0,0,"nxtscene");
        this.add(this.sp);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.sp.setScale(0.65,0.65);
        this.bindInteractive(this.sp);
        this.sp.setInteractive();
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        this.scene.sound.play("scroll");
        this.veil();
        this.scene.progress();
    }

    veil(){
        this.sp.setVisible(true);
        this.sp.setAlpha(0.5);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    unveil(){
        this.sp.setVisible(true);
        this.sp.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
    }

    hide(){
        this.sp.setVisible(false);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    unhide(){
        this.sp.setVisible(true);
        this.sp.setInteractive();
        this.setInteractive();
    }

}