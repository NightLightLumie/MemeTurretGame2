import { Armory, PassiveAbility, WeaponEntry } from "./WeaponFunctions/Armory";
import { WeaponParams } from "./WeaponFunctions/WeaponOperator";
import { Augment } from "./WeaponFunctions/Weapon";
import { WeaponButton } from "./WeaponFunctions/WeaponButton";

export interface ItemParams{
    id: number;
    name: string;
    spr: string[];
    curLevel: number;
    maxLevel: number;
    desc: string;
    upgradeDesc: string;
}

export class GlobalVariables {

    public curGunID: number = -999999999+1;
    public inv: Armory;
    public maxAugOverLevel: number = 13;
    public maxAugLevel: number = 10;
    public boxCount: number = 0;
    public money: number = 0;
    public widgets: number = 999;

    public defaultItem: ItemParams = {id: -999, name: "default", spr: ["itemtile", "itemtile"], curLevel:0, maxLevel:10, desc:"DEFAULT", upgradeDesc: "DEFAULT"};

    public itemList: ItemParams[] = [
        {id: 0, name: "Cancel Death", spr: ["item_gr", "canceldeath"], curLevel:0, maxLevel:10, desc:"Press ''x'' immediately after being hit to negate fatal damage (250 ms window). If activated, become invulnerable for 3s. 60s cd. Activating too early grants 0.25s of invulnerability and places this ability on full cooldown.", upgradeDesc: "+25 ms window. -1.5s cd."},
        {id: 1, name: "Mandrake", spr: ["item_gr", "mandrake"], curLevel:0, maxLevel:10, desc:"Defeating an enemy heals you for 1% of its max hp rounded down, up to a cap of 10 per enemy. 1s cd.", upgradeDesc: "-0.05s cd. +2 healing cap."},
        {id: 2, name: "Spinach", spr: ["item_gr", "spinach"], curLevel:-1, maxLevel:-1, desc:"Increases your HP by 5% of the base value. Can be stacked indefinitely and does not occupy an item slot.", upgradeDesc: ""},
        {id: 3, name: "Ultrasonic Shield", spr: ["item_gr", "ultrasonicbarrier"], curLevel:0, maxLevel:10, desc:"Gain a slowly recharging shield equal to 25% of your max HP. The shield regenerates at a rate equal to 1% max HP per second.", upgradeDesc: "+1% max HP shielding. +0.1% max HP shield regen rate."},
        {id: 4, name: "Reactive Barrier", spr: ["item_gr", "reactivebarrier"], curLevel:0, maxLevel:10, desc:"Negates one hit every 60s, dealing damage equal to 5x the base damage in a moderate radius around you.", upgradeDesc: "+1x damage multiplier. -1s cd. "},
        {id: 5, name: "Yin-Yang Orb", spr: ["item_gr", "yinyangorb"], curLevel:0, maxLevel:10, desc:"Shrink your hitbox against projectiles by 20%.", upgradeDesc: "Shrink hitbox by an additional 3%."},
        {id: 6, name: "Zoomies", spr: ["item_gr", "zoomies"], curLevel:0, maxLevel:10, desc:"Gain 20% movement speed.", upgradeDesc: "+5% additional movement speed."},
        {id: 7, name: "Fortify", spr: ["item_gr", "fortify"], curLevel:0, maxLevel:10, desc:"Reduce incoming damage by 15%.", upgradeDesc: "+1% additional damage resistance."},
        {id: 8, name: "Phoenix's Tail", spr: ["item_gr", "phoenixtail"], curLevel:0, maxLevel:0, desc:"Grants 3 extra lives. The last life grants 1% regen per second if under 25% HP.", upgradeDesc: "+2.5% emergency regeneration HP threshold."},
        {id: 9, name: "Light Dragon's Blessing", spr: ["item_gr", "lightdragon"], curLevel:0, maxLevel:10, desc:"Take +100% extra damage, but damage can't exceed 25% of your hp per hit.", upgradeDesc: "Extra damage taken reduced by 5%. HP damage cap decreased by 1%."},
        {id: 10, name: "Binding Shots", spr: ["item_gr", "bindingshots"], curLevel:0, maxLevel:10, desc:"Injured enemies deal 15% less damage.", upgradeDesc: "+1.5% additional damage reduction."},
        {id: 11, name: "Gun-Fu", spr: ["item_gr", "gunfu"], curLevel:0, maxLevel:10, desc:"Gain a shield after reloading. The more ammo reloaded, the larger the shield, starting at 2 shield points per ammo. 30s cd.", upgradeDesc: "+0.2 shield per ammo. -1.5s cd."},
        {id: 12, name: "Focus Sash", spr: ["item_gr", "focussash"], curLevel:0, maxLevel:10, desc:"The next lethal hit is negated if you are above 25% hp. Become invulnerable for 3s. 180s cd.", upgradeDesc: "-2.5% hp required to be active. -3s cd."},
        {id: 13, name: "Eat Cement", spr: ["item_gr", "eatcement"], curLevel:0, maxLevel:10, desc:"Every 10 spell casts stores a stack, 15s cd. On hit, consume a stack to brace the attack and receive -50% damage.", upgradeDesc: "+3% damage mitigation. -0.5s cd."},
        {id: 14, name: "Vaccine", spr: ["item_gr", "vaccine"], curLevel:0, maxLevel:10, desc:"Grants invulnerability frames upon taking a hit, 0.1s duration.", upgradeDesc: "+15 ms duration."},
        {id: 15, name: "Disproportionation", spr: ["item_gr", "disproportionation"], curLevel:0, maxLevel:10, desc:"20% of damage taken to HP is converted to red health. Red health regenerates slowly but is lost if further damage is taken.", upgradeDesc: "+3% damage converted to red health."},

        {id: 16, name: "Explosive Magazine", spr: ["item_rd", "fireball"], curLevel:0, maxLevel:10, desc:"Release a random spread of 6 fireballs when reloading, dealing 350 damage each.", upgradeDesc: "+50 damage per fireball."},
        {id: 17, name: "Rune Circle", spr: ["item_rd", "runecircle"], curLevel:0, maxLevel:10, desc:"Deals damage equal to 50% of your current health every 5 seconds in a moderate radius around you.", upgradeDesc: "+20% current health as damage. -0.2s cd."},
        {id: 18, name: "Hi-Power Rounds", spr: ["item_rd", "hipowerrounds"], curLevel:-1, maxLevel:-1, desc:"Increases gun damage by 5%. Can be stacked indefinitely and does not consume an item slot.", upgradeDesc: ""},
        {id: 19, name: "Huge Rod", spr: ["item_rd", "hugerod"], curLevel:-1, maxLevel:-1, desc:"Increases spell damage by 10%. Can be stacked indefinitely and does not consume an item slot.", upgradeDesc: ""},
        {id: 20, name: "Void Dragon's Blessing", spr: ["item_rd", "voiddragon"], curLevel:0, maxLevel:10, desc:"The first instance of weapon damage on an enemy deals an additional 15% of its max health as true damage. 50% effectiveness on bosses.", upgradeDesc: "+1% max HP true damage."},
        {id: 21, name: "Prism of Stars", curLevel:0, spr: ["item_rd", "starprism"], maxLevel:10, desc:"Fire stars in cardinal, then intercardinal directions every 5 gun shots, up once every 0.5s. Each star does 150 damage and pierces through enemies.", upgradeDesc: "+25 damage per star. -0.01s cd."},
        {id: 22, name: "Cast Gun", spr: ["item_rd", "castgun"], curLevel:0, maxLevel:10, desc:"Spell projectiles additionally do gun damage equivalent to 100% of your current weapon's damage.", upgradeDesc: "+5% bonus damage."},
        {id: 23, name: "Kobold Mini-Nova", spr: ["item_rd", "koboldmininova"], curLevel:0, maxLevel:10, desc:"Deal 10 damage per second to all enemies on the field.", upgradeDesc: "+4 damage per second."},
        {id: 24, name: "Sticky Bomb", spr: ["item_rd", "stickybomb"], curLevel:0, maxLevel:10, desc:"Enemies struck by your spell projectiles explode after 3s for 50 additional damage in a small area.", upgradeDesc: "+5 damage."},
        {id: 25, name: "Echolocator", spr: ["item_rd", "echolocator"], curLevel:0, maxLevel:10, desc:"Gun damage increases spell damage by 10%, stacking up to 10 times. Spell damage increases gun damage by 5%, stacking up to 10 times. 1s cd per stack. Stacks last 10s.", upgradeDesc: "+1% spell damage and +0.5% gun damage per stack. +1s duration of stacks."},
        {id: 26, name: "Arrow Raid", spr: ["item_rd", "arrowraid"], curLevel:0, maxLevel:10, desc:"Fires a spread of 3 arrows from your gun every 600 pixels moved, up to twice per second. Each arrow deals 295 damage and penetrates up to 3 enemies.", upgradeDesc: "+1 arrows per cast."},
        {id: 27, name: "Basic Attack Magic", spr: ["item_rd", "basicmagic"], curLevel:0, maxLevel:10, desc:"Fires a vertical or horizontal magic blast through cursor every 5s, dealing 250 damage and piercing enemies. 20% chance to critically strike for double damage.", upgradeDesc: "+20 dmg per blast. -0.3s cd. +3% crit chance."},
        {id: 28, name: "Lava Bucket", spr: ["item_rd", "lavabucket"], curLevel:0, maxLevel:10, desc:"Randomly spawns a lava puddle within a moderate radius every 15 seconds. The puddle deals 250 damage per second to enemies touching it.", upgradeDesc: "+75 damage per second. -1s cd."},
        {id: 29, name: "Ultravibration", spr: ["item_rd", "ultravibration"], curLevel:0, maxLevel:10, desc:"Enemies under 5% hp are executed upon taking damage and grant extra gold. 50% effectiveness on bosses.", upgradeDesc: "+1% execute threshold."},
        {id: 30, name: "Arcane Missile", spr: ["item_rd", "arcanemissile"], curLevel:0, maxLevel:10, desc:"Automatically attack the closest enemy in range with magic missiles. Each missile deals 300 damage. 3s cd.", upgradeDesc: "+40 damage. -0.25s cd."},
        {id: 31, name: "Danmaku Charm", curLevel:0, spr: ["item_rd", "danmakucharm"], maxLevel:10, desc:"Empowers your next gunshot to explode in a ring of 16 random bullets. The enemy directly struck can only be hit by 50% of the bullets. Each bullet does 140 damage. 8s cd.", upgradeDesc: "+1 bullets fired. -0.65s cd."},
    ];

    public augmentWeights: number[][] = [
        [0, 2], // default
        [1, 2], // impact
        [2, 3], // barrage
        [3, 4], // magazine
        [4, 3], // swiftload
        [5, 2], // melter
        [6, 3], // flaying
        [7, 2], // razor shot
        [8, 3], // demolition
        [9, 3], // penetrator
        [10, 4], // concentration
        [11, 2], // critical eye
        [12, 4], // merciless
        [13, 2], // trickshot
        [14, 3], // focus
        [15, 3], // tactician
        [16, 4], // power assist
        [17, 3], // slayer
        [18, 2], // special augment
    ];

    public lootBoxes: number[] = [0];

    public lootTable: number[][] = [

    ]

    public defaultParam: WeaponParams = {type:0,name:"Lutra",class:"pistol", dmg: 1, spd: 10000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 18, load: 1.5, width: 1, rad: 1, acc: 0,
     arpen: [0,0], crit: [0,1], ele: 1, onhit:0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], customaug: {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: []};

    public augList: Augment[] = [
        {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""},
        {name: "Impact", index: 1, level: 0, maxlv: 10, lvcap: 10, desc: "Increased base damage. +10% per upgrade."}, //base damage, +10% each
        {name: "Barrage", index: 2, level: 0, maxlv: 10, lvcap: 10, desc: "Increased rate of fire. +10% per upgrade."}, //RoF, +10% each
        {name: "Magazine", index: 3, level: 0, maxlv: 10, lvcap: 10, desc: "Additional magazine capacity. +10% per upgrade."}, //Capacity, +10% each
        
        {name: "Swiftload", index: 4, level: 0, maxlv: 10, lvcap: 10, desc: "Faster reload speed. +10% per upgrade"}, //Reload, -5% each
        {name: "Melter", index: 5, level: 0, maxlv: 10, lvcap: 10, desc: "Additional damage over time. +10% per upgrade"}, //DoT damage, +10% each
        {name: "Flaying", index: 6, level: 0, maxlv: 10, lvcap: 10, desc: "Ignores a portion of resistances. +1 flat armor ignore and +5% armor ignore per upgrade."}, //Armor pen, +5% each
        {name: "Razor Shot", index: 7, level: 0, maxlv: 10, lvcap: 10, desc: "Increased on-hit damage. +10% and +3 flat damage per upgrade."}, //On hit damage, +10% each
        
        {name: "Demolition", index: 8, level: 0, maxlv: 10, lvcap: 10, desc: "Enlarged blast radius. +5% per upgrade."}, //Blast radius, +5% each
        {name: "Penetrator", index: 9, level: 0, maxlv: 10, lvcap: 10, desc: "Increases penetration capability. +10% per upgrade."}, //Pierce, +10% each
        {name: "Concentration", index: 10, level: 0, maxlv: 10, lvcap: 10, desc: "Increased accuracy. +10% per upgrade."}, //Accuracy cone, -5% each
        {name: "Critical Eye", index: 11, level: 0, maxlv: 10, lvcap: 10, desc: "Additional base critical hit chance. +2.5% per upgrade."}, //Crit chance, +2.5% each
        
        {name: "Merciless", index: 12, level: 0, maxlv: 10, lvcap: 10, desc: "Increased total critical hit damage. +6% per upgrade."}, //Crit damage, +10% each
        {name: "Trickshot", index: 13, level: 0, maxlv: 10, lvcap: 10, desc: "Additional direct hit (+25% dmg) chance. +10% per upgrade"}, //Direct shot (+25% dmg) chance, +1% each
        {name: "Focus", index: 14, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot recharge rate. +10% per upgrade."}, //Special ammo recharge rate and RoF, +10% each
        {name: "Tactician", index: 15, level: 0, maxlv: 10, lvcap: 10, desc: "Increased special shot damage. + 15% per upgrade."}, //Special ammo damage, +10% each
        
        {name: "Power Assist", index: 16, level: 0, maxlv: 10, lvcap: 10, desc: "Increased movement speed while holding weapon. Stacks additively with movement penalties. +5% per upgrade."}, //reduces movement penalty, -5% each
        {name: "Slayer", index: 17, level: 0, maxlv: 10, lvcap: 10, desc: "Increased damage to bosses and elite enemies. +10% per upgrade."}, //Boss and elite damage, +2.5% each
        {name: "CUSTOM", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: "Unlock a custom feature of the gun."},
    ];


    /*
        augs for: 
        generic anything -      [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0]
        dot weapons -           [0,1,1,1, 1,1,1,1, 0,1,1,1, 1,1,0,0, 1,1,0]
        blast weapons(nocrit) - [0,1,1,1, 1,0,1,1, 1,1,1,0, 0,1,0,0, 1,1,0]
        blast weapons(crit)   - [0,1,1,1, 1,0,1,1, 1,1,1,0, 0,1,0,0, 1,1,0]
        snipers -               [0,1,1,1, 1,0,1,1, 0,1,0,1, 1,1,0,0, 1,1,0]  
    */
    public gunList: Map<number,WeaponParams> = new Map([
        //starting weps
        [0, {type:0,name:"WS-Lontra",class:"pistol", dmg: 115, spd: 20000, rof: 5, spcd: 10000, shots: 1, pen: 1, pcd: 20, clip: 18, load: 1.25, width: 1, rad: 1,
         acc: 2, arpen: [0,0], crit: [0.001,2.75], ele: 1, onhit: 0, weight: 0, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Hi-Point", desc: "Base damage increased by 30%. Base pierce increased by 1.", activated: false}]}],
        [1, {type:1,name:"WS-Windmill",class:"smg", dmg: 95, spd: 20000, rof: 8, spcd: 10000, shots: 1, pen: 1.5, pcd: -999, clip: 32, load: 1.25, width: 1, rad: 1,
         acc: 6.5, arpen: [0,0], crit: [0.001,1.75], ele: 1, onhit: 0, weight: 0.025, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Full Tilt", desc: "Magazine size increased by 25% and rate-of-fire increased by 10%. Hits further increase the rate-of-fire by 2% each, up to 20. Bonus resets on switch.", activated: false}]}],
        [2, {type:2,name:"ANTIK",class:"shotgun", dmg: 115, spd: 20000, rof: 2.5, spcd: 10000, shots: 6, pen: 1.5, pcd: -999, clip: 8, load: 2.5, width: 1, rad: 1,
         acc: 15, arpen: [0,0], crit: [0.001,1.5], ele: 1, onhit: 0, weight: 0.125, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Timeless", desc: "+3 pellets and +1 flat rate of fire",activated:false}]}],
        [3, {type:3,name:"WS-Broadhead",class:"sniper", dmg: 765, spd: 50000, rof: 1.5, spcd: 10000, shots: 1, pen: 3, pcd: -999, clip: 5, load: 2, width: 1, rad: 1,
         acc: 0, arpen: [0,0], crit: [0.001,3], ele: 1, onhit: 0, weight: 0.35, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,0,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, passives: [
            {name: "Long Bolts", desc: "+40% crit chance",activated:false}]}],
        [4, {type:4,name:"BJURÖN",class:"assault", dmg: 175, spd: 28000, rof: 6, spcd: 10000, shots: 1, pen: 2.5, pcd: -999, clip: 40, load: 2, width: 1, rad: 1,
         acc: 2.5, arpen: [0,0], crit: [0.001,2.5], ele: 1, onhit: 0, weight: 0.125, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Clearance", desc: "Hits from this weapon have a 40% chance to deal damage twice.", activated: false}]}],
        [5, {type:5,name:"WS-Cropper",class:"lmg", dmg: 215, spd: 28000, rof: 7, spcd: 10000, shots: 1, pen: 2.5, pcd: -999, clip: 75, load: 3, rad: 1,
         width: 1, acc: 7, arpen: [0,0], crit: [0.001,2.75], ele: 1, onhit: 0, weight: 0.25, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Shear", desc: "+2 flat rate of fire, +1 flat pierce.",activated:false}]}],
        [6, {type:6,name:"LOSSNEN",class:"rocket", dmg: 1655, spd: 5000, rof: 1, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 2, load: 2.5, width: 1, rad: 280,
         acc: 0.05, arpen: [0,0], crit: [0,1], ele: 1, onhit: 0, weight: 0.3, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 1,0,1,0, 0,1,0,0, 1,1,0], customaug: {name: "default", index: 0, level: 18, maxlv: 10, lvcap: 10, desc: ""}, passives: [
            {name: "Wholesale", desc: "+60% total damage",activated:false}]}],
        [7, {type:7,name:"Ottertail",class:"smg", dmg: 185, spd: 22000, rof: 11, spcd: 10000, shots: 1, pen: 1.25, pcd: -999, clip: 42, load: 1.75, width: 1, rad: 1,
         acc: 9, arpen: [0,0], crit: [0.001,1.75], ele: 1, onhit: 0, weight: 0.15, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,1], customaug: {name: "Rambunctious", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: "Increased damage when triggering Romp. +20% per upgrade."},
        passives: [{name: "Romp", desc: "Hits from this weapon apply a stack of Romp. At 7 stacks, trigger to deal ", activated: true},
            {name: "Screwdriver", desc: "Alt-fire to shoot a rapid burst of 7 shots.", activated: true},
            {name: "Otter Space", desc: "Each shot inflicts an additional stack of Romp.", activated: false}
        ]}],
        [8, {type:8,name:"NTR-141",class:"pistol", dmg: 60, spd: 20000, rof: 16, spcd: 10000, shots: 1, pen: 1, pcd: -999, clip: 21, load: 1, width: 1, rad: 1,
         acc: 2, arpen: [0,0], crit: [0.001,2.75], ele: 1, onhit: 0, weight: 0.05, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Quality and Quantity", desc: "+22 flat on-hit damage", activated: false}]}],
        [9, {type:9,name:"Two-Fanged Wolf",class:"smg", dmg: 140, spd: 20000, rof: 7, spcd: 10000, shots: 2, pen: 2, pcd: -999, clip: 50, load: 1.75, width: 1, rad: 1,
         acc: 1.5, arpen: [0,0], crit: [0.001,2.25], ele: 1, onhit: 0, weight: 0.1, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,1,1,1, 1,1,0,0, 1,1,0], customaug: {name: "default", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: ""}, 
         passives: [{name: "Snaggletooth", desc: "50% chance to fire a third, inaccurate shot with 35% increased critical strike chance.", activated: true},
            {name: "Pack Tactics", desc: "All shots will critically strike if any shot rolls a critical strike.", activated: true},
            {name: "Domination", desc: "Third shot fire chance and critical strike chance increased by 35% each.", activated: false},
         ]}],
        [10, {type:10,name:"WS-Crossfade SE",class:"pistol", dmg: 90, spd: 20000, rof: 9, spcd: 10000, shots: 1, pen: 1, pcd: 20, clip: 13, load: 1.15, width: 1, rad: 1,
        acc: 8, arpen: [0,0], crit: [0.001,1.5], ele: 1, onhit: 10, weight: 0.05, rarity: 1, dot: [], augs: [0,1,1,1, 1,0,1,1, 0,0,1,1, 1,1,0,0, 1,1,1], customaug: {name: "Split Shot", index: 18, level: 0, maxlv: 10, lvcap: 10, desc: "Additional flat pierce and onhit damage. +0.2 / +2 per level."}, 
        passives: [{name: "Flail", desc: "Randomly fire 1, 2 or 3 projectiles per shot.", activated: true},
            {name: "Havoc", desc: "Fires 1, 2, 3 or 4 projectiles per shot.", activated: false}
        ]}],
        
    ]);

    public side: WeaponEntry;
    public primary: WeaponEntry;
    public secondary: WeaponEntry;

    constructor(){
        this.inv = new Armory(this);
        this.side = this.inv.fetchGun(-999999999 - 3);
        this.primary = this.inv.fetchGun(-999999999 - 2);
        this.secondary = this.inv.fetchGun(-999999999 - 1);
        
    }

    getItemParams(key: string): ItemParams{
        for(let n = 0; n < this.itemList.length; n++){
            if(key == this.itemList[n].name){
                return structuredClone(this.itemList[n]);
            }
        }
        return structuredClone(this.defaultItem);
    }

    getInfiniteItems(): string[]{
        let nx: string[] = [];
        this.itemList.forEach((im) => {
            if(im.maxLevel == -1){
                nx.push(im.name);
            }
        })
        return nx;
    }

    getParams(n: number): WeaponParams{
        if(this.gunList.has(n)){
            let k = this.gunList.get(n);
            if(k != null) {
                return k;
            } else {
                return this.defaultParam;
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + n);
            return this.defaultParam;
        }
    }

    getGunParams(we: WeaponEntry): WeaponParams{
        if(this.gunList.has(we.wID)){
            let k = this.gunList.get(we.wID);
            if(k != null) {
                return k;
            } else {
                return this.defaultParam;
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + we.wID);
            return this.defaultParam;
        }
    }

    copyGunParams(we: WeaponEntry): WeaponParams{
        if(this.gunList.has(we.wID)){
            let k = this.gunList.get(we.wID);
            if(k != null) {
                return structuredClone(k);
            } else {
                return structuredClone(this.defaultParam);
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + we.wID);
            return structuredClone(this.defaultParam);
        }
    }

    getCustomAugment(ix: number): Augment{
        let wi = this.getParams(ix);
        if((wi.augs[18] > 0) && (wi.customaug.name != "default")){
            return wi.customaug;
        } else {
            return this.copyAug(18);
        }
    }

    getGun(ix: number): WeaponParams{
        return this.getParams(ix);
    }

    getGunPassives(ix: number): PassiveAbility[]{
        return this.getParams(ix).passives;
    }

    getNewParams(n: number): WeaponParams{
        if(this.gunList.has(n)){
            let k = this.gunList.get(n);
            if(k != null) {
                return structuredClone(k);
            } else {
                return structuredClone(this.defaultParam);
            }
        } else {
            console.log("NO WEAPON PARAM OF: " + n);
            return structuredClone(this.defaultParam);
        }
    }


    generateGun(ix: number): number{
        let r = this.getNewParams(ix);
        let ap: Augment[] = [];
        let ac = Math.random();
        if(ac < 0.75) {
            ap.push(this.getRandomAugment(r.type, ap));
            ac = Math.random();
            if(ac < 0.5) {
                ap.push(this.getRandomAugment(r.type, ap));
                ac = Math.random(); 
                if(ac < 0.5) {
                    ap.push(this.getRandomAugment(r.type, ap));
                    ac = Math.random(); 
                    if(ac < 0.5){
                        ap.push(this.getRandomAugment(r.type, ap));
                    } 
                } 
            }
        }
        return this.inv.storeNewGun(r,ap,this.getGunID());
    }

    generateMaxGun(ix: number): number{
        let r = this.getNewParams(ix);
        for(let p = 0; p < r.passives.length; p++){
            if(!r.passives[p].activated){
                if(Math.random() < 0.25){
                    r.passives[p].activated = true;
                }
            }
        }
        let ap: Augment[] = [];
        ap.push(this.inv.generateAugment(0,0,10,10));
        ap.push(this.inv.generateAugment(0,0,10,10));
        ap.push(this.inv.generateAugment(0,0,10,10));
        ap.push(this.inv.generateAugment(0,0,10,10));
        return this.inv.storeNewGun(r,ap,this.getGunID());
    }

    generateSuperMaxGun(ix: number): number{
        let r = this.getNewParams(ix);
        for(let p = 0; p < r.passives.length; p++){
            if(!r.passives[p].activated){
                r.passives[p].activated = true;
            }
        }
        let ap: Augment[] = [];
        ap.push(this.inv.generateAugment(0,0,13,13));
        ap.push(this.inv.generateAugment(0,0,13,13));
        ap.push(this.inv.generateAugment(0,0,13,13));
        ap.push(this.inv.generateAugment(0,0,13,13));
        return this.inv.storeNewGun(r,ap,this.getGunID());
    }

    getRandomAugment(ix: number, prohibited: Augment[]): Augment{
        let r = this.getParams(ix).augs;
        let list = [];
        let pool: number[] = [];
        let xx: number[] = [];
        if(prohibited.length > 0){
            prohibited.forEach((p)=> {
                xx.push(p.index);
            })
        }

        for(let i = 0; i < r.length; i++){
            if(r[i] > 0) {
                if(!xx.includes(i)){ // no duplicate augments
                    list.push(i);
                }
            }
        }
        list.push(0);  // have a chance for blank augment
        console.log ("List of augments for selection: " + list);
        
        list.forEach((l) =>{
            if((l >= 0) && (l < this.augmentWeights.length)){
                for(let n = 0; n < this.augmentWeights[l][1]; n++){
                    pool.push(this.augmentWeights[l][0]);
                }
            }
        })

        ix = Math.trunc(Math.random()*pool.length);
        let ag = this.adjustAugmentToLevelWeight(this.copyAug(pool[ix]));
        return ag;
    }

    adjustAugmentToLevelWeight(ag: Augment): Augment{
        let n = this.getRandomLevel();
        ag.lvcap = this.maxAugLevel;
        ag.maxlv = n;
        if(ag.index == 0){
            ag.level = 0;
        } else {
            if(n > 1) {
                ag.level = (1+Math.trunc(Math.random()*n));
            } else {
                ag.level = 1;
            }
        }
        return ag;
    }

    

    getRandomLevel(): number{
        let r = Math.random();
        //.2 [1] .25 [3] .25 [5] .2 [8] .05 [9] .05 [10]
        if(r < 0.05) {
            return 10;
        } else if (r < 0.1) {
            return 9;
        } else if (r < 0.3) {
            return 8;
        } else if (r < 0.55) {
            return 5;
        } else if (r < 0.8) {
            return 3;
        } else {
            return 1;
        }
    }

    /*
    copyParam(w: WeaponParams): WeaponParams {
        return structuredClone(w);
    }
*/

    checkAugCompatibility(w: number, aug: number): boolean{
        if(this.gunList.has(w)){
            let kt = this.gunList.get(w);
            if(kt != null){
                if((aug >= 0) && (aug <= kt.augs.length)) {
                    if(kt.augs[aug] > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    console.log("No augment with this index exists for augment check, or the augment table for this weapon is filled incorrectly.");
                    return false;
                }
            } else {
                console.log("Null entry in weapon list for augment check.");
                return false;
            }
        } else {
            console.log("No weapon with this ID exists for augment check.");
            return false;
        }
    }

    getGunID(): number{
        this.curGunID++;
        if(this.curGunID > 999999999) {
            this.curGunID = -999999999
        }
        return this.curGunID;
    }

    equipLoadout(wl: WeaponButton[]){
        if (wl.length >= 3){
            this.side = this.inv.fetchGun(wl[0].gID);
            this.primary = this.inv.fetchGun(wl[1].gID);
            this.secondary = this.inv.fetchGun(wl[2].gID);
        } else {
            return;
        }
    }

    replaceAugs(id: number, ref: Augment[]){
        this.inv.replaceAugs(id,ref);
    }

    replacePassives(id: number, ref: PassiveAbility[]){
        this.inv.replacePassives(id,ref);
    }

    copyAug(id: number): Augment{
        if((id >= 0) && (id < this.augList.length)){
            return this.inv.copyAug(this.augList[id]);
        } else {
            console.log("No augment with the specified id exists to copy: " + id);
            return {name: "default", index: 0, level: 0, maxlv: 10, lvcap: 10, desc: ""};
        }
    }

    makeBox(): number{
        let e = 0;
        this.boxCount++;
        if((this.boxCount % 10) == 0){
            e = 999;
        }
        if(this.boxCount == 50){
            e = 9999;
            this.boxCount = 0;
        }

        return e;
    }

    saveGame(){
        
    }

    swapLoadout(){
        
    }
}