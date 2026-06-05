import { UpgradeScene } from "@/scenes/UpgradeScene";
import { Button } from "../WeaponFunctions/Button";
import { image } from "@/assets/util";
import { BaseScene } from "@/scenes/BaseScene";
import { AugmentScreen } from "../WeaponFunctions/AugmentScreen";

export class AugmentControlButton extends Button{
    public scene: BaseScene;
    public sp: Phaser.GameObjects.Sprite;
    public owner: AugmentScreen;
    public mode: string = "close";
    private internalCooldown: number[] = [0,250];
    private index: number = 0;
    constructor(scene: BaseScene, own:AugmentScreen, spr: string, x: number, y: number, mode: string = "close"){
        super(scene, x, y);
        this.scene = scene;
        this.owner = own;
        this.mode = mode;
        this.sp = this.scene.add.sprite(0,0,spr);
        this.add(this.sp);
        this.scene.add.existing(this);
        this.sp.setOrigin(0.5, 0.5);
        this.bindInteractive(this.sp);
        this.setInteractive();
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        this.scene.sound.play("scroll");
        this.trigger();
    }

    trigger(){
        switch(this.mode){
            case "upgrade": {
                if(this.internalCooldown[0] <= 0)
                {
                    this.owner.upgrade();
                } else {
                    this.rest();
                    this.internalCooldown[0] = this.internalCooldown[1];
                }
                break;
            } case "add": {
                break;
            } case "close": {
                this.owner.closeUpgradeMode();
                break;
            } default: {
                break;
            }
        }
    }

    rest(){
        this.sp.setAlpha(0.5);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    veil(){
        this.sp.setAlpha(0);
        this.sp.disableInteractive();
        this.disableInteractive();
    }

    unveil(){
        this.sp.setAlpha(1);
        this.sp.setInteractive();
        this.setInteractive();
    }

    update(t: number, d: number){
        if(this.internalCooldown[0] > 0) {
            this.internalCooldown[0] -= d;
            if(this.internalCooldown[0] <= 0) {
                this.internalCooldown[0] = 0;
                this.unveil();
            }
        }
    }

}