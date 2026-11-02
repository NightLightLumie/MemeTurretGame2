import { GameScene } from "@/scenes/GameScene";

export class FlashScreen extends Phaser.GameObjects.Container{
    public scene: GameScene;
    public overlay: Phaser.GameObjects.Rectangle;
    public fTimer: number = 0;
    public fTimerMax: number = 1000;
    public cAlpha: number = 1;
    constructor(scene: GameScene, x: number, y: number){
        super(scene,x,y);
        this.scene = scene;
        this.cAlpha = 1;
        this.fTimerMax = 1000;
        this.overlay = this.scene.add.rectangle(0,0,2120,1280,0xFFFFFF,1);
        this.add(this.overlay);
        this.overlay.setVisible(false);
        this.overlay.setOrigin(0.5,0.5);
        this.overlay.setScale(2);

    }

    update(t: number, d: number){
        if(this.fTimer > 0){
            this.fTimer -= d;
            if(this.fTimer <= 0){
                this.fTimer = 0;
                this.overlay.setVisible(false);
                this.overlay.setAlpha(1);
            } else {
                this.overlay.setAlpha(this.cAlpha*(this.fTimer/this.fTimerMax));
            }
        }
    }

    flash(t: number, color: number, alpha: number, x: number = 0, y: number = 0){
        this.fTimer = t;
        this.fTimerMax = t;
        this.x = x;
        this.y = y;
        this.overlay.setVisible(true);
        this.overlay.fillColor = color;
        this.cAlpha = alpha;
        this.overlay.setAlpha(this.cAlpha);
    }
}