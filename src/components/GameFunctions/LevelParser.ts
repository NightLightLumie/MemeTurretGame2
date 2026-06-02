import { Levels } from "./Levels";
import { GameScene } from "@/scenes/GameScene";

export class LevelParser {
    public scene: GameScene;
    public loadedLevel: Levels;
    public iTimer: number[] = [0,0];
    public iVar: number = 0;
    public iState: number = 0;
    public lVar: number = 0;
    public loopTimers: number[][];
    public index: number = 0;


    constructor(scene: GameScene){
        this.scene = scene;
    }

    parse(d: number, str: string, args: number[], cond: boolean[]){

        switch(str){
            case "spawn": { //args [enemy index, amount of enemies, amount of times to spawn, spawning timer]
                if(args[2] <= 1) {
                    this.addEnemy(args[0],args[1]);
                    this.index++;
                    break;
                } else {
                    if(this.iVar > 0){
                        if(this.iTimer[0] <= 0){
                            this.addEnemy(args[0],args[1]);
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
                        this.iVar = args[2];
                        this.iTimer[1] = args[3];
                        this.iTimer[0] = 0;
                        break;
                    }
                }
            } case "loop": { //args[where to jump, amount of loops, loop variable id]
                if(args[1] <= 1){
                    this.index = args[0];
                    break;
                } else {
                    this.decrementLoop(args);
                    break;
                }
            } case "end": {
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
                this.loopTimers[h][1] -= 1;
                this.index = n[0];
                found = true;
            }
			if(this.loopTimers[h][1] <= 0) {
				this.loopTimers.splice(h,1);
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

    addEnemy(id: number, amount: number): boolean{
        return false;
    }
}