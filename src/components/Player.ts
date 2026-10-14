import { GameScene } from "@/scenes/GameScene";
import { WeaponDisplay } from "./WeaponDisplay";
import { Bullet } from "./WeaponFunctions/Bullet";
import { Weapon } from "./WeaponFunctions/Weapon";
import { Item } from "./GameFunctions/Items/Item";

const ACCELERATION = 350;
const MAX_SPEED = 500;
const FRICTION = 0.7;
const TAPPING_TIMER = 200; // ms


//
//

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;
	private inventory: number;
	private tween: Phaser.Tweens.Tween;


	// Controls
	private keyboard: any;
	public isTouched: boolean;
	public isTapped: boolean;
	private tappedTimer: number;
	private inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	private touchPos: Phaser.Math.Vector2;
	public velocity: Phaser.Math.Vector2;

	private border: { [key: string]: number };
	private hbox: Phaser.GameObjects.Sprite;
	private wpDisp: WeaponDisplay;
	private ttText: Phaser.GameObjects.Text;
	private fRad: number = 144;
	private firing: boolean = false;
	private cd: number = 0;
	private maxCD: number = 250;
	private gfx: Phaser.GameObjects.Graphics;


//Spell modifiable variables

	public radius: number = 100;
	public hitsize: number = 40;
	public shrink: number = 0;

	public baseHP: number = 1000;
	public bonusHP: number = 0;
	public maxHP: number = 1000;
	public health: number = 1000;
	public overShield: number = 0;
	public maxShield: number = 0;
	public shields: number = 0;
	public items: Item[];
	public itemIndices: number[];

	public curIFrames: number = 0;
	public maxIFrames: number = 250;

	public bonusGunDamage: number = 0;
	public bonusSpellDamage: number = 0;

	public bonusAccel: number = 0;
	public maxAccel: number = ACCELERATION;
	public bonusSpeed: number = 0;
	public maxSpeed: number = MAX_SPEED;
	
	public redHP: number = 0;
	public deferDamage: number = 0.5;
	public dmgRes: number = 0;
	public dmgCap: number = 1;

	public smite: number = 0;
	public execute: number = 0;

	public loadout: [Weapon,Weapon,Weapon];
	public activeWeapon: number = 0;
	public spMod: number = 1;

	//public hp: number[] = [1000,1000];
	public hpBar: Phaser.GameObjects.Rectangle;
	public rhpBar: Phaser.GameObjects.Rectangle;
	public globalTickTimer: number[] = [250,250];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "turretbase");
		this.hbox = this.scene.add.sprite(0, 0, "heart");
		this.sprite.setOrigin(0.5, 0.5);
		this.hbox.setOrigin(0.5, 0.5);
		//this.sprite.y += this.spriteSize / 2;
		//this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);
		this.add(this.hbox);
		this.wpDisp = new WeaponDisplay(scene,0,0,this);
		this.add(this.wpDisp);
		this.wpDisp.setDepth(10);
		this.gfx = this.scene.add.graphics();
		this.add(this.gfx);
		this.gfx.setDepth(15);

		this.ttText = this.scene.addText({
			x: 0,
			y: -160,
			size: 40,
			color: "#FFFFFF",
			text: "",
		});
		this.ttText.setOrigin(0.5,0.5);
		this.add(this.ttText);

		/* Controls */
		if (this.scene.input.keyboard) {
			this.keyboard = this.scene.input.keyboard.addKeys({
				up1: "W",
				down1: "S",
				left1: "A",
				right1: "D",
				up2: "Up",
				down2: "Down",
				left2: "Left",
				right2: "Right",
				scrollback: "Q",
				scrollforward: "E",
				tracer: "T",
				cleartracer: "T",
			});
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
				.on("down", this.doABarrelRoll, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.E)
				.on("down", this.scrollForward, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
				.on("down", this.scrollBackward, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.T)
				.on("down", this.toggleTracer, this);
			this.scene.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
				.on("down", this.clearTracer, this);
		}
		this.isTouched = false;
		this.isTapped = false;
		this.tappedTimer = 0;
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.touchPos = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: -1920,
			right: 1920,
			top: -1080,
			bottom: 1080,
		};

		this.rhpBar = this.scene.add.rectangle(-128,128,256,32,0xff0000,1);
		this.rhpBar.setOrigin(0,0);
		this.add(this.rhpBar);
		this.rhpBar.setVisible(false);

		this.hpBar = this.scene.add.rectangle(-128,128,256,32,0x00ff00,1);
		this.hpBar.setOrigin(0,0);
		this.add(this.hpBar);
		this.hpBar.setVisible(false);

		this.sprite.setDepth(6);
		this.hbox.setDepth(7);
		this.rhpBar.setDepth(8);
		this.hpBar.setDepth(9);
	}

	setDefaultLoadout(){
		let a = this.scene.masterData.copyGunParams(this.scene.masterData.side);
		let b = this.scene.masterData.copyGunParams(this.scene.masterData.primary);
		let c = this.scene.masterData.copyGunParams(this.scene.masterData.secondary);
		console.log("Sidearm: " + a.type);
		console.log("Primary: " + b.type);
		console.log("Secondary: " + c.type);
		this.loadout = [
			new Weapon(this.scene, a, this.scene.masterData.side.augs),
			new Weapon(this.scene, b, this.scene.masterData.primary.augs),
			new Weapon(this.scene, c, this.scene.masterData.secondary.augs),
		]

	}

	fetchLoadout(){
		//this.loadout[0] = new Weapon (this.scene, this.scene.masterData.)
	}

	upgradeHP(n: number){
		this.bonusHP += n;
		this.health += n;
		this.maxHP = this.baseHP + this.bonusHP;
	}

	upgradeSpeed(n: number){
		this.bonusSpeed += (n*MAX_SPEED);
		this.maxSpeed = MAX_SPEED+this.bonusSpeed;
		this.bonusAccel += (n*ACCELERATION);
		this.maxAccel = ACCELERATION+this.bonusAccel;
	}

	takeHit(n: number){
		if(this.curIFrames > 0){
			this.scene.sound.play("miss", {volume: 1});
		} else if(this.maxIFrames > 0){
			this.curIFrames = this.maxIFrames;
		}
		//adjust damage prior to stuff like reactive barrier
		if(this.dmgRes > 0){
			n *= (1-this.dmgRes);
		}
		if(this.dmgCap < 1){
			if(n > (this.dmgCap*this.maxHP)){
				n = this.dmgCap*this.maxHP;
			}
		}
		if(this.shields > 0){
			this.takeShieldDamage(n);
		} else {
			this.takeDamage(n);
		}
		
	}

	takeShieldDamage(n: number){
		if(n <= this.shields){
			this.shields -= n;
		}
		else {
			this.shields = 0;
			n -= this.shields;
			this.takeDamage(n);
		}
	}

	takeDamage(n: number){
		this.redHP = 0;
		if(this.deferDamage > 0){
			this.redHP += n*this.deferDamage;
			n -= (n*this.deferDamage);
		}
		this.health -= n;
		if(this.health <= 0){ 
			this.health = 0;
			this.die();
		}
	}

	die(){
		this.scene.die();
	}

	updateGlobalTickEvents(){
		if(this.redHP > 0){
			if(this.redHP < (0.01 * this.maxHP)){
				this.health += this.redHP;
				this.redHP = 0;
			} else {
				this.health += (0.01*this.maxHP);
				this.redHP -= (0.01*this.maxHP);
			}
			if(this.health > this.maxHP){
				this.health = this.maxHP;
			}
		}
	}

	update(time: number, delta: number) {
		this.spMod = this.getActiveWeapon().speed;
		this.gfx.clear();
		/*
		this.gfx.fillStyle(0x00FFFF,0.75);
		this.gfx.beginPath();
		this.gfx.slice(0,0,100,0,360,false,0.005);
		this.gfx.closePath();
		this.gfx.fillPath();
		*/

		//this.ttText.setText("Position: " + this.x + ", " + this.y );
		if(this.globalTickTimer[0] > 0){
			this.globalTickTimer[0] -= delta;
			if(this.globalTickTimer[0] <= 0){
				this.updateGlobalTickEvents();
				this.globalTickTimer[0] += this.globalTickTimer[1];
			}
		}

		if(this.curIFrames > 0){
			this.curIFrames -= delta;
			this.sprite.setAlpha(0.75);
			if(this.curIFrames <= 0) {
				this.curIFrames = 0;
				this.sprite.setAlpha(1);
			}
		}

		this.updateHPDisplay();

        const pointer = this.scene.input.activePointer;
        const worldX = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y).x;
        const worldY = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y).y;
		let a = Math.atan2((worldY-this.y),(worldX-this.x));
		this.wpDisp.update(time,delta,a);
		// Movement
		this.handleInput();

		if(this.cd > 0){
			this.cd -= delta;
			if(this.cd <= 0){
				this.cd = 0;
			}
		}
		if((this.loadout.length > 0)) {
			this.loadout[this.activeWeapon].update(time,delta);
		}
		if(this.firing) {
			this.scene.handler.shoot(a,this.getActiveWeapon());
		}

		this.inputVec.limit(1);
		// this.inputVec.normalize();
		this.inputVec.scale(this.maxAccel);
		//console.log("Speed modifier: " + this.spMod);

		if(!((this.inputVec.x == 0) && (this.inputVec.y == 0))){
			this.sprite.setAngle((180/Math.PI)*Math.atan2(this.inputVec.y,this.inputVec.x));
		}

		if (this.isTapped) {
			this.tappedTimer -= delta;
			if (this.tappedTimer <= 0) {
				this.isTapped = false;
			}
		} else {
			this.velocity.scale(FRICTION);
			this.velocity.add(this.inputVec);
			this.velocity.limit(this.maxSpeed);
		}

		this.x += (this.velocity.x*this.spMod * delta) / 1000;
		this.y += (this.velocity.y*this.spMod * delta) / 1000;


		this.updateItems(time,delta);

		// Border collision
		this.checkBounds();

		// Animation (Change to this.sprite.setScale if needed)
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	updateHPDisplay(){
		if(this.health >= this.maxHP){
			this.hpBar.setVisible(false);
		} else {
			this.hpBar.setVisible(true);
			this.hpBar.setScale(this.health/this.maxHP,1);
			
		}

		if(this.redHP <= 0){
			this.rhpBar.setVisible(false);
		} else {
			this.rhpBar.setVisible(true);
			this.rhpBar.setScale((this.health+this.redHP)/this.maxHP,1);
		}

		if(((this.health/this.maxHP) <= 0.65) && ((this.health/this.maxHP) > 0.3)) {
			this.hpBar.fillColor = 0xFFFF00;
		} else if (((this.health/this.maxHP) <= 0.3)) {
			this.hpBar.fillColor = 0xFF0000;
		} else {
			this.hpBar.fillColor = 0xFF8900;
		}
	}

	updateItems(t:number, d:number){
		if(this.items.length > 0){
			this.items.forEach((i)=>{
				i.update(t,d);
			})
		}
	}

	scrollForward(){
		this.loadout[this.activeWeapon].reset();
		this.activeWeapon++;
		if(this.activeWeapon > 2){
			this.activeWeapon = 0;
		}
		if(this.loadout[this.activeWeapon].loadTime > 0){
			this.scene.sound.play("start_reload", {volume:0.75});	
		}

		this.scene.refreshGUI();
	}

	scrollBackward(){
		this.loadout[this.activeWeapon].reset();
		this.activeWeapon--;
		if(this.activeWeapon < 0){
			this.activeWeapon = 2;
		}
		if(this.loadout[this.activeWeapon].loadTime > 0){
			this.scene.sound.play("start_reload", {volume:0.75});	
		}

		this.scene.refreshGUI();
	}

	checkBounds() {
		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}
	}

	handleInput() {
		this.inputVec.reset();

		// Keyboard input to vector
		if (!this.isTouched) {
			if (this.keyboard) {
				this.inputVec.x =
					(this.keyboard.left1.isDown || this.keyboard.left2.isDown ? -1 : 0) +
					(this.keyboard.right1.isDown || this.keyboard.right2.isDown ? 1 : 0);
				this.inputVec.y =
					(this.keyboard.up1.isDown || this.keyboard.up2.isDown ? -1 : 0) +
					(this.keyboard.down1.isDown || this.keyboard.down2.isDown ? 1 : 0);
			}
		}
		// Touch to input vector
		else {
			this.inputVec.copy(this.touchPos);
			this.inputVec.x -= this.x;
			this.inputVec.y -= this.y; // If needed, add offset so finger doesn't block, see TW.
			// if (this.inputVec.length() < 8) {
			// this.inputVec.reset();
			// }
			this.inputVec.scale(1 / 50);
		}
	}

	touchStart(x: number, y: number) {
		this.isTouched = true;
		this.isTapped = false;
		this.touchPos.x = x;
		this.touchPos.y = y;

		if (this.touchInsideBody(x, y)) {
			this.isTapped = true;
			this.tappedTimer = TAPPING_TIMER;
		}
	}

	touchDrag(x: number, y: number) {
		this.touchPos.x = x;
		this.touchPos.y = y;

		if (this.isTapped && !this.touchInsideBody(x, y)) {
			this.isTapped = false;
		}
	}

	touchEnd(x: number, y: number) {
		if (this.isTapped && this.tappedTimer > 0) {
			this.emit("action");
		}

		this.isTouched = false;
		this.isTapped = false;
	}

	touchInsideBody(x: number, y: number) {
		return (
			Phaser.Math.Distance.Between(this.x, this.y, x, y) <
			this.spriteSize
		);
	}

	toggleTracer(){
		this.scene.toggleTracer();
	}

	clearTracer(){
		this.scene.clearTracers();
	}

	fire(){
		this.firing = true;
	}

	unfire(){
		this.firing = false;
	}


	getActiveWeapon(): Weapon{
		return this.loadout[this.activeWeapon];
	}

	renderWeapon(){

	}

	doABarrelRoll() {
		if (!this.tween || !this.tween.isActive()) {
			this.tween = this.scene.tweens.add({
				targets: this.sprite,
				scaleX: {
					from: this.sprite.scaleX,
					to: -this.sprite.scaleX,
					ease: "Cubic.InOut",
				},
				duration: 300,
				yoyo: true,
			});
		}
	}
}
