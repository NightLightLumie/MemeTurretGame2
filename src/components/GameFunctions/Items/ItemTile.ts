import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";

export class ItemTile extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public tile: Phaser.GameObjects.Sprite;
    public icon: Phaser.GameObjects.Sprite;
    public overlay: Phaser.GameObjects.Rectangle;
    constructor(scene: GameScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
    }
}