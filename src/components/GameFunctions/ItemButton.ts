import { GameScene } from "@/scenes/GameScene";
import { Button } from "../WeaponFunctions/Button";

export class ItemButton extends Button{
    public scene: GameScene;
    public bkg: Phaser.GameObjects.Sprite
    constructor(scene:GameScene,x:number,y:number){
        super(scene,x,y);
        this.scene = scene;
        this.bkg = this.scene.add.sprite(0,0,"itemframeback");
        this.bkg.setOrigin(0,0);
        this.add(this.bkg);
        this.bkg.setDepth(0);

        this.bindInteractive(this.bkg);
        this.bkg.setInteractive();
    }

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
    }
}