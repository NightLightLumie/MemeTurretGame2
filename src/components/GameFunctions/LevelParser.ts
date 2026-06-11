import { LevelEntry, Levels } from "./Levels";
import { GameScene } from "@/scenes/GameScene";

export class LevelParser {
    public scene: GameScene;
    public loadedLevel: LevelEntry[] = [];
    public iTimer: number[] = [0,0];
    public iVar: number = 0;
    public iState: number = 0;
    public lVar: number = 0;
    public loopTimers: number[][] = [];
    public index: number = 0;

    public deleteFlag: boolean = false;


    constructor(scene: GameScene, lvl: LevelEntry[]){
        this.scene = scene;
        this.loadedLevel = lvl;
    }

    update(t: number, d: number){
        if((this.index < this.loadedLevel.length) && (this.index >= 0)){
            let a = this.loadedLevel[this.index];
            this.parse(d, a.cmd, a.args, a.cond);
        } else {
            console.log("Level parser index out of bounds of level commands. This may happen if you did not include an ''end'' or ''loop'' statement at the end of your level commands.");
            this.deleteFlag = true;
        }
    }

    parse(d: number, str: string[], args: number[], cond: boolean[]){
        if(str.length < 1){
            console.log("Tried to parse empty command argument.");
            this.deleteFlag = true;
            return;
        }
        switch(str[0]){
            case "spawn": { //cmd [***, enemy type, spawn type], args [amount of enemies, amount of times to spawn, spawning timer]
                if(args[1] <= 1) {
                    this.addEnemy(str[1],args[0], str[2]);
                    this.index++;
                    break;
                } else {
                    if(this.iVar > 0){
                        if(this.iTimer[0] <= 0){
                            this.addEnemy(str[1],args[0], str[2]);
                            this.iVar--;
                            this.iTimer[0] = this.iTimer[1];
                            if(this.iVar <= 0) {
                                this.iVar = 0;
                                this.iTimer = [0,0];
                                this.index++;
                            }
                            break;
                        } else {
                            this.iTimer[0] -= d;
                            break;
                        }
                    } else {
                        this.iVar = args[1];
                        this.iTimer[1] = args[2];
                        this.iTimer[0] = 0;
                        break;
                    }
                }
            } case "wait": {
                if((this.iTimer[0] <= 0) && (this.iVar <= 0)) {
                    this.iTimer = [args[0], args[0]];
                    this.iVar = 1;
                    break;
                } else if ((this.iVar >= 0) && (this.iTimer[0] <= 0)) {
                    this.iVar = 0;
                    this.iTimer = [0,0];
                    this.index++;
                    break;
                } else if ((this.iVar >= 0) && (this.iTimer[0] >=0)){
                    this.iTimer[0] -= d;
                    if(this.iTimer[0] <= 0){
                        this.iTimer[0] = 0;
                    }
                    break;
                } else {
                    this.iVar = 0;
                    this.iTimer = [0,0];
                    this.index++;
                    break;
                }
            } case "loop": { //args[where to jump, amount of loops, loop variable id]
                if(args[1] <= 1){
                    this.index = args[0];
                    break;
                } else {
                    this.decrementLoop(args);
                    break;
                }
            } case "waitEnemies":{
                if(this.scene.checkEnemies()){
                    this.index++;
                } else {
                    break;
                }
            } case "endStage": {
                break;
            }case "end": {
                this.deleteFlag = true;
                break;
            } default: {
                break;
            }
        }
    }

    decrementLoop(n: number[]){
        let found = false;
		for(let h = (this.loopTimers.length-1); h >= 0; h--){
            if(this.loopTimers[h][0] == n[2]){
                if(this.loopTimers[h][1] <= 0){
                    this.loopTimers.splice(h,1);
                    this.index++;
                    return;
                }
                this.loopTimers[h][1] -= 1;
                this.index = n[0];
                found = true;
            }
		}
        if(!found) {
            this.loopTimers.push([n[2],n[1]-1]);
            this.index = n[0];
            return;
        } else {
            return;
        }
    }

    spawn(){
        
    }

    addEnemy(id: string, amount: number, spawntype: string = "x"): boolean{
        this.scene.spawnEnemies(amount, spawntype,id,1);
        return false;
    }
}