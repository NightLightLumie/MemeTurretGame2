import { GameScene } from "@/scenes/GameScene";
import { ItemButton } from "./ItemButton";

export class ItemShop extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public back: Phaser.GameObjects.Sprite;
    public desc: Phaser.GameObjects.Text;
    public title: Phaser.GameObjects.Text;
    public box: Phaser.GameObjects.Rectangle;
    public tileSet: number[][] = [[-388, -272], [0, -272], [388, -272], [-194, -48], [194, -48]];
    public tButtons: ItemButton[];
    public dropping: boolean = false;
    private vy: number = 600;
    private fade: number[] = [0,1000];
    public isOpen: boolean;

    constructor(scene: GameScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.tButtons = [];
        this.back = this.scene.add.sprite(0,0,"shop_panel");
        this.add(this.back);
        this.setScale(2);
        this.back.setDepth(0);
        this.fade = [0,1000];
        this.isOpen = false;
        this.box = this.scene.add.rectangle(0,262,1144,320,0x000000,0.6);
        this.box.setOrigin(0.5,0.5);
        this.add(this.box);
        this.title = this.scene.addText({
			x: -562,
			y: 112,
			size: 50,
			color: "white",
			text: "",
		});
        this.add(this.title);
        this.title.setWordWrapWidth(1124);
        this.desc = this.scene.addText({
			x: -562,
			y: 182,
			size: 32,
			color: "white",
			text: "",
		});
        this.add(this.desc);
        this.desc.setWordWrapWidth(1124);
    }

    hide(){
        this.setVisible(false);
    }

    setTitle(st: string){
        this.title.setText(st);
    }

    setDesc(st: string){
        this.desc.setText(st);
    }

    open(){
        this.x = this.scene.player.x;
        this.y = this.scene.player.y-2280;
        this.title.setText("Welcome to the Shop!");
        this.desc.setText("");
        this.isOpen = true;
        this.tileSet.forEach((ps) => {
            let itb = new ItemButton(this.scene,ps[0],ps[1], this);
            this.add(itb);
            this.tButtons.push(itb);
        });
        this.dropping = true;
        this.setVisible(true);
        this.initializeItems();
    }

    close(){
        this.setVisible(false);
        this.title.setText("");
        this.desc.setText("");
        this.isOpen = false;
        this.tButtons.forEach((tb) => tb.destroy());
        this.tButtons = [];
    }

    lockRemainingButtons(){
        this.tButtons.forEach((tb) => {
            if(!tb.hardlock){
                tb.deactivate();
            }
        })
    }

    startFade(){
        this.fade[0] = this.fade[1];
        this.scene.closeShopBackdrop();
    }

    updateDrop(t: number, d: number){
        this.vy += (16400*d/1000);
        this.y += this.vy*d/1000;
        if(this.y > this.scene.player.y) {
            this.y = this.scene.player.y;
            this.dropping = false;
            this.vy = 600;
        }
    }

    update(t: number, d: number){
        if(this.fade[0] > 0){
            this.fade[0] -= d;
            if(this.fade[0] <= 0){
                this.fade[0] = 0;
                this.setVisible(false);
                this.setAlpha(1);
                this.close();
            } else {
                this.setAlpha(this.fade[0]/this.fade[1]);
            }
        }
    }

    initializeItems(){
        let ixs = [];
        for(let nn = 0; nn < this.scene.player.items.length; nn++){
            if(this.scene.player.items[nn].level < this.scene.player.items[nn].maxLevel){
                ixs.push(nn);
            }
        }
        if(ixs.length > 1){
            ixs = Phaser.Utils.Array.Shuffle(ixs);
        }

        //can't buy more items
        let infbuy = this.scene.masterData.getInfiniteItems();
        infbuy = Phaser.Utils.Array.Shuffle(infbuy);
        if(this.scene.player.items.length >= 8){
            if(ixs.length <= 0){
                // all items maxed out, just spawn infinite stack items
                this.tButtons[0].loadItem("Spinach", false);
                this.tButtons[1].loadItem("Hi-Power Rounds", false);
                this.tButtons[2].loadItem("Huge Rod", false);
            } else {
                //load up to 4 items
                let nmx = ixs.length;
                if(nmx > (this.tButtons.length-1)) {
                    nmx = this.tButtons.length-1;
                }
                for (let se = 0; se < nmx; se++){
                    this.tButtons[se].loadItem(this.scene.player.items[ixs[se]].key,true);
                }
                //fill rest with infinite stack items;
                let st = 0;
                for(let xn = nmx; xn < this.tButtons.length; xn++){
                    if(st < infbuy.length) {
                        this.tButtons[xn].loadItem(infbuy[st],false);
                    }
                    st++;
                }
            }
        } else {
            let unowned: string[] = [];
            let owned = this.scene.player.getOwnedItems();
            this.scene.masterData.itemList.forEach((il) => {
                if(!(owned.includes(il.name))){
                    if(!infbuy.includes(il.name)){
                        unowned.push(il.name);
                    }
                }
            })
            let stt = 1;
            if(owned.length > 0){
                owned = Phaser.Utils.Array.Shuffle(owned);
                this.tButtons[0].loadItem(owned[0],true);
            } else {
                stt = 0;
            }
            unowned = Phaser.Utils.Array.Shuffle(unowned);
            let bg = 0;
            for(let stn = stt; stn < (this.tButtons.length-1); stn++){
                if(bg < unowned.length){
                    this.tButtons[stn].loadItem(unowned[bg], false);
                }
                bg++;
            }
            this.tButtons[this.tButtons.length-1].loadItem(infbuy[0],false);
        }


    }
}