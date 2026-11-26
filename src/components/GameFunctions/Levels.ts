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
    public levelData: LevelEntry[][] = [[
        {cmd: ["spawn", "thug", "xx"], args: [2,6,1000], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []}, 
        {cmd: ["wait"], args: [2500], cond: []},
        {cmd: ["loop"], args: [0,2,9999], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [5,3,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [5,3,250], cond: []},
        {cmd: ["wait"], args: [2000], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["loop"], args: [5,2,9998], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [3,2,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [2000], cond: []},
        {cmd: ["loop"], args: [11,2,9997], cond: []},
        {cmd: ["wait"], args: [3000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
        {cmd: ["wait"], args: [1500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [4,4,250], cond: []},
        {cmd: ["diffGate"], args: [9,30], cond: []},
        {cmd: ["wait"], args: [1500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [3,2,100], cond: []},
        {cmd: ["diffGate"], args: [29,30], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [4,2,100], cond: []},
        {cmd: ["diffGate"], args: [39,30], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [5,4,100], cond: []},
        {cmd: ["wait"], args: [4000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,2,250], cond: []},
        {cmd: ["diffGate"], args: [9,43], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [5,2,100], cond: []},
        {cmd: ["diffGate"], args: [29,43], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [3,4,100], cond: []},
        {cmd: ["diffGate"], args: [39,43], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [7,4,100], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [2500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["diffGate"], args: [9,58], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [3,2,100], cond: []},
        {cmd: ["diffGate"], args: [19,58], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [6,2,100], cond: []},
        {cmd: ["diffGate"], args: [29,58], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [8,2,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [1,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [15,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [15,2,250], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["diffGate"], args: [39,70], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [10,2,100], cond: []},
        {cmd: ["diffGate"], args: [49,70], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,6,100], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [20,2,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [4,5,2500], cond: []},
        {cmd: ["wait"], args: [3500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [20,2,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [4,5,2500], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["diffGate"], args: [9,97], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,2,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,2,2500], cond: []},
        {cmd: ["diffGate"], args: [19,97], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [3,2,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,2,2500], cond: []},
        {cmd: ["diffGate"], args: [29,97], cond: []},
        {cmd: ["wait"], args: [8000], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [24,2,100], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [20,3,500], cond: []},
        {cmd: ["diffGate"], args: [39,97], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [20,3,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,10,200], cond: []},
        {cmd: ["diffGate"], args: [49,97], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [24,2,100], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,10,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,10,2500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [10,10,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,10,2500], cond: []},
        {cmd: ["diffGate"], args: [9,113], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [4,5,500], cond: []},
        {cmd: ["diffGate"], args: [19,113], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [5,10,500], cond: []},
        {cmd: ["diffGate"], args: [29,113], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [5,10,500], cond: []},
        {cmd: ["diffGate"], args: [39,113], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [3,10,2500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [3,10,500], cond: []},
        {cmd: ["diffGate"], args: [49,113], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [10,40,100], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [4000], cond: []},
        {cmd: ["diffGate"], args: [14,122], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [5,2,250], cond: []},
        {cmd: ["diffGate"], args: [19,122], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [5,2,250], cond: []},
        {cmd: ["diffGate"], args: [24,122], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [2,3,100], cond: []},
        {cmd: ["diffGate"], args: [9,142], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawnBoss", "carrier", "far"], args: [2400], cond: []},
        {cmd: ["diffGate"], args: [29,140], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [2,3,50], cond: []},
        {cmd: ["diffGate"], args: [34,140], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [4,3,250], cond: []},
        {cmd: ["diffGate"], args: [39,140], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [6,3,250], cond: []},
        {cmd: ["diffGate"], args: [44,140], cond: []},
        {cmd: ["wait"], args: [2000], cond: []},
        {cmd: ["spawnBoss", "carrier", "far"], args: [2400], cond: []},
        {cmd: ["diffGate"], args: [49,140], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [15,4,300], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["diffGate"], args: [49,145], cond: []},
        {cmd: ["skip"], args: [173], cond: []},
        {cmd: ["incDifficulty"], args: [5], cond: [true]},
        {cmd: ["spawn", "thug", "xx"], args: [3,2,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [4,3,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
        {cmd: ["diffGate"], args: [19,159], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [2,3,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
        {cmd: ["diffGate"], args: [39,159], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [2,3,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
        {cmd: ["wait"], args: [2500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [4,5,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["wait"], args: [1000], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [4,3,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
        {cmd: ["wait"], args: [2500], cond: []},
        {cmd: ["spawn", "thug", "xx"], args: [4,5,500], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
        {cmd: ["diffGate"], args: [19,177], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [2,3,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
        {cmd: ["diffGate"], args: [39,177], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [2,3,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["diffGate"], args: [49,195], cond: []},
        {cmd: ["wait"], args: [500], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [20,10,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [10,5,200], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [30,10,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [10,10,200], cond: []},
        {cmd: ["waitEnemies"], args: [], cond: []},
        {cmd: ["spawn", "greenthug", "xx"], args: [15,10,100], cond: []},
        {cmd: ["spawn", "ufo", "r"], args: [10,10,200], cond: []},
        {cmd: ["spawnBoss", "carrier", "far"], args: [2400], cond: []},
        {cmd: ["wait"], args: [2500], cond: []},
        {cmd: ["spawnBoss", "carrier", "far"], args: [2400], cond: []},
        {cmd: ["wait"], args: [2500], cond: []},
        {cmd: ["spawnBoss", "carrier", "far"], args: [2400], cond: []},
        {cmd: ["incDifficulty"], args: [10], cond: [true]},
        {cmd: ["loop"], args: [179], cond: []},
        {cmd: ["loop"], args: [18], cond: []},]
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