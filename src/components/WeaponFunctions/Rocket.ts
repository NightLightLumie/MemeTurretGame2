import { GameScene } from "@/scenes/GameScene";
import { Missile } from "./Missile";
import { Weapon } from "./Weapon";

export class Rocket extends Missile{
    public scene: GameScene;
    private owner: Weapon;
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, owner: Weapon){
        super(scene,x,y,name,angle);
        this.scene = scene;
        this.owner = owner;
        this.damage = this.owner.damage;
    }
}