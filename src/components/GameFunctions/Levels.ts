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
        [
/*0*/   {cmd: ["spawn", "thug", "xx"], args: [2,6,1000], cond: []},
/*1*/   {cmd: ["waitEnemies"], args: [], cond: []},
/*2*/   {cmd: ["wait"], args: [5000], cond: []},
/*3*/   {cmd: ["loop"], args: [0,2,9999], cond: []},
/*4*/   {cmd: ["wait"], args: [500], cond: []},
/*5*/   {cmd: ["spawn", "thug", "xx"], args: [5,3,250], cond: []},
/*6*/   {cmd: ["wait"], args: [1000], cond: []},
/*7*/   {cmd: ["spawn", "thug", "xx"], args: [5,3,250], cond: []},
/*8*/   {cmd: ["wait"], args: [4000], cond: []},
/*9*/   {cmd: ["waitEnemies"], args: [], cond: []},
/*10*/  {cmd: ["loop"], args: [5,2,9998], cond: []},
/*11*/  {cmd: ["wait"], args: [500], cond: []},
/*12*/  {cmd: ["spawn", "thug", "xx"], args: [3,2,500], cond: []},
/*13*/  {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
/*14*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*15*/  {cmd: ["wait"], args: [2000], cond: []},
/*16*/  {cmd: ["loop"], args: [11,2,9997], cond: []},
/*17*/  {cmd: ["wait"], args: [5000], cond: []},
/*18*/  {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
/*19*/  {cmd: ["wait"], args: [3000], cond: []},
/*20*/  {cmd: ["spawn", "thug", "xx"], args: [4,4,250], cond: []},
/*21*/  {cmd: ["wait"], args: [12000], cond: []},
/*22*/  {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
/*23*/  {cmd: ["wait"], args: [1000], cond: []},
/*24*/  {cmd: ["spawn", "thug", "xx"], args: [10,2,250], cond: []},
/*25*/  {cmd: ["wait"], args: [15000], cond: []},
/*26*/  {cmd: ["spawn", "ufo", "r"], args: [2,2,1500], cond: []},
/*27*/  {cmd: ["wait"], args: [1000], cond: []},
/*28*/  {cmd: ["spawn", "thug", "xx"], args: [10,2,250], cond: []},
/*29*/  {cmd: ["wait"], args: [1000], cond: []},
/*30*/  {cmd: ["spawn", "ufo", "r"], args: [1,2,250], cond: []},
/*31*/  {cmd: ["wait"], args: [1000], cond: []},
/*32*/  {cmd: ["spawn", "thug", "xx"], args: [15,2,250], cond: []},
/*33*/  {cmd: ["wait"], args: [1000], cond: []},
/*34*/  {cmd: ["spawn", "thug", "xx"], args: [15,2,250], cond: []},
/*35*/  {cmd: ["wait"], args: [1000], cond: []},
/*36*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*37*/  {cmd: ["spawn", "thug", "xx"], args: [20,2,500], cond: []},
/*38*/  {cmd: ["spawn", "ufo", "r"], args: [4,5,2500], cond: []},
/*39*/  {cmd: ["wait"], args: [5000], cond: []},
/*40*/  {cmd: ["spawn", "thug", "xx"], args: [20,2,500], cond: []},
/*41*/  {cmd: ["spawn", "ufo", "r"], args: [4,5,2500], cond: []},
/*42*/  {cmd: ["wait"], args: [5000], cond: []},
/*43*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*44*/  {cmd: ["spawn", "thug", "xx"], args: [10,10,500], cond: []},
/*45*/  {cmd: ["spawn", "ufo", "r"], args: [3,10,2500], cond: []},
/*46*/  {cmd: ["spawn", "thug", "xx"], args: [10,10,500], cond: []},
/*47*/  {cmd: ["spawn", "ufo", "r"], args: [3,10,2500], cond: []},
/*48*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*49*/  {cmd: ["wait"], args: [6000], cond: []},
/*50*/  {cmd: ["incDifficulty"], args: [2], cond: []},
/*51*/  {cmd: ["spawn", "thug", "xx"], args: [3,2,500], cond: []},
/*52*/  {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
/*53*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*54*/  {cmd: ["spawn", "thug", "xx"], args: [4,3,500], cond: []},
/*55*/  {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
/*56*/  {cmd: ["wait"], args: [5000], cond: []},
/*57*/  {cmd: ["spawn", "thug", "xx"], args: [4,5,500], cond: []},
/*58*/  {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
/*59*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*60*/  {cmd: ["wait"], args: [2000], cond: []},
/*61*/  {cmd: ["spawn", "thug", "xx"], args: [4,3,500], cond: []},
/*62*/  {cmd: ["spawn", "ufo", "r"], args: [2,1,500], cond: []},
/*63*/  {cmd: ["wait"], args: [5000], cond: []},
/*64*/  {cmd: ["spawn", "thug", "xx"], args: [4,5,500], cond: []},
/*65*/  {cmd: ["spawn", "ufo", "r"], args: [2,4,500], cond: []},
/*66*/  {cmd: ["waitEnemies"], args: [], cond: []},
/*67*/  {cmd: ["loop"], args: [18], cond: []},]
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