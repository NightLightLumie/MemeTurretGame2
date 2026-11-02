import { GameScene } from "@/scenes/GameScene";
import { Button } from "../WeaponFunctions/Button";
import { ItemShop } from "./ItemShop";
import { ArcaneMissile } from "./Items/ArcaneMissile";
import { ArrowRaid } from "./Items/ArrowRaid";
import { BasicAttackMagic } from "./Items/BasicAttackMagic";
import { CementEater } from "./Items/CementEater";
import { DanmakuCharm } from "./Items/DanmakuCharm";
import { Echolocator } from "./Items/Echolocator";
import { Fireball } from "./Items/Fireball";
import { GunFu } from "./Items/GunFu";
import { KoboldMiniNova } from "./Items/KoboldMiniNova";
import { LavaBucket } from "./Items/LavaBucket";
import { ReactiveBarrier } from "./Items/ReactiveBarrier";
import { RuneCircle } from "./Items/RuneCircle";
import { StarPrism } from "./Items/StarPrism";
import { UltrasonicBarrier } from "./Items/UltrasonicBarrier";
import { SimpleCDItem } from "./Items/SimpleCDItem";
import { StatItem } from "./Items/StatItem";

export class ItemButton extends Button {
    public scene: GameScene;
    public hl: Phaser.GameObjects.Sprite;
    public bkg: Phaser.GameObjects.Sprite;
    public over: Phaser.GameObjects.Sprite;
    private txt: string;
    private mode: string;
    private myShop: ItemShop;
    public hardlock: boolean;
    private key: string;
    constructor(scene:GameScene,x:number,y:number, owner: ItemShop){
        super(scene,x,y);
        this.scene = scene;
        this.myShop = owner;
        this.hl = this.scene.add.sprite(0,0,"item_highlight");
        this.hl.setOrigin(0.5,0.5);
        this.add(this.hl);
        this.hl.setVisible(false);

        this.bkg = this.scene.add.sprite(0,0,"itemtile");
        this.bkg.setOrigin(0.5,0.5);
        this.add(this.bkg);
        this.over = this.scene.add.sprite(0,0,"itemtile");
        this.over.setOrigin(0.5,0.5);
        this.add(this.over);
        this.setScale(0.6);
        this.mode = "default";
        this.key = "default";
        this.txt = "";
        this.bindInteractive(this.bkg);
        this.bkg.disableInteractive();
        this.hardlock = true;
    }

    onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.hardlock){
            return;
        }
        this.hl.setVisible(true);
        this.setScale(0.8);
        this.myShop.setTitle(this.key);
        this.myShop.setDesc(this.txt);
        this.scene.sound.play("itemhover", {volume: 0.75});
    }

    onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData): void {
        if(this.hardlock){
            return;
        }
        this.hl.setVisible(false);
        this.setScale(0.6);
        this.myShop.setTitle("Welcome to the Shop!");
        this.myShop.setDesc("");
    }

    onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData): void {
        if(this.hardlock){
            return;
        }
        this.deactivate();
        this.processItem();
        this.scene.player.redrawItems();
        this.myShop.lockRemainingButtons();
        this.scene.sound.play("buyitem", {volume: 0.5});
        this.myShop.startFade();
    }

    activate(){
        this.bkg.setInteractive();
    }

    deactivate(){
        this.hardlock = true;
        this.bkg.removeInteractive();
    }

    processItem(){
        if(this.mode == "upgrade") {
            let cx = this.scene.player.findItem(this.key);
            if(!(cx.key == "default")){
                cx.levelUp();
            } else {
                console.log("Tried to upgrade item not present in inventory.");
            }
            return;
        } else if (this.mode == "buy"){
            let ee = this.scene.masterData.getInfiniteItems();
            if(ee.includes(this.key)){
                switch(this.key){
                    case "Spinach": {
                        this.scene.player.upgradeHP(0.05);
                        break;
                    } case "Hi-Power Rounds": {
                        this.scene.player.bonusGunDamage += 0.05;
                        break;
                    } case "Huge Rod": {
                        this.scene.player.bonusSpellDamage += 0.1;
                        break;
                    } default: {
                        console.log ("Idiot programmer forgot to add functionality for this item: "+ this.key);
                        break;
                    }
                }
                return;
            } else {
                let slot = this.scene.player.items.length;
                if(slot >= 8){
                    console.log("Tried to buy items over max.");
                    return;
                }
                switch(this.key){
                    case "Arcane Missile": {
                        this.scene.player.items.push(new ArcaneMissile(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Arrow Raid": {
                        this.scene.player.items.push(new ArrowRaid(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Basic Attack Magic": {
                        this.scene.player.items.push(new BasicAttackMagic(this.scene,this.scene.player,this.key,slot));
                        break;;
                    } case "Eat Cement": {
                        this.scene.player.items.push(new CementEater(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Danmaku Charm": {
                        this.scene.player.items.push(new DanmakuCharm(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Echolocator": {
                        this.scene.player.items.push(new Echolocator(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Explosive Magazine": {
                        this.scene.player.items.push(new Fireball(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Gun-Fu": {
                        this.scene.player.items.push(new GunFu(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Kobold Mini-Nova": {
                        this.scene.player.items.push(new KoboldMiniNova(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Lava Bucket": {
                        this.scene.player.items.push(new LavaBucket(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Reactive Barrier": {
                        this.scene.player.items.push(new ReactiveBarrier(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Rune Circle": {
                        this.scene.player.items.push(new RuneCircle(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Prism of Stars": {
                        this.scene.player.items.push(new StarPrism(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Ultrasonic Shield": {
                        this.scene.player.items.push(new UltrasonicBarrier(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Cancel Death": {} case "Focus Sash": {} case "Mandrake": {
                        this.scene.player.items.push(new SimpleCDItem(this.scene,this.scene.player,this.key,slot));
                        break;
                    } case "Yin-Yang Orb": {} case "Zoomies": {} case "Fortify": {}
                    case "Light Dragon's Blessing": {} case "Vaccine": {} case "Disproportionation": {}
                    case "Void Dragon's Blessing": {} case "Ultravibration": {} case "Sticky Bomb": {}
                    case "Cast Gun": {} case "Phoenix's Tail": {} case "Binding Shots": {
                        this.scene.player.items.push(new StatItem(this.scene,this.scene.player,this.key,slot));
                        break;
                    } default: {
                        console.log("Tried to add item which does not exist: " + this.key);
                        break;
                    }
                }
                return;
            }
        }
    }

    loadItem(key: string, owned: boolean){
        let rs = this.scene.masterData.getItemParams(key);
        if(rs.name == "default"){
            console.log("Loaded invalid item: ''" + key + "'' to shop.");
            return;
        } else {
            if(owned){
                this.mode = "upgrade";
                this.txt = rs.upgradeDesc;
                let ref = this.scene.player.findItem(key)
                if(ref.key != "default"){
                    this.txt += ("  (Lv." + ref.level + " -> Lv." + (ref.level+1) + ")");
                }
            } else {
                this.mode = "buy";
                this.txt = rs.desc;
            }
            this.bkg.setTexture(rs.spr[0]);
            this.over.setTexture(rs.spr[1]);
            this.bkg.setInteractive();
            this.hardlock = false;
            this.key = key;
        }

    }
}