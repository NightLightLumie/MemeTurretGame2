import { GameScene } from "@/scenes/GameScene";
import { Player } from "../Player";

export class Item {
    protected owner: Player;
    protected key: string;
    constructor(scene: GameScene, p: Player, name: string){
        this.owner = p;
        this.key = name;
    }
    
    update(t: number, d: number){

    }


    //Items: Carry up to 6.
    //Cancel Death: Press x in deathbomb timer to cancel dying. Invuln for 1s. 
    //Basic Attack Magic: Shoot a projectile in a random direction. Damage: 
    //NFT: Increases difficulty by 5
    //Mandrake: -20% HP. +1% max hp regen per second.
    //Explosive Magazine: Explode when reloading, dealing 25 damage per bullet reloaded (+2.5 per upgrade)
    //Rune Circle: Deals damage equal to your current health every 5 seconds in a moderate radius around you (-0.1s per upgrade)
    //Hi-Power Rounds: All gun damage increased by 10% (+1.5% per upgrade)
    //White Dragon Gem: The first hit on an enemy deals an additional 20% of its max health as true damage
    //Black Dragon Gem: Enemies release shrapnel when defeated, each dealing 10% of their max health to nearby enemies
    //Prism of Stars: Shoot stars in cardinal, then intercardinal directions every 5 shots (+1 pierce per upgrade)
    //Cast Gun: Spell projectiles additionally do 100% of your gun damage as bonus damage. (+5% per upgrade)
    //Kobold Mini-Nova: Deal 10 damage per second to all enemies on the field (+2 per upgrade)
    //Sparkler: +50% spell damage (+5% per upgrade)
    //Ultrasonic Shield: Gain a slowly recharging shield equal to 25% of your max HP (+1% recharge speed per upgrade)
    //Reactive Barrier: Negates one hit every 20s, dealing damage equal to 50x the base damage in a moderate radius around you (-0.5s cd per upgrade)
    //Phoenix's tail: Gain 3 extra lives
    //Sticky Bomb: Enemies struck by your spell projectiles explode after 3s for 50 damage (1s cd) (+5 per upgrade)
    //Zoomies: Gain 20% movement speed (+2% per upgrade)
    //Fortify: Reduce incoming damage by 20% (+3% per upgrade)
    //Magical Suck: Each instance of spell damage increases your gun damage by 1% for 5 seconds, stacking up to 50 times (+0.1% per upgrade)


}