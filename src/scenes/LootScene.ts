import { GlobalVariables } from "@/components/GlobalVariables";
import { BaseScene } from "./BaseScene";

export class LootScene extends BaseScene{

    public masterData: GlobalVariables;

	constructor() {
		super({ key: "LootScene" });
	}

	init(data: { gameData: GlobalVariables; })
	{
		console.log('init, data');
		this.masterData = data.gameData;
	}
}