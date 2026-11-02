import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { Item } from "./Item";
import { SimpleCDItem } from "./SimpleCDItem";
import { StatItem } from "./StatItem";
import { KoboldMiniNova } from "./KoboldMiniNova";
import { UltrasonicBarrier } from "./UltrasonicBarrier";
import { Fireball } from "./Fireball";
import { Echolocator } from "./Echolocator";
import { ArrowRaid } from "./ArrowRaid";
import { StarPrism } from "./StarPrism";

export class ItemTile extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public tile: Phaser.GameObjects.Sprite;
    public icon: Phaser.GameObjects.Sprite;
    public overlay: Phaser.GameObjects.Rectangle;
    public txt: Phaser.GameObjects.Text;
    public lv: Phaser.GameObjects.Text;
    public ref: Item | null;
    constructor(scene: GameScene, x: number, y: number, ref: Item | null = null){
        super(scene,x,y);
        this.scene = scene;
        this.tile = this.scene.add.sprite(0,0,"itemtile");
        this.tile.setScale(0.5);

        this.icon = this.scene.add.sprite(0,0,"itemtile");
        this.icon.setScale(0.5);

        this.overlay = this.scene.add.rectangle(0,70,140,140,0x000000,0.6);
        this.overlay.setOrigin(0.5,1);

        this.overlay.setVisible(false);

        this.txt = this.scene.addText({
			x: -65,
			y: -65,
			size: 20,
			color: "white",
			text: "",
		});

        this.lv = this.scene.addText({
			x: -65,
			y: 42,
			size: 22,
			color: "cyan",
			text: "",
		});

        this.add(this.tile);
        this.add(this.icon);
        this.add(this.overlay);
        this.add(this.txt);
        this.add(this.lv);

        this.ref = ref;
    }

    setItem(i: Item){
        this.ref = i;
    }

    setTile(st: string){
        this.tile.setTexture(st);
    }

    setIcon(st: string){
        this.icon.setTexture(st);
    }

    update(){
        if(this.ref != null){
            this.lv.setText("Lv." + this.ref.level);
            if(!(this.ref instanceof StatItem)){
                if((!(this.ref instanceof KoboldMiniNova)) && (!(this.ref instanceof UltrasonicBarrier))){
                    if((!(this.ref instanceof Fireball)) && (!(this.ref instanceof Echolocator))){
                        if(this.ref instanceof ArrowRaid){
                            this.txt.setText(Math.trunc(this.ref.dist) + " / " + this.ref.maxDist);
                            if(this.ref.dist > 0){
                                this.overlay.setVisible(true);
                                this.overlay.setScale(1,this.ref.dist/this.ref.maxDist);
                                this.tile.setAlpha(0.5);
                                this.icon.setAlpha(0.5);
                            } else {
                                this.overlay.setVisible(false);
                                this.overlay.setScale(1,1);
                                this.tile.setAlpha(1);
                                this.icon.setAlpha(1);
                            }
                        } else{
                            if(this.ref instanceof StarPrism){
                                this.txt.setText(this.ref.shots + " / " + this.ref.maxShots);
                            }
                            if(this.ref.cooldown > 0){
                                this.overlay.setVisible(true);
                                this.overlay.setScale(1,this.ref.cooldown/this.ref.maxCD);
                                this.tile.setAlpha(0.5);
                                this.icon.setAlpha(0.5);
                            } else {
                                this.overlay.setVisible(false);
                                this.overlay.setScale(1,1);
                                this.tile.setAlpha(1);
                                this.icon.setAlpha(1);
                            }
                        }
                    }
                }
            } else if (this.ref instanceof StatItem){
                if(this.ref.key == "Phoenix's Tail"){
                    this.txt.setText("x " + (this.scene.player.lives - this.scene.player.baseLives));
                }
            }

        } else {
            this.overlay.setVisible(false);
            this.overlay.setScale(1,1);
            this.tile.setAlpha(1);
            this.icon.setAlpha(1);
        }
    }
}