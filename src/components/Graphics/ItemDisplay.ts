import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { ItemTile } from "../GameFunctions/Items/ItemTile";


export class ItemDisplay extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public owner: Player;
    /*
    private tileSet: number[][] = [[-3280, -130],[-3120, -130],[-2960, -130],[-2800, -130],
        [-3280, 30],[-3120, 30],[-2960, 30],[-2800, 30]];
        */

    private tileSet: number[][] = [[-1720, 720],[-1560, 720],[-1400, 720],[-1240, 720],
    [-1720, 880],[-1560, 880],[-1400, 880],[-1240, 880]];
    private tileList: ItemTile[];
    constructor (scene: GameScene, x: number, y: number, p: Player){
        super(scene,x,y);
        this.scene = scene;
        this.owner = p;
        this.tileList = [];
        this.tileSet.forEach((ts) => {
            let c = new ItemTile(this.scene,ts[0],ts[1]);
            this.add(c);
            this.tileList.push(c);
        });
    }

    redrawItems(){
        this.tileList.forEach((tt) => {
            tt.setTile("itemtile");
            tt.setIcon("itemtile");
        })
        this.owner.items.forEach((ii) =>
        {
            if((ii.slot >= 0) && (ii.slot < this.tileList.length)){
                this.tileList[ii.slot].setItem(ii);
                this.tileList[ii.slot].setTile(ii.imgs[0]);
                this.tileList[ii.slot].setIcon(ii.imgs[1]);
            }
        });
    }

    update(){
        this.tileList.forEach((tt) => tt.update());
    }

}