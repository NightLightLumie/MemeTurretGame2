import MusicData, { MusicKey } from "@/components/MusicData";
export interface MusicFade {
	type: string;
	cur: number;
	max: number;
	volume: number;
}

export class Music extends Phaser.Sound.WebAudioSound {
	public _prevBarTime: number;
	public bpm: number;
	public end: number;
	public myKey: MusicKey;
	public myLoop: boolean;
	public maxBar: number;
	public offset: number;
	public speed: number;
	public start: number;
	public loopSum: number;
	public toSwap: boolean = false;
	public fades: MusicFade[];

	constructor(scene: any, myKey: MusicKey, config = {}) {
		super(scene.sound, myKey, config);
		scene.sound.sounds.push(this);
		this.myKey = myKey;

		if (!MusicData[myKey]) {
			throw "Music data missing for: " + myKey;
		}
		let custom = MusicData[myKey] || {};

		this.offset = custom.offset;
		this.bpm = custom.bpm;
		this.myLoop = custom.loop || false;

		if (this.myLoop) {
			this.start = custom.start;
			this.end = custom.end;
			this.setLoop(true);
		} else {
			this.start = this.offset;
			this.end = this.duration;
			this.setLoop(false);
		}

		this.speed = 60 / this.bpm;
		this.maxBar = Math.round((this.end - this.start) / this.speed);
		this.loopSum = 0;
		this.fades = [];
	}

	update() {
		super.update();
		if (this.isPlaying) {
			if (this.myLoop) {
				if (this.currentTime > this.end) {
					console.log("going to: " + this.start);
					this.setSeek(this.start);
					console.log("now at: " + this.seek);
					this.loopSum += this.end - this.start;
					this.emit("loop");
				}
			}

			let barTime = this.getBarTime();
			if (barTime >= 0) {
				if (Math.floor(barTime) != Math.floor(this._prevBarTime)) {
					this.emit("bar", Math.floor(barTime));
				}
			}
			this._prevBarTime = barTime;
		}

	}

	updateFades(d: number){
		if(this.fades.length > 0){
			switch(this.fades[0].type){
				case "out": {
					if(this.fades[0].cur > 0){
						this.fades[0].cur -= d;
						if(this.fades[0].cur <= 0){
							this.fades = [];
							this.stop();
							this.toSwap = true;
							this.destroy();
						} else {
							this.setVolume(this.fades[0].volume*this.fades[0].cur/this.fades[0].max);
						}
					}
					break;
				} case "in": {
					if(this.fades[0].cur > 0){
						this.fades[0].cur -= d;
						if(this.fades[0].cur <= 0){
							this.setVolume(this.fades[0].volume);
							this.fades = [];
						} else {
							this.setVolume(this.fades[0].volume*(1-(this.fades[0].cur/this.fades[0].max)));
						}
					}
					break;
				} default: {
					this.fades = [];
					break;
				}
			}
		}
	}

	getBarTime() {
		let time = this.currentTime - this.offset;
		return time / this.speed;
	}

	startFade(mode: string, time: number, startvolume: number){
		this.fades.push({
			type: mode,
			cur: time,
			max: time,
			volume: startvolume,
		})
	}

	getBar() {
		return Math.floor(this.getBarTime());
	}

	get currentTime() {
		return this.seek;
	}

	get totalTime() {
		return this.seek + this.loopSum;
	}

	get barTime() {
		return (this.totalTime - this.offset) / this.speed;
	}
}
