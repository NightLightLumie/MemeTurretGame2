import { LootScene } from "@/scenes/LootScene";
import { Button } from "./Button";

export class Lootbox extends Button{
    public scene: LootScene;

    public panelR: Phaser.GameObjects.Sprite;
    public panelL: Phaser.GameObjects.Sprite;
    public chassis: Phaser.GameObjects.Sprite;
    public lv: number = 0;

    public liftTime: number = 750;
    public pauseTime: number = 200;
    public openTime: number = 900;

    public curTime: number = 0;
    public phase: number = 3;
    public boxParts: Phaser.GameObjects.Container;
    public lootTable: number[] = [];
    public selectedGun: number;
    private unrevealed: boolean = true;
    private timers: number[] = [900,200,750];

    constructor(scene: LootScene, x: number, y: number, lv: number, table: number[]){
        super(scene,x,y);
        this.scene = scene;
        this.lv = lv;
        this.lootTable = table;
        this.selectedGun = this.lootTable[Math.trunc(Math.random()*this.lootTable.length)];
        this.initiateImages();
    }

    initiateImages(){
        this.panelR = this.scene.add.sprite(0,0,("arm_r_" + this.lv));
        this.add(this.panelR);
        this.panelR.setOrigin(0.5,0.5);
        this.panelR.setDepth(5);
        this.panelL = this.scene.add.sprite(0,0,("arm_l_" + this.lv));
        this.add(this.panelL);
        this.panelL.setOrigin(0.5,0.5);
        this.panelL.setDepth(6);
        this.chassis = this.scene.add.sprite(0,0,("box_" + this.lv));
        this.add(this.chassis);
        this.chassis.setOrigin(0.5,0.5);
        this.chassis.setDepth(10);
        this.boxParts = new Phaser.GameObjects.Container(this.scene,0,0);
        this.add(this.boxParts);

        this.boxParts.add(this.panelR);
        this.boxParts.add(this.panelL);
        this.boxParts.add(this.chassis);

        this.bindInteractive(this.chassis);
        this.chassis.setInteractive();
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.phase == 3){
            this.open();
            this.chassis.setInteractive(false);
            this.chassis.removeInteractive();
        }

    }

    open(){
        this.phase = 2;
        this.curTime = this.timers[this.phase];
    }

    reveal(){
        if(this.unrevealed){
            this.scene.reveal();
            this.unrevealed = false;
        }
    }

    update(t: number, d: number){
        if(this.curTime > 0){
            this.curTime -= d;
            if(this.curTime <= 0) {
                if(this.phase > 0){
                    this.phase--;
                    this.curTime = this.timers[this.phase];
                } else {
                    if(this.unrevealed){
                        this.curTime = 0;
                        this.reveal();
                    }
                }
            }
            switch(this.phase){
                case 2: {
                    if(this.panelR.y < 120) {
                        this.panelR.y -= d*(120/720);
                        if(this.panelR.y >= 120) {
                            this.panelR.y = 120;
                        }    
                    }
                    if(this.panelL.y < 120) {
                        this.panelL.y -= d*(120/720);
                        if(this.panelL.y >= 120) {
                            this.panelL.y = 120;
                        }    
                    }
                    break;
                } case 1: {
                    break;
                } case 0: {
                    if(this.panelR.x < 170) {
                        this.panelR.x += d*(170/850);
                        if(this.panelR.x >= 170) {
                            this.panelR.x = 170;
                        }    
                    }
                    if(this.panelL.x > -170) {
                        this.panelL.x += d*(-170/850);
                        if(this.panelL.x <= -170) {
                            this.panelL.x = -170;
                        }    
                    }
                    break;
                }
            }
        }
    }

    


}