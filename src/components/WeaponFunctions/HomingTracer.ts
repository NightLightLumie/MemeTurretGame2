import { GameScene } from "@/scenes/GameScene";
import { Missile } from "./Missile";
import { Target } from "../Target";
import { BasicEffect } from "../Graphics/BasicEffect";
import { BlendModes } from "phaser";


export class HomingTracer extends Missile {
    public turnAngle: number = 2*Math.PI;
    public tg: Target | null;
    protected baseSpeed: number = 2400;
    protected ignoreNonTargets: boolean = true;
    protected duration: number = 0;
    protected px: Phaser.GameObjects.Particles.ParticleEmitter;

    //public lastStoredLocation: number[] = [];
    constructor(scene: GameScene, x: number, y: number, name: string, angle: number, vscale: number, t: Target){
        super(scene, x, y, name, angle, vscale);
        this.vangle = this.normalizeAngleRad(angle); // use normalized values
        this.angle = this.vangle*(180/Math.PI);
        this.v[0] = this.vscale*this.baseSpeed*Math.cos(this.vangle);
        this.v[1] = this.vscale*this.baseSpeed*Math.sin(this.vangle);
        this.radius = 25;
        if(t != null){
            this.tg = t;
            //this.lastStoredLocation = [this.tg.x, this.tg.y];
        }
        this.px = this.scene.add.particles(0,0,"greensq",{
            frame: 0,
            x: 0,
            y: 0,
            angle: {min: -180, max: 180},
            speed: 50,
            follow: this,
            frequency: 20,
            alpha: {start: 1, end: 0},
            scale: {start: 0.5, end: 1},
            rotate: {min: -180, max: 180},
            lifespan: 500,
            blendMode: BlendModes.ADD,



        });

        this.scene.referForDelete(this.px);
        //this.add(this.px);

    }

    signedHomingTurn(ang: number, d: number){
        /*
        if(((ang > 0) && (this.vangle > 0)) || ((ang <= 0) && (this.vangle <= 0)))
        { // if same sign just turn by direction
            if(ang >= this.vangle){
                this.turnPos(ang, d);
            } else {
                this.turnNeg(ang, d);
            }
        } else {
            let rr = Math.abs(ang) + Math.abs(this.vangle);
            if(rr >= (Math.PI)){
                if(ang >= this.vangle){
                    this.turnNeg(ang, d);
                } else {
                    this.turnPos(ang, d);
                }
            } else {
                if(ang >= this.vangle){
                    this.turnPos(ang, d);
                } else {
                    this.turnNeg(ang, d);
                }
            }
        }*/
        let xc = this.findAngularDistance(ang);
        if(Math.abs(xc) <= (Math.abs(this.turnAngle)*(d/1000))){
            this.vangle = ang;
        } else if(xc > 0){
            this.vangle += (this.turnAngle*(d/1000));
        } else {
            this.vangle -= (this.turnAngle*(d/1000));
        }

        this.vangle = this.normalizeAngleRad(this.vangle);
        this.setAngle(this.vangle*(180/Math.PI));
        this.v = [this.vscale*this.baseSpeed*Math.cos(this.vangle),this.vscale*this.baseSpeed*Math.sin(this.vangle)];

    }

    findAngularDistance(ang: number){ // returns signed, if + you need to turn in a positive direction
        if(((ang > 0) && (this.vangle > 0)) || ((ang <= 0) && (this.vangle <= 0))){
            return ang - this.vangle;
        } else if ((Math.abs(ang) < (Math.PI/2)) && (Math.abs(this.vangle) < (Math.PI/2))){
            return ang - this.vangle;
        } else {
            let pside = Math.abs(ang)+Math.abs(this.vangle);
            let nside = (2*Math.PI)-pside;
            if(pside < nside){
                if(this.vangle > ang){
                    return -1*pside;
                } else {
                    return pside;
                }
            } else {
                if(this.vangle < ang){
                    return -1*nside;
                } else {
                    return nside;
                }
            }
        }
    }

    normalizeAngleRad(n: number){
        if(n > (Math.PI)){
            n = n%(2*Math.PI);
            if(n > Math.PI){
                n = -1*((2*Math.PI)-n);
            }
            return n;
        } else if (n < (-1*Math.PI)){
            n = n%(2*Math.PI);
            if(n < (-1*Math.PI)){
                n = -1*((-2*Math.PI)-n);
            }
            return n;
        } else {
            return n;
        }
    }

    update(t: number, d: number){

        if(Math.abs(this.vangle) > (2*Math.PI)){
            console.log ("HOMING ANGLE ERROR OVERFLOW: " + (this.vangle/Math.PI));
        }
        
        this.duration += d;
        if(this.duration > 2000){
            this.turnAngle += (Math.PI/2)*(d/1000); //anti-orbiting code
        }
        //i.e. if the target dies, keep going in the same direction
        if(this.tg != null){
            if(this.tg.deleteFlag){
                this.tg = null;
            }
        }
        if(this.tg != null){
            let ag = Math.atan2((this.tg.y-this.y),(this.tg.x-this.x));
            this.signedHomingTurn(ag,d);
        } else {
            this.findNewTarget()
            //use if you want to do some reacquire magic
        }

        this.x += this.v[0]*(d/1000);
        this.y += this.v[1]*(d/1000);
        this.spr.angle += this.spin*(d/1000);
        this.checkBounds();
        
    }

    
    findNewTarget(){
        if(this.scene.closestTarget != null){
            this.tg = this.scene.closestTarget;
        }
    }

    hitCheck(t: Target){
        if((this.ignoreNonTargets) && (this.tg != null)){
            if(t.tID != this.tg.tID){
                return;
            }
        }
        let r = this.targetDist(t);
        if(r < (this.radius+t.radius)){
            this.processHit(t);
        }
    }

    processHit(t: Target): void {
        if(!this.deleteFlag){
            this.deleteFlag = true;
            this.px.stop();
            this.scene.playSound("meme_explosion",0.5);
            this.scene.simpleExplode(350,this.x,this.y,50);
            this.scene.addHitEffect(new BasicEffect(this.scene,"exp",this.x,this.y,25,15,false,2,Math.random()*360,[0.1,0.1]));
        }
    }

    normalizeAngleDeg(n: number){
        if(n > (180)){
            n = n%(360);
            if(n > 180){
                n = -1*((360)-n);
            }
            return n;
        } else if (n < (-180)){
            n = n%(360);
            if(n < (-1*Math.PI)){
                n = -1*((-360)-n);
            }
            return n;
        } else {
            return n;
        }
    }
}