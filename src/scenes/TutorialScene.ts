import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";
import { GlobalVariables } from "@/components/GlobalVariables";
import { MainSceneButton } from "@/components/Graphics/MainSceneButton";

export class TutorialScene extends BaseScene {
	public bkg: Phaser.GameObjects.Image;
    public dlg: Phaser.GameObjects.Image;

    public skipbt: MainSceneButton;
    public playbt: MainSceneButton;

	public fscreen: Phaser.GameObjects.Rectangle;
	public flashTimer: number[];
	public progressTimer: number[];
    public initTimer: number[];
	public arrow: Phaser.GameObjects.Image;
	public index: number;
    public endIndex: number;
	public masterData: GlobalVariables;
	public ending: boolean;
    public selected: boolean;
	private stageMusic: Phaser.Sound.WebAudioSound;
	private fadeMusic: number[];

    private initialized: boolean;

	constructor() {
		super({ key: "TutorialScene" });
	}

    init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.index = 0;
        this.endIndex = 13;
		this.ending = false;
        this.selected = false;
		this.flashTimer = [0,500];
		this.progressTimer = [0,1000];
		this.initTimer = [1000,1000];
		this.fadeMusic = [1000,1000,0,1];

		this.bkg = this.add.image(0,0,"tu_0_0");
		this.bkg.setOrigin(0,0);
		this.bkg.setScale(2,2);
		this.fitToScreen(this.bkg);
		this.bkg.setDepth(10);

        this.dlg = this.add.image(0,0,"tu_d1");
		this.dlg.setOrigin(0,0);
		this.dlg.setScale(2,2);
		this.fitToScreen(this.dlg);
		this.dlg.setDepth(11);
        this.dlg.setVisible(false);

        this.initialized = false;

		this.skipbt = new MainSceneButton(this,500,820,"skipt");
		this.add.existing(this.skipbt);
		this.skipbt.setScale(2);
		this.skipbt.setDepth(12);
		this.playbt = new MainSceneButton(this,1420,820,"playt");
		this.playbt.setScale(2);
		this.add.existing(this.playbt);
		this.playbt.setDepth(12);

		this.skipbt.veil();
		this.playbt.veil();
        this.skipbt.setVisible(true);
        this.playbt.setVisible(true);

		this.arrow = this.add.image(1920-100,1080-80,"progressarrow");
		this.arrow.setVisible(false);
		this.arrow.setDepth(15);

		this.fscreen = new Phaser.GameObjects.Rectangle(this,960,540,1960,1120,0x000000,1);
		this.fscreen.setAlpha(0);
		this.fscreen.setOrigin(0.5,0.5);
		this.fscreen.setVisible(false);
		this.add.existing(this.fscreen);
		this.fscreen.setDepth(99);

		this.stageMusic = new Music(this,"m_tutorial",{volume:0});
		this.stageMusic.play();

		this.skipbt.on("down",()=> {this.skip();})
		this.playbt.on("down", ()=> {this.play();})

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

        if(this.initTimer[0] > 0){
			this.initTimer[0] -= delta;
			if(this.initTimer[0] <= 0){
                this.skipbt.unveil();
                this.playbt.unveil();
			}
		}

		if(this.progressTimer[0] > 0){
			this.progressTimer[0] -= delta;
			if(this.progressTimer[0] <= 0){
                if(!this.initialized){
                    this.initialized = true;
                }
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
        if(!this.initialized){
            return;
        }
		if(this.progressTimer[0] <= 0){
			if(this.ending){
				return;
			}
			this.nextImage();
		}
	}

    skip(){
        if(!this.selected){
            this.selected = true;
            this.sound.play("scroll", {volume:0.75});
            this.bkg.setTexture("tu_0_2");
            this.progressTimer = [1000,1000];
            this.endIndex = 1;
            this.index = 1;
            this.startFlash(500);
            this.skipbt.lock();
            this.playbt.lock();
            this.skipbt.setVisible(false);
            this.playbt.setVisible(false);
        }
    }

    play(){
        if(!this.selected){
            this.selected = true;
            this.sound.play("scroll", {volume:0.75});
            this.bkg.setTexture("tu_0_1");
            this.progressTimer = [1000,1000];
            this.index = 2;
            this.startFlash(500);
            this.skipbt.lock();
            this.playbt.lock();
            this.skipbt.setVisible(false);
            this.playbt.setVisible(false);
        }
    }

    nextImage(){
        this.index++;
        if(this.index >= this.endIndex){
            this.index = this.endIndex;
            if(!this.ending){
                this.sound.play("scroll", {volume:0.75});
                this.arrow.setVisible(false);
                this.progress();
            }
            return;
        }
        switch(this.index){
            case 3: {
                this.bkg.setTexture("tu_1");
                this.progressTimer = [1000,1000];
                break;
            } case 4: {
                this.bkg.setTexture("tu_2");
                this.dlg.setVisible(true);
                this.progressTimer = [1000,1000];
                break;
            } case 5: {
                this.dlg.setTexture("tu_d2");
                this.progressTimer = [1000,1000];
                break;
            } case 6: {
                this.dlg.setTexture("tu_d3");
                this.progressTimer = [1000,1000];
                break;
            } case 7: {
                this.bkg.setTexture("tu_3");
                this.dlg.setTexture("tu_d4");
                this.progressTimer = [1000,1000];
                break;
            } case 8:{
                this.dlg.setTexture("tu_d5");
                this.progressTimer = [1000,1000];
                break;
            } case 9:{
                this.dlg.setTexture("tu_d6");
                this.progressTimer = [1000,1000];
                break;
            } case 10:{
                this.bkg.setTexture("tu_4");
                this.dlg.setTexture("tu_d7");
                this.progressTimer = [1000,1000];
                break;
            } case 11:{
                this.dlg.setTexture("tu_d8");
                this.progressTimer = [1000,1000];
                break;
            } case 12:{
                this.dlg.setTexture("tu_d9");
                this.progressTimer = [1000,1000];
                break;
            } default: {
                break;
            }
        }
        this.sound.play("scroll", {volume:0.75});
        this.arrow.setVisible(false);
        this.startFlash(500);
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
