import { BaseScene } from "@/scenes/BaseScene";
import { AugmentUI } from "./AugmentUI";
import { AugmentBar } from "./AugmentBar";

export class TempBar extends Phaser.GameObjects.Container{
    private header: Phaser.GameObjects.Image;
    private bars: Phaser.GameObjects.Sprite[];
    public pos: number;
    constructor(scene: BaseScene, x: number, y: number, pos: number){
        super(scene,x,y);
        this.bars = [];
        this.pos = pos;
        this.header = this.scene.add.sprite(AugmentBar.begin-72, 0, "aug_button_lock");
        this.add(this.header);
        for(let n = 0; n < 10; n++){
            let px = this.scene.add.sprite(AugmentBar.begin+AugmentBar.offset*n,0,"aug_lock");
            this.bars.push(px);
            this.add(px);
        }
    }
}