import { Thug } from "./Thug";
import { GameScene } from "@/scenes/GameScene";

export class MiniThug extends Thug{
    constructor(scene:GameScene,x:number,y:number, mode: string = "x", ofs: number = 0, seek: string = "x", diff: number = -1){
        super(scene,x,y,mode,ofs,seek,diff);
        this.aCD = [0, 200];
        this.v = 300+(Math.random()*200);
        this.hp = 3000;
        this.spr.setTexture("enemy_3");
        this.setDifficulty(diff);
        this.value = 0;
    }
}