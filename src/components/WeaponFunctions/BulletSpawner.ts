import { GameScene } from "@/scenes/GameScene";
import { PlayerObject } from "../PlayerObject";

export class BulletSpawner extends PlayerObject{
    public scene: GameScene;
    constructor(scene: GameScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
    }

    update(t: number, d: number){
        
    }
}