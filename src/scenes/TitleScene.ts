import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";

import { title, version } from "@/version.json";
import { GlobalVariables } from "@/components/GlobalVariables";
import { Effect } from "@/components/Graphics/Effect";
import { BasicEffect } from "@/components/Graphics/BasicEffect";
import { MainSceneButton } from "@/components/Graphics/MainSceneButton";

const creditsLeft = `${title} 

@Handle
@Handle
@Handle`;

const creditsRight = `

role
role
role`;

export class TitleScene extends BaseScene {
	public sky: Phaser.GameObjects.Image;
	public background: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;
	public character: Phaser.GameObjects.Image;


	public a1: Phaser.GameObjects.Image;
	public b1: Phaser.GameObjects.Image;
	public c1: Phaser.GameObjects.Image;
	public tbkg: Phaser.GameObjects.Image;
	public tnum: Phaser.GameObjects.Image;
	public fscreen: Phaser.GameObjects.Rectangle;
	public effectLayer: Phaser.GameObjects.Container;

	public initTimer: number = -20;
	public fTimer: number = -20;
	public initiated: boolean = false;
	public placed: boolean = false;
	public ready: boolean = false;

	public sBtn: MainSceneButton;
	public lBtn: MainSceneButton;

	public ltimer: number[];
	public fx: Effect[];

	public credits: Phaser.GameObjects.Container;
	public title: Phaser.GameObjects.Text;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public masterData: GlobalVariables;

	public isStarting: boolean;

	constructor() {
		super({ key: "TitleScene" });
		this.masterData = new GlobalVariables();
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.ltimer = [0,500];
		this.fx = [];
		this.sky = this.add.image(this.CX, this.CY, "title_sky");
		this.containToScreen(this.sky);
		this.background = this.add.image(
			this.CX,
			0.9 * this.CY,
			"title_background"
		);
		this.containToScreen(this.background);
		this.background.setVisible(false);
		this.foreground = this.add.image(this.CX, this.CY, "title_foreground");
		this.foreground.setVisible(false);
		this.containToScreen(this.foreground);
		this.character = this.add.image(this.CX, this.CY, "turret_image");
		this.containToScreen(this.character);
		this.character.setDepth(7);

		this.a1 = this.add.image(0,650,"alpha");
		this.a1.setOrigin(0,0);
		this.a1.setDepth(5);
		this.a1.setAlpha(0);

		this.b1 = this.add.image(700,0,"beta");
		this.b1.setOrigin(0,0);
		this.b1.setDepth(5);
		this.b1.setAlpha(0);

		this.c1 = this.add.image(0,0,"gamma");
		this.c1.setOrigin(0,0);
		this.c1.setDepth(8);
		this.c1.setVisible(false);

		this.effectLayer = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.effectLayer);
		this.effectLayer.setDepth(9);

		this.tnum = this.add.image(0,0,"bigrig");
		this.tnum.setOrigin(0,0);
		this.tnum.setDepth(10);
		this.tnum.setVisible(false);

		this.tbkg = this.add.image(0,0,"tt1");
		this.tbkg.setOrigin(0,0);
		this.tbkg.setDepth(3);
		this.fitToScreen(this.tbkg);

		this.fscreen = this.add.rectangle((1920/2),(1080/2),1940,1200);
		this.fscreen.setFillStyle(0xFFFFFF);
		this.fscreen.setOrigin(0.5,0.5);
		this.fscreen.setDepth(99);
		this.fscreen.setVisible(false);
		this.add.existing(this.fscreen);

		this.sBtn = new MainSceneButton(this,500,920,"startbtn");
		this.add.existing(this.sBtn);
		this.sBtn.setScale(2.5);
		this.sBtn.setDepth(10);
		this.lBtn = new MainSceneButton(this,1420,920,"loadbtn");
		this.lBtn.setScale(2.5);
		this.add.existing(this.lBtn);
		this.lBtn.setDepth(10);

		this.sBtn.veil();
		this.lBtn.veil();

		this.background.setVisible(false);
		this.background.setDepth(-5);
		this.background.setAlpha(0);
		this.background.y += 4000;
		this.foreground.y += 1000;
		this.character.y += 1000;

		this.title = this.addText({
			x: 0.25 * this.W,
			y: 0.7 * this.H,
			size: 160,
			color: "#000",
			text: "",
		});
		this.title.setOrigin(0.5);
		this.title.setStroke("#FFF", 8);
		this.title.setPadding(2);
		this.title.setVisible(false);
		this.title.setAlpha(0);

		this.subtitle = this.addText({
			x: 0.25 * this.W,
			y: 0.87 * this.H,
			size: 120,
			color: "#000",
			text: "",
		});
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke("#FFF", 3);
		this.subtitle.setPadding(2);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);
		this.subtitle.setDepth(8);
		this.subtitle.setY(-1000);

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 140,
			color: "#000",
			text: "",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 4);
		this.tap.setPadding(2);

		this.version = this.addText({
			x: this.W,
			y: this.H,
			size: 40,
			color: "#000",
			text: version,
		});
		this.version.setOrigin(1, 1);
		this.version.setAlpha(-1);
		this.version.setStroke("#FFF", 4);
		this.version.setPadding(2);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.addText({
			x: 0.65 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsLeft,
		});
		credits1.setStroke("#FFF", 10);
		credits1.setPadding(2);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: 0.85 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsRight,
		});
		credits2.setStroke("#FFF", 10);
		credits2.setPadding(2);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_first", { volume: 0.4 });
			this.musicTitle.on("bar", this.onBar, this);
			this.musicTitle.on("beat", this.onBeat, this);

			// this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
		}
		this.musicTitle.play();

		// Input

		/*
		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.progress, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		*/
		this.sBtn.on("down",()=> {this.newgameAndContinue();})
		this.lBtn.on("down", ()=> {this.loadAndContinue();})

		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.background.visible) {

			this.background.y += 0.02 * (this.CY - this.background.y);
			this.foreground.y += 0.025 * (this.CY - this.foreground.y);
			this.character.y += 0.02 * (this.CY - this.character.y);

			this.background.alpha += 0.03 * (1 - this.background.alpha);
			this.character.scaleX = 1.5*Math.sin((3 * time) / 1000);

			this.title.alpha +=
				0.02 * ((this.title.visible ? 1 : 0) - this.title.alpha);
			this.subtitle.alpha +=
				0.02 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);
			this.version.alpha +=
				0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if(this.subtitle.alpha > 0.5) {
				if(!this.initiated) {
					this.initTimer = 750;
					this.initiated = true;
				}
			}
			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);
			if (this.musicTitle.seek > 0) {
				this.background.setVisible(true);
				this.tap.setVisible(false);
			}
		}

		for(let h = (this.fx.length-1); h >= 0; h--){
			this.fx[h].update(time, delta);
			if(this.fx[h].deleteFlag) {
				this.fx[h].destroy();
				this.fx.splice(h,1);
			}
		}

		if(this.ltimer[0] > 0){
			this.ltimer[0] -= delta;
			if(this.ltimer[0] <= 0){
				if(!this.ready) {
					this.ready = true;
				}
			}
			if((this.ltimer[0] < 250) && (!this.tnum.visible)){
				this.tnum.setVisible(true);
				this.sound.play("meme_explosion", {volume: 0.75});
				this.shake(250);
				this.tbkg.setTexture("tt3");
				let exp = new BasicEffect(this,"meme_exp",this.c1.x+986,this.c1.y+424,18,40,false,0,0,[12,12]);
				this.effectLayer.add(exp);
				this.fx.push(exp);
				this.sBtn.unveil();
				this.lBtn.unveil();
			}
		}

		if(this.tnum.visible){
			this.tnum.x = this.c1.x;
			this.tnum.y = this.c1.y;
		}

		if(this.placed && (this.fTimer > 0)) {
			this.fTimer -= delta;
			if(this.fTimer <= 0) {
				this.fTimer = 0;
				this.fscreen.setAlpha(0);
				this.fscreen.setVisible(false);
				this.ltimer[0] = this.ltimer[1];
			} else {
				this.fscreen.setAlpha(this.fTimer/500);
			}

		}

		if(this.placed) {
			this.c1.y = -30+(30*Math.sin(time/800));
		}

		if(this.initiated && (this.initTimer > 0)) {
			this.initTimer -= delta;

			if(this.initTimer < 200) {
				if(!this.placed) {
					this.placed = true;
					this.fTimer = 500;
					this.fscreen.setVisible(true);
					this.c1.setVisible(true);
					this.tbkg.setTexture("tt2");
					this.subtitle.setY(0.87 * this.H);
					this.musicTitle.stop();
					this.musicTitle = new Music(this, "m_od", { volume: 0.2 });
					this.musicTitle.play();
					this.musicTitle.seek = (846621/44100);
				}
			}

			if(this.initTimer <= 0){
				this.initTimer = 0;
				this.a1.y = 0;
				this.b1.x = 0;
				this.a1.setAlpha(1);
				this.b1.setAlpha(1);
			} else {
				this.a1.y=650*(this.initTimer/750);
				this.b1.x=700*(this.initTimer/750);
				this.a1.setAlpha(1-(this.initTimer/750));
				this.b1.setAlpha(1-(this.initTimer/750));
			}

		}

		this.subtitle.setScale(1 + 0.02 * Math.sin((5 * time) / 1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
		}
	}

	loadAndContinue(){
		if(!this.ready){
			return;
		}
		if(!this.isStarting){
			this.masterData.loadGame();
			this.progress();
		}
	}

	newgameAndContinue(){
		if(!this.ready){
			console.log("not ready");
			return;
		}
		if(!this.isStarting){
			console.log("starting game");
			this.masterData.newGame();
			this.progress();
		}
	}

	progress() {
		if(!this.ready) {
			return;
		}
		if (!this.background.visible) {
			this.onBar(1);
		} else if (!this.subtitle.visible) {
			this.title.setVisible(true);
			this.title.setAlpha(1);
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		} else if (!this.isStarting) {
			this.sound.play("vineboom", { volume: 0.4 });
			// this.sound.play("m_slice", { volume: 0.3 });
			// this.sound.play("u_attack_button", { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
//					this.masterData.saveGame();
//					this.masterData.loadGame();
					this.musicTitle.stop();
					this.scene.start("CutsceneScene", {gameData: this.masterData});
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar >= 2) {
			this.title.setVisible(true);
		}
		if (bar >= 4) {
			this.subtitle.setVisible(true);
			this.credits.setVisible(true);
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}
