import { LootScene } from "@/scenes/LootScene";
import { AugmentButton } from "../AugmentButton";
import { Augment } from "./Weapon";
import { Button } from "./Button";

export class AugmentDisplayBar extends Button{
    public scene: LootScene;
    public augbutton: AugmentButton;
    public ref: Augment;
    public bars: Phaser.GameObjects.Sprite[];
    private st: number = -268;
    private ofs: number = 52;
    private index: number = 0;
    private back: Phaser.GameObjects.Sprite;
    private over: Phaser.GameObjects.Sprite;
    private img: Phaser.GameObjects.Image;
    constructor(scene:LootScene, x:number,y:number, aug: Augment, index: number = 0){
        super(scene,x,y);
        this.index = index;
        this.scene = scene;
        this.ref = aug;

        this.back = this.scene.add.sprite(this.st-72,0,"aug_button_back");
        this.over = this.scene.add.sprite(this.st-72,0,"aug_button_frame");
        this.img = this.scene.add.image(this.st-72,0,"aug_"+this.ref.index);
        if(this.ref.index == 0){
            this.over.setFrame(1);
        }
        this.add(this.back);
        this.add(this.over);
        this.add(this.img);
        this.bars = [];
        this.fillBar();
        this.scene.add.existing(this);
    }

    activate(){
        
    }

    set(a: Augment){
        this.ref = a;
        this.redraw();
    }

    fillBar(){
        if(this.bars.length > 0) {
            console.log("Attempted to fill already initialized augment bar.");
            return;
        }
        for(let i = 0; i < this.ref.lvcap; i++){
            if(i < 10){ //push a bar if less than the cap
                this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug"));
            } else {
                this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug_extra"));
            }

            if(i < this.ref.level) {
                this.bars[i].setFrame(1)
            } else if (i < this.ref.maxlv) {
                this.bars[i].setFrame(0);
            } else {
                this.bars[i].setFrame(2);
            }
            this.add(this.bars[i]);
        }
    }

    relightBars(){
        for(let i = 0; i < this.bars.length; i++) {
            if(i < this.ref.level) {
                this.bars[i].setFrame(1)
            } else if (i < this.ref.maxlv) {
                this.bars[i].setFrame(0);
            } else {
                this.bars[i].setFrame(2);
            }
        }
    }

    redraw(){
        this.bars = [];
        for(let i = 0; i < this.ref.lvcap; i++){
            if(i >= this.bars.length) { //if we didn't already print a bar, do so now
                if(i < 10){
                    this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug"));
                } else {
                    this.bars.push(new Phaser.GameObjects.Sprite(this.scene, this.st+(this.ofs*i),0,"aug_extra"));
                }
            }            
            if(i < this.ref.level) {
                this.bars[i].setFrame(1)
            } else if (i < this.ref.maxlv) {
                this.bars[i].setFrame(0);
            } else {
                this.bars[i].setFrame(2);
            }

            
        }
    }
}