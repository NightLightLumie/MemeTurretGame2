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
        [{cmd: ["spawn", "thug", "x"], args: [2,5,1000], cond: []},
        {cmd: ["wait"], args: [10000], cond: []},
        {cmd: ["spawn", "thug", "x"], args: [5,3,500], cond: []},
        {cmd: ["wait"], args: [2000], cond: []},
        {cmd: ["spawn", "thug", "x"], args: [5,3,500], cond: []},
        {cmd: ["wait"], args: [12000], cond: []},
        {cmd: ["loop"], args: [0,3,9999], cond: []},
        {cmd: ["spawn", "thug", "x"], args: [10,3,500], cond: []},
        {cmd: ["spawn", "thug", "x"], args: [10,3,500], cond: []},
        {cmd: ["wait"], args: [12000], cond: []},
        {cmd: ["loop"], args: [7], cond: []},]
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