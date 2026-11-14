import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";

import { title, version } from "@/version.json";
import { GlobalVariables } from "@/components/GlobalVariables";
import { Effect } from "@/components/Graphics/Effect";
import { BasicEffect } from "@/components/Graphics/BasicEffect";

const creditsLeft = `${title} 

@Handle
@Handle
@Handle`;

const creditsRight = `

role
role
role`;

export class CutsceneScene extends BaseScene {
	public bkg: Phaser.GameObjects.Image;
	public fscreen: Phaser.GameObjects.Rectangle;
	public flashTimer: number[];
	public progressTimer: number[];
	public arrow: Phaser.GameObjects.Image;
	public index: number;
	public end: number;
	public masterData: GlobalVariables;
	public ending: boolean;
	private stageMusic: Phaser.Sound.WebAudioSound;
	private fadeMusic: number[];

	constructor() {
		super({ key: "CutsceneScene" });
		this.masterData = new GlobalVariables();
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.index = 1;
		this.end = 10;
		this.ending = false;
		this.flashTimer = [0,500];
		this.progressTimer = [1000,1000];
		this.fadeMusic = [1000,1000,0,1];

		this.bkg = this.add.image(0,0,"expo_" + this.index);
		this.bkg.setOrigin(0,0);
		this.bkg.setScale(2,2);
		this.fitToScreen(this.bkg);
		this.bkg.setDepth(10);

		this.arrow = this.add.image(1920-100,1080-80,"progressarrow");
		this.arrow.setVisible(false);
		this.arrow.setDepth(15);

		this.fscreen = new Phaser.GameObjects.Rectangle(this,960,540,1960,1120,0x000000,1);
		this.fscreen.setAlpha(0);
		this.fscreen.setOrigin(0.5,0.5);
		this.fscreen.setVisible(false);
		this.add.existing(this.fscreen);
		this.fscreen.setDepth(99);

		this.stageMusic = new Music(this,"m_mystery",{volume:0});
		this.stageMusic.play();

		this.input.addPointer(2);
		let touchId: number = -1;
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			this.next();
		});
		this.musicFade(1000,0,0.4);
	}

	update(time: number, delta: number) {
		if(this.flashTimer[0] > 0){
			this.flashTimer[0] -= delta;
			if(this.flashTimer[0] <= 0){
				this.flashTimer[0] = 0;
				this.fscreen.setAlpha(0);
				this.fscreen.setVisible(false);
			} else {
				this.fscreen.setAlpha(this.flashTimer[0]/this.flashTimer[1]);
			}
		}

		if(this.progressTimer[0] > 0){
			this.progressTimer[0] -= delta;
			if(this.progressTimer[0] <= 0){
				this.progressTimer[0] = 0;
				this.arrow.setVisible(true);
			}
		}

		if(this.progressTimer[0] <= 0){
			if(!this.ending){
				this.arrow.x = (1920-100) + (Math.sin(time/250)*25);
			}
		}

		if(this.fadeMusic[0] < this.fadeMusic[1]){
			this.fadeMusic[0] += delta;
			if(this.fadeMusic[0] >= this.fadeMusic[1]){
				this.stageMusic.setVolume(this.fadeMusic[3]);
				this.fadeMusic = [1000,1000,0,1];
			} else {
				this.stageMusic.setVolume(this.fadeMusic[2] + ((this.fadeMusic[0]/this.fadeMusic[1])*(this.fadeMusic[3]-this.fadeMusic[2])));
			}
		}
	}

	next(){
		if(this.progressTimer[0] <= 0){
			if(this.ending){
				return;
			}
			this.sound.play("scroll", {volume:0.75});
			this.arrow.setVisible(false);
			this.index++;
			if(this.index <= this.end){
				this.startFlash(500);
				this.bkg.setTexture("expo_" + this.index);
				this.progressTimer[0] = this.progressTimer[1];
			} else {
				this.progress();
			}
		}
	}

	startFlash(t: number){
		this.flashTimer = [t,t];
		this.fscreen.setAlpha(1);
		this.fscreen.setVisible(true);
	}

	musicFade(time: number, begin: number, end: number){
		this.fadeMusic = [0,time,begin,end];
	}

	progress() {
		if(this.ending){
			return;
		}
		this.ending = true;
		this.fade(true, 1000, 0x000000);
		this.musicFade(1000,0.4,0);
		this.addEvent(1050, () => {
			this.stageMusic.stop();
			this.scene.start("UpgradeScene", {gameData: this.masterData});
		});
	}

}
