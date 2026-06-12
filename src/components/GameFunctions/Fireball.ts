import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { Item } from "./Item";

export class Fireball extends Item{
    constructor(scene: GameScene, p: Player, name: string){
        super(scene, p, name);
    }

}