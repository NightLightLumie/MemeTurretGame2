import { GameScene } from "@/scenes/GameScene";

export class ItemShop extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public back: Phaser.GameObjects.Sprite;


    constructor(scene: GameScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.back = this.scene.add.sprite(0,0,"itemshop");
        this.add(this.back);
        this.back.setDepth(0);

    }

    initializeItems(){
        
    }
}