import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";
import { Bullet } from "@/components/WeaponFunctions/Bullet";
import { LineSegment } from "@/components/WeaponFunctions/LineSegment";
import { Effect } from "@/components/Effect";
import { Target } from "@/components/Target";
import { Thug } from "@/components/Thug";
import { WeaponOperator } from "@/components/WeaponFunctions/WeaponOperator";
import { GunUI } from "@/components/WeaponFunctions/GunUI";
import { GlobalVariables } from "@/components/GlobalVariables";
import { Tracer } from "@/components/WeaponFunctions/Tracer";
import { DotTracker } from "@/components/DotTracker";
import { TileChecker } from "@/components/TileChecker";
import { LevelParser } from "@/components/GameFunctions/LevelParser";
import { Levels } from "@/components/GameFunctions/Levels";
import { Music } from "@/components/Music";
import { MusicKey } from "@/components/MusicData";
import { NextSceneButton } from "@/components/GameFunctions/NextSceneButton";
import { EnemyBullet } from "@/components/EnemyBullet";
import { Ufo } from "@/components/Enemies/Ufo";
import { Missile } from "@/components/WeaponFunctions/Missile";

export class GameScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private endScreen: Phaser.GameObjects.Image;
	public player: Player;
	private ui: UI;

	private pID: number = -999999999;
	private tID: number = -999999999;
	private tyText:Phaser.GameObjects.Text;

	private UI: Phaser.GameObjects.Container;
	private pDisp: Phaser.GameObjects.Container;
	private ebDisp: Phaser.GameObjects.Container;
	private bDisp: Phaser.GameObjects.Container;
	private tDisp: Phaser.GameObjects.Container;
	private ftDisp: Phaser.GameObjects.Container;
	private eDisp: Phaser.GameObjects.Container;
	private fDisp: Phaser.GameObjects.Container;

	private dotter: Phaser.GameObjects.Graphics;

	private tracers: Phaser.GameObjects.Container;

	public handler: WeaponOperator;

	private bList: Bullet[];
	private eBulletList: EnemyBullet[];
	private tList: Target[];
	private playerEffects: Effect[];
	private playerProjectiles: Missile[];
	private hitEffects: Effect[];
	private partEffects: Effect[];
	private tracerList: Tracer[];

	public cLevel: Levels;

	private dotList: DotTracker[];

	private gUI: GunUI;

	private sCD: number = 500;
	public masterData: GlobalVariables;

	public tracing: boolean = false;
	private boundary: [number,number,number,number] = [-5000,5000,-5000,5000];
	private division: [number,number] = [250,250];
	private chunks: TileChecker;
	private paused: boolean = false;
	private upgrading: boolean = false;
	private dead: boolean = false;
	private stageMusic: Phaser.Sound.WebAudioSound;
	private dTimer: number[] = [250,250];
	private eTimer: number[] = [1000,1000];
	private ended: boolean = false;
	private zoom: number[] = [0.5,0.5];
	public enemyCap: number = 500;

	private nextButton: NextSceneButton;

	private ls: LineSegment;

	constructor() {
		super({ key: "GameScene" });
	}


	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.resetVariables();
		this.stageMusic = new Music(this,"m_lv1",{volume:0.4});
		this.stageMusic.play();
		this.background = this.add.image(0, 0, "tempbkg");
		this.background.setOrigin(0.5,0.5);
		this.background.setScale(4);
		this.background.setDepth(-10);

		this.endScreen = this.add.image(0, 0, "rip");
		this.endScreen.setOrigin(0.5,0.5);
		this.endScreen.setScale(2);
		this.endScreen.setDepth(100);
		this.endScreen.setAlpha(0);

		this.cameras.main.setBounds(-5000,-5000,10000,10000);
		this.cameras.main.setZoom(this.zoom[0],this.zoom[1]);
		this.chunks = new TileChecker([-6200,6200], [-6200,6200],[250,250]);


		this.tyText = this.addText({
			x: 0,
			y: -160,
			size: 40,
			color: "#FFFFFF",
			text: "",
		});
		this.tyText.setOrigin(0.5,0.5);
		//this.tyText.setScrollFactor(0);

		//MUST BE IN THIS ORDER
		this.player = new Player(this, this.CX, this.CY);
		this.handler = new WeaponOperator(this.player);
		this.player.setDefaultLoadout();
		this.gUI = new GunUI(this,this.player.x,this.player.y, [-1358, -860]);
		this.gUI.setScale(1.5);
		this.add.existing(this.gUI);
		this.gUI.setDepth(20);


		this.player.setDepth(10);
		this.player.on("action", () => {
			this.player.doABarrelRoll();
		});
		this.cameras.main.startFollow(this.player);

		//arrays
		this.bList = [];
		this.eBulletList = [];
		this.tList = [];
		this.playerProjectiles = [];
		this.hitEffects = [];
		this.partEffects = [];
		this.playerEffects = [];

		this.dotList = [];
		this.tracerList = [];





		this.UI = new Phaser.GameObjects.Container(this,0,0); // display layer for UI
		this.add.existing(this.UI);
		this.UI.setDepth(16);

		this.ebDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for enemy bullets
		this.add.existing(this.ebDisp);
		this.ebDisp.setDepth(14);

		this.pDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for player
		this.add.existing(this.pDisp);
		this.pDisp.setDepth(12);

		this.eDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for effects
		this.add.existing(this.eDisp);
		this.eDisp.setDepth(10);

		this.bDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for bullets
		this.add.existing(this.bDisp);
		this.bDisp.setDepth(9);

		this.ftDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for flying enemies
		this.add.existing(this.ftDisp);
		this.ftDisp.setDepth(8);

		this.tDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for enemies
		this.add.existing(this.tDisp);
		this.tDisp.setDepth(7);

		this.fDisp = new Phaser.GameObjects.Container(this,0,0); // display layer for enemy fragments
		this.add.existing(this.fDisp);
		this.fDisp.setDepth(6);

		this.initiateTestObjects();


		/*
		this.dotter.beginPath();
		this.dotter.slice(0,0,10,0,360,false,0.005);
		this.dotter.closePath();
		this.dotter.fillPath();
		*/
		this.ui = new UI(this);

		this.initTouchControls();
		this.cLevel = new Levels(this);
		this.cLevel.load(0);

		this.nextButton = new NextSceneButton(this,0,0);
		this.nextButton.setScale(2,2);
		this.nextButton.setDepth(300);
		this.nextButton.hide();

	}

	resetVariables(){
		this.paused = false;
		this.dead = false;
		this.eTimer = [1000,1000];
		this.zoom = [0.5,0.5];
		this.enemyCap = 500;
	}

	initiateTestObjects(){

		this.ls = new LineSegment(this,9989,9988,9999,9998);
		this.ls.setDepth(14);

		this.tracers = new Phaser.GameObjects.Container(this,0,0);
		this.add.existing(this.tracers);
		this.tracers.setDepth(11);

		this.dotter = this.add.graphics();
		this.dotter.fillStyle(0xFF8080,0.85);
		this.add.existing(this.dotter);
		this.dotter.setDepth(15);
		/*
		let ttt = new Thug(this,-800,600);
		this.tDisp.add(ttt);
		this.tList.push(ttt);

		let ttn = new Thug(this,1000,1000);
		this.tDisp.add(ttn);
		this.tList.push(ttn);
		*/
	}

	die(){
		this.dead = true;
		this.paused = true;
		this.endScreen.setPosition(this.player.x,this.player.y);
		this.sound.play("turret_dead", {volume: 0.5});
		this.swapMusic("m_gameover");
		this.sound.play("darksouls", {volume:0.5});
		this.nextButton.setPosition(this.player.x, this.player.y + 600);
		this.nextButton.veil();
	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		const worldX = this.cameras.main.getWorldPoint(pointer.x, pointer.y).x;
 		const worldY = this.cameras.main.getWorldPoint(pointer.x, pointer.y).y;
		if(this.dead){
			if(this.eTimer[0] > 0){
				this.eTimer[0] -= delta;
				if(this.eTimer[0] <= 0){
					this.eTimer[0] = 0;
					this.endScreen.setAlpha(1);
					this.nextButton.unveil();
				} else {
					this.endScreen.setAlpha(1-(this.eTimer[0]/this.eTimer[1]));
				}
			}
		}
		if(!this.paused){
			//this.tyText.setPosition(worldX,worldY+80);
			//this.tyText.setText("Pointer: " + worldX + ", " + worldY);
			this.player.update(time, delta);
			this.ls.hitCheck(this.player);
			this.ls.update(time,delta);
			this.cLevel.update(time,delta);
			this.updateTargets(time,delta);
			this.updateBullets(time,delta);
			this.updateEffects(time,delta);
			this.unstackEnemies();
			this.gUI.update(time,delta);
			this.sounds = [];
		}
	}

	spawnEnemies(num:number = 2, cmd:string = "x", etype:string = "thug", difficulty:number = 0): boolean{
		if(this.tList.length > this.enemyCap) {
			//console.log("LEN: " + this.tList.length);
			//this.sCD = 500;
			return false;
		} else {
			for(let nm = 0; nm < num; nm++){
				this.createEnemyFromList(cmd, etype,difficulty);
			}
			return true;
		}
	}

	createEnemyFromList(cmd: string, etype: string = "thug", difficulty: number = 0){
		let aa = 0;
		let rx = 0;
		let xx = 0;
		let yy = 0;
		switch(cmd){
			case "x": {
				rx = Math.random();
				if (rx < 0.5) {
					rx = -1;
				} else {
					rx = 1;
				}
				xx = rx*4500;
				yy = -3000+(Math.random()*6000);
				break;
			} case "xx": {
				rx = Math.random();
				if (rx < 0.5) {
					rx = -1;
				} else {
					rx = 1;
				}
				xx = this.player.x+(rx*2420);
				yy = this.player.y+(-1580+(Math.random()*3160));
				break;
			} case "r": {
				aa = Math.random()*2*Math.PI;
				xx = Math.cos(aa)*4542;
				yy = Math.sin(aa)*4542;
				break;
			}
		}

		switch(etype){
			case "thug": {
				let tn = new Thug(this, xx, yy, cmd);
				this.tDisp.add(tn);
				this.tList.push(tn);
				break;
			} case "ufo": {
				let tu = new Ufo(this,xx,yy);
				this.ftDisp.add(tu);
				this.tList.push(tu);
				break;
			} default: {
				break;
			}
		}
	}

	checkEnemies(): boolean{
		if(this.tList.length <= 0){
			return true;
		} else {
			return false;
		}
	}

	refreshGUI(){
		this.gUI.refresh();
	}

	updateTargets(t:number,d:number){
		this.chunks.clear();
		for(let i = (this.tList.length-1); i >= 0; i--){
			this.tList[i].update(t, d);
			if(this.tList[i].deleteFlag){
				this.tList[i].destroy();
				this.tList.splice(i,1);
			} else {
				this.tList[i].mychunk = [Math.trunc(this.tList[i].x/this.chunks.divider[0]), Math.trunc(this.tList[i].y/this.chunks.divider[1])];
				this.chunks.index(this.tList[i]);
			}
		}
	}

	updateEffects(t: number, d: number){
		for(let h = (this.hitEffects.length-1); h >= 0; h--){
			this.hitEffects[h].update(t, d);
			if(this.hitEffects[h].deleteFlag) {
				this.hitEffects[h].destroy();
				this.hitEffects.splice(h,1);
			}
		}

		for(let pl = (this.playerEffects.length-1); pl >= 0; pl--){
			this.playerEffects[pl].update(t, d);
			if(this.playerEffects[pl].deleteFlag) {
				this.playerEffects[pl].destroy();
				this.playerEffects.splice(pl,1);
			}
		}

		for(let f = (this.partEffects.length-1); f >= 0; f--){
			this.partEffects[f].update(t, d);
			if(this.partEffects[f].deleteFlag) {
				this.partEffects[f].destroy();
				this.partEffects.splice(f,1);
			}
		}

		for(let l = (this.tracerList.length-1); l >= 0; l--){
			this.tracerList[l].hitCheckT(this.tList[0]);
			this.tracerList[l].update(t, d);
		}

	}

	updateBullets(t:number,d:number){
		for(let i = (this.bList.length-1); i >= 0; i--){

			this.bList[i].updatePos(t,d);
			for(let e = this.tList.length-1; e >= 0; e--) {
				this.bList[i].hitCheck(this.tList[e]);
			}
			this.bList[i].updateGFX(t,d);

			if(this.bList[i].deleteFlag){
				this.bList[i].destroy();
				this.bList.splice(i,1);
			}
		}

		for(let pp = (this.playerProjectiles.length-1); pp >= 0; pp--){

			this.playerProjectiles[pp].update(t,d);
			for(let ex = this.tList.length-1; ex >= 0; ex--) {
				this.playerProjectiles[pp].hitCheck(this.tList[ex]);
			}
			if(this.playerProjectiles[pp].deleteFlag){
				this.playerProjectiles[pp].destroy();
				this.playerProjectiles.splice(pp,1);
			}
		}

		for(let ie = (this.eBulletList.length-1); ie >= 0; ie--){
			this.eBulletList[ie].update(t,d);
			this.eBulletList[ie].hitCheck();
			if(this.eBulletList[ie].deleteFlag){
				this.eBulletList[ie].destroy();
				this.eBulletList.splice(ie,1);
			}
		}
	}

	addHitEffect(e: Effect){
		this.hitEffects.push(e);
		this.eDisp.add(e);
	}

	addPartEffect(e: Effect){
		this.partEffects.push(e);
		this.fDisp.add(e);
	}

	addPlayerEffect(e: Effect){
		this.playerEffects.push(e)
		this.pDisp.add(e);
	}

	unstackEnemies(){
		for(let i = (this.tList.length-1); i >= 0; i--){
			this.overlapCheck(this.tList[i]);
		}
	}
	
	addEnemyBullet(e: EnemyBullet){
		this.eBulletList.push(e);
		this.ebDisp.add(e);

	}

	overlapCheck(t: Target){
		if(t.ghosting){
			return;
		}
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"0"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"+y"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"-y"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"+x"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"-x"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"+x+y"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"+x-y"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"-x-y"));
		this.checkTargetOverlap(t,this.chunks.fetchAdjacent(t,"-x+y"));
		return;
	}

	checkTargetOverlap(c: Target, targets: Target[]){
		if(targets.length <= 0) {
			return;
		}
		let zr = 0;
		let at = 0;
		for(let i = (targets.length-1); i >= 0; i--){
			//console.log("Checking Targets");
			if((targets[i].ghosting)){

			} else if ((c.tID != targets[i].tID)){
				at = Math.abs(Math.sqrt(Math.pow(targets[i].y-c.y,2)+Math.pow(targets[i].x-c.x,2)));
				if(at < (targets[i].colrad + c.colrad)){
					zr = Math.atan2((targets[i].y-c.y),(targets[i].x-c.x));
					//console.log("collision distance: " + at + " mypos: " + c.x + "," + c.y + " tpos: " + targets[i].x + "," + targets[i].y);
					targets[i].unstack[0] += Math.cos(zr);
					targets[i].unstack[1] += Math.sin(zr);
				}
			}
		}
	}
	


	initTouchControls() {
		this.input.addPointer(2);

		// let touchArea = this.add.rectangle(0, 0, this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		// touchArea.setInteractive({ useHandCursor: true, draggable: true });

		let touchId: number = -1;
		let touchButton: number = -1;

		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			/*
			if (!this.player.isTouched) {
				//this.player.touchStart(pointer.x, pointer.y);
				//touchId = pointer.id;
				//touchButton = pointer.button;
			}
			else if (this.player.isTouched && !this.player.isTapped) { // Use second touch point as a trigger
				//this.player.doABarrelRoll();
			}
			*/
			if(this.player != null){
				this.player.fire();
			}

		});

		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			if (touchId == pointer.id) {
				//this.player.touchDrag(pointer.x, pointer.y);
			}
		});

		this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
			/*
			if (touchId == pointer.id && touchButton == pointer.button) {
				// this.ui.debug.setText(`${new Date().getTime()} - id:${pointer.id} button:${pointer.button}`);
				//this.player.touchEnd(pointer.x, pointer.y);
			}
			*/
			if(this.player != null){
				this.player.unfire();
			}
		});
	}

	toggleTracer(){
		if(this.tracing) {
			this.tracing = false;
		} else {
			this.tracing = true;
		}
	}

	addTracer(t: Tracer){
		this.add.existing(t);
		this.tracers.add(t);
		this.tracerList.push(t)
		t.draw();
	}

	clearTracers(){
		for(let r = 0; r < this.tracerList.length; r++){
			this.tracerList[r].destroy()
		}

		for(let d = 0; d < this.dotList.length; d++){
			this.dotList[d].destroy()
		}
		this.tracerList = [];
		this.dotList = [];
	}

	addBullet(b: Bullet){
		this.bList.push(b);
		if(this.tracing) {
			b.trace = true;
		}
		this.bDisp.add(b);
	}

	getProjID(): number{
		this.pID++;
		if(this.pID > 999999999){
			this.pID = -999999999;
		}
		return this.pID;
	}

	dot(x: number, y: number){
		let gfx = new DotTracker(this,x,y);
		//this.add.existing(gfx);
		this.tracers.add(gfx);
		this.dotList.push(gfx);
		this.add.existing(gfx);
		//console.log("dot: "+ x + ", "+ y);

	}

	getTargetID(): number{
		this.tID++;
		if(this.tID > 999999999){
			this.tID = -999999999;
		}
		return this.tID;
	}

	swapMusic(m: MusicKey){
		this.stageMusic.stop();
		this.stageMusic = new Music(this, m, { volume: 0.4 });
		this.stageMusic.play();
	}

	progress(){
		this.stageMusic.stop();
		this.sound.stopAll();
		this.addEvent(1050, () => {
			//this.musicTitle.stop();
			this.scene.start("LootScene", {gameData: this.masterData});
		});
	}

	getCameraDiag(): number{
		return Math.hypot(1920/this.zoom[0],1080/this.zoom[1]);
	}
}
