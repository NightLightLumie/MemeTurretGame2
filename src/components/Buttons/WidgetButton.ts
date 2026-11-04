import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../WeaponFunctions/Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";

export class WidgetButton extends Button{
    public scene: UpgradeScene;
    public sp: Phaser.GameObjects.Image;
    private lockout: boolean;
    constructor(scene: UpgradeScene, x: number, y: number){
        super(scene, x, y);
        this.scene = scene;
        this.sp = this.scene.add.image(0,0,"widgetbutton");
        this.add(this.sp);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.sp.setScale(1,1);
        this.bindInteractive(this.sp);
        this.sp.setInteractive();
        this.lockout = false;
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        this.sp.setFrame(0);
        this.scene.sound.play("scroll");
        this.veil();
        this.scene.openMacguffinMode();
    }

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        this.sp.setFrame(1);
    }

    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        if(this.lockout){
            return;
        }
        this.sp.setFrame(0);
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

}