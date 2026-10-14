import { GameScene } from "@/scenes/GameScene";
import { Item } from "./Item";
import { Player } from "@/components/Player";

export class CancelDeath extends Item{
    constructor(scene:GameScene, p: Player, id: string, slot: number){
        super(scene, p, id);
    }

    update(t: number, d: number){


    }


}

