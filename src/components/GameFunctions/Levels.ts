import { GameScene } from "@/scenes/GameScene";
import { LevelParser } from "./LevelParser";

export interface LevelEntry{
    cmd: string[];
    args: number[];
    cond: boolean[];

}

export class Levels {

/*
LEVEL CODING GUIDE:
# = optional
"spawn" : cmd [***, enemy name, spawning type] args [amount of enemies, #amount of times to spawn, #spawning timer]
    IDS: 0 - sansplane
        1 - UFO
        2 - green sansplane
        3 - green UFO
        4 - eloncopter
"loop" : args[where to jump, amount of loops, #loop variable id]
*/
    public levelData: LevelEntry[][] = [
        [{cmd: ["spawn", "thug", "xx"], args: [2,5,1000], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [5000], cond: []},
        {cmd: ["loop"], args: [0,2,9999], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [5,3,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [5,3,250], cond: []},
        {cmd: ["wait"], args: [4000], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["loop"], args: [5,2,9998], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [3,2,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [2000], cond: []},
        {cmd: ["loop"], args: [11,2,9997], cond: []},
        {cmd: ["wait"], args: [5000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
        {cmd: ["wait"], args: [3000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [4,4,250], cond: []},
        {cmd: ["wait"], args: [12000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,2,250], cond: []},
        {cmd: ["wait"], args: [15000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [1,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [15,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [15,2,250], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,10,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,10,2500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,10,500], cond: []},
        {cmd: ["wait"], args: [12000], cond: []},
        {cmd: ["loop"], args: [0], cond: []},]
    ];

    public scene: GameScene;

    public activeLevels: LevelParser[];

    constructor(scene: GameScene){
        this.activeLevels = [];
        this.scene = scene;
    }

    load(num: number){
        if((num < this.levelData.length) && (num >= 0)){
            this.activeLevels.push(new LevelParser(this.scene, this.levelData[num]));
        } else {
            console.log("Cannot load level. No level with the specified index exists.");
            return;
        }

    }

    update(t: number, d: number){
		for(let a = (this.activeLevels.length-1); a >= 0; a--){
			this.activeLevels[a].update(t, d);
			if(this.activeLevels[a].deleteFlag) {
				this.activeLevels.splice(a,1);
			}
		}
    }

}