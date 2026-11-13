import { WeaponEntry } from "./WeaponFunctions/Armory";

export interface SaveState {
    version: string;
    curGunID: number;
    boxCount: number;
    money: number;
    widgets: number;
    lootBoxes: number[];
    gunList: Map<number, WeaponEntry>;
    soldGuns: Map<number, WeaponEntry>;
}

export class SaveData {
    constructor(){

    }
}