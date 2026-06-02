export interface LevelEntry{
    cmd: string;
    args: number[];
    cond: boolean[];
}

export class Levels {

/*
LEVEL CODING GUIDE:
# = optional
"spawn" : args [enemy index, amount of enemies, #amount of times to spawn, #spawning timer]
    IDS: 0 - sansplane
        1 - UFO
        2 - green sansplane
        3 - green UFO
        4 - eloncopter
"loop" : args[where to jump, amount of loops, #loop variable id]
*/

public lv1: LevelEntry[] = [
    {cmd: "spawn", args: [0,2,10,1000], cond: []},
    {cmd: "loop", args: [0,10,9999], cond: []},
]

}