import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";
import { ShieldSource } from "../Player";


export class ShieldDisplay extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public tAmount: number = 0;
    public stored: number[] = [0,0];
    public owner: Player;
    public bars: Phaser.GameObjects.Rectangle[];
    constructor(scene: GameScene, x: number, y: number, o: Player){
        super(scene,x,y);
        this.scene = scene;
        this.owner = o;
        this.bars = [];
    }

    draw(){
        this.gatherShields();
        let ps = this.owner.pShield[0];
        let rr = this.tAmount + ps;
        if((ps == this.stored[0]) && (this.tAmount == this.stored[1])){
            return;
        } else {
            this.stored[0] = ps;
            this.stored[1] = this.tAmount;
            this.bars.forEach((b) => {
                b.destroy();
            });
            this.bars = [];
        }
        let nl = 168;
        if((rr) < this.owner.maxHP){
            let tsd = this.scene.add.rectangle(-128,nl,256,32,0x00C3FF,1);
            tsd.setScale(rr/this.owner.maxHP, 1);
            tsd.setOrigin(0,0);
            this.add(tsd);
            this.bars.push(tsd);
        } else {
            let xi = Math.trunc(rr/this.owner.maxHP);
            //draw first set
            let tsd = this.scene.add.rectangle(-128,nl,256,32,0x00C3FF,1);
            tsd.setScale(1,1);
            tsd.setOrigin(0,0);
            this.add(tsd);
            this.bars.push(tsd);
            rr -= this.owner.maxHP;
            for(let ni = 1; ni <= xi; ni++){
                tsd = this.scene.add.rectangle(-128,nl+(40*ni),256,32,0x00C3FF,1);
                if(rr < this.owner.maxHP){
                    tsd.setScale(rr/this.owner.maxHP, 1);
                } else {
                    tsd.setScale(1,1);
                }
                tsd.setOrigin(0,0);
                this.add(tsd);
                this.bars.push(tsd);
                rr -= this.owner.maxHP;
            }
        }
        if(ps > 0){
            let bsd = this.scene.add.rectangle(-128,nl,256,32,0x00FFD9,1);
            bsd.setScale(ps/this.owner.maxHP, 1);
            bsd.setOrigin(0,0);
            this.add(bsd);
            this.bars.push(bsd);
        }

    }

    gatherShields(){
        this.tAmount = 0;
        if(this.owner.tShields.length > 0){
            this.owner.tShields.forEach((st) => {
                if(st.amount > 0){
                    this.tAmount += st.amount;
                }
            });
        } else {
            this.tAmount = 0;
        }

    }
}