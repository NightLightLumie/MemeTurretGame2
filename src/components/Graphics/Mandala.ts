import { BaseScene } from "@/scenes/BaseScene";

export class Mandala extends Phaser.GameObjects.Container{
    public spin: number = 60;
    public baseScale: number = 1;
    public amplitude: number = 1;
    public phaseTime: number = 1;
    public expandTime: number[] = [100,100];
    public baseAlpha: number;
    public alphaAmp: number;
    public spr: Phaser.GameObjects.Sprite;
    protected phase: number = 0;
    public offset: number = 0;
    public owner: Phaser.GameObjects.Container;
    constructor(scene: BaseScene,x:number,y:number, owner: Phaser.GameObjects.Container, name: string, scale: number, amp: number, phasetime: number, expandtime: number, alpha: number){
        super(scene,x,y);
        this.spr = this.scene.add.sprite(0,0,name);
        this.add(this.spr);
        this.setAlpha(alpha);
        this.setAngle(0);
        this.baseScale = scale;
        this.amplitude = amp;
        this.phaseTime = phasetime*2*Math.PI;
        this.expandTime = [0,expandtime];
        this.owner = owner;
        //this.x = this.owner.x;
        //this.y = this.owner.y;
    }

    update(t: number, d: number){
        //this.x = this.owner.x;
        //this.y = this.owner.y;


        this.spr.setAngle(this.spr.angle+(this.spin*(d/1000)));
        if((this.spr.angle > 360) || (this.spr.angle < -360)){
            this.spr.angle = this.spr.angle%360;
        }
        switch(this.phase){
            case 0: {
                if(this.expandTime[0] < this.expandTime[1]){
                    this.expandTime[0] += d;
                    if(this.expandTime[0] >= this.expandTime[1]){
                        this.expandTime[0] = 0;
                        this.phase = 1;
                        this.spr.setScale(this.baseScale);
                        this.offset = t;
                    } else {
                        this.spr.setScale(this.baseScale*(this.expandTime[0]/this.expandTime[1]));
                    }
                }
                break;
            } case 1: {
                this.spr.setScale(this.baseScale+(this.amplitude*(1+(-1*Math.cos((t-this.offset)/this.phaseTime)))));

                break;
            } case 2:{
                break;
            }
        }
    }
}