import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "../WeaponFunctions/Button";

export class MainSceneButton extends Button {
    private spr: Phaser.GameObjects.Sprite;
    constructor(scene: BaseScene, x: number, y: number, img: string){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,img);
        this.add(this.spr);
        this.spr.setOrigin(0.5,0.5);
        this.bindInteractive(this.spr);
        this.spr.setInteractive();
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        super.onDown(pointer,localX,localY,event);
    }
    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        this.spr.setFrame(1);
    }
    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        this.spr.setFrame(0);
    }

    veil(){
        this.setVisible(false);
        this.spr.disableInteractive();
    }

    unveil(){
        this.setVisible(true);
        this.spr.setInteractive();
    }

    lock(){
        this.spr.removeInteractive();
        this.spr.setInteractive(false);
    }
}