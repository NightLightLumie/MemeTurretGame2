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

	public masterData: GlobalVariables;

	constructor() {
		super({ key: "CutsceneScene" });
		this.masterData = new GlobalVariables();
	}

	create(): void {
		this.fade(false, 200, 0x000000);

	}

	update(time: number, delta: number) {

	}

	progress() {

	}

}
