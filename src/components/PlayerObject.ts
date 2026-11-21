import { BaseScene } from "@/scenes/BaseScene";

export class PlayerObject extends Phaser.GameObjects.Container{
    public deleteFlag: boolean;

    constructor(scene: BaseScene, x: number, y: number){
        super(scene,x,y);
        this.deleteFlag = false;
    }

    update(t: number, d: number){

    }

    hitCheck(t: Phaser.GameObjects.Container){

    }
}