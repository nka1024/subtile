/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";

export class Player extends Phaser.GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        
        super(scene, x, y, "player_idle_32x32");
        
        var idleAnim = {
            key: 'player_idle',
            frames: scene.anims.generateFrameNumbers('player_idle_32x32', { start: 0, end: 3}),
            frameRate: 5,
            repeat: -1,
            repeatDelay: 0
        };
        scene.anims.create(idleAnim);
        var walkAnim = {
            key: 'player_walk',
            frames: scene.anims.generateFrameNumbers('player_walk_32x32', { start: 0, end: 4}),
            frameRate: 10,
            repeat: -1,
            repeatDelay: 0
        };
        scene.anims.create(walkAnim);
        this.originX = 0.5;
        this.originY = 0.5;
        
        this.anims.play("player_idle");

        this.setInteractive();
        this.on('pointerdown', () => {
            console.log('clicked player');
        });
    }

    update() {
        // if (this.cursors.down.isDown) {
        if (this.nextDest != null){
            this.anims.play("player_walk", true);
        } else {
            this.anims.play("player_idle", true);
        }

        if (this.speed.x < 0) this.flipX = true;
        else if (this.speed.x > 0) this.flipX = false;

        if (this.nextDest != null) {
            this.moveNextStep();
        }
        this.depth = this.y - 4;
    }
    
    destroy() {
        this.destroyAllDots();
        super.destroy()
    }

    // Movement

    private dest: {i: number, j: number};
    private path: {x: number, y: number}[];
    private pathDots: Phaser.GameObjects.Image[];
    public handleMoveTouch(dest: {x: number, y: number}, grid: TileGrid) {
        let gridDest = grid.worldToGrid(dest.x, dest.y);
        let gridPos = grid.worldToGrid(this.x, this.y);

        //  if there's no dest or new dest given, find new path
        if (this.dest == null || this.dest.i != gridDest.i || this.dest.j != gridDest.j) {
            this.dest = gridDest;
            grid.findPath(gridPos.j, gridPos.i, gridDest.j, gridDest.i, (path) => {
                this.path = path;
                this.drawPathDots(grid);
            }); 
        } else {
            // destination confirmed, start moving
            this.startMoving(grid);
        }
    }

    private nextDest: {x: number, y:number};
    private pathBySteps: {x: number, y:number}[];
    private speed: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private startMoving(grid: TileGrid) {
        if (this.path == null) return;
        
        this.pathBySteps = [];
        
        let start = null
        for (let step of this.path) {
            let gridPos = {i: step.y, j: step.x};
            let worldPos = grid.gridToWorld(gridPos.i, gridPos.j);
            if (start == null) {
                start = worldPos
            } else {
                this.pathBySteps.push(worldPos);
            }
        }
        this.nextDest = this.pathBySteps[0];
        
        this.destroyNextDot();
    }

    private moveNextStep() {
        let distance = 1;
        let finished = this.stepTowards(this.nextDest.x + 16, this.nextDest.y + 16, distance);
        if (finished) {
            // finished stp
            this.pathBySteps.splice(0, 1);
            if (this.pathBySteps.length > 0) {
                this.nextDest = this.pathBySteps[0];

                this.destroyNextDot();
            } else {
                // finished path
                this.nextDest = null;
                this.destroyNextDot();
            }
        }
    }

    private stepTowards(x: number, y: number, distance: number): boolean {
        this.speed.x = x - this.x;
        this.speed.y = y - this.y;
        if (this.speed.length() <= distance) {
            this.x = x;
            this.y = y;
            return true;
        }
        this.speed = this.normalize(this.speed, distance);
        this.x += this.speed.x;
        this.y += this.speed.y;
        return false;
    }

    private normalize(vec: Phaser.Math.Vector2, newLen: number):Phaser.Math.Vector2 {
        var len = vec.x * vec.x + vec.y * vec.y;
        if (len > 0) {
            len = newLen / Math.sqrt(len);
            vec.x = vec.x * len;
            vec.y = vec.y * len;
        }
        return vec;
    }


    // dot path images

    private drawPathDots(grid: TileGrid) {
        this.destroyAllDots();

        if (this.path == null) {
            return;
        }

        let dots = [];
        for (let pos of this.path) {
            let worldPos = grid.gridToWorld(pos.y, pos.x);
            let img = this.scene.add.image(worldPos.x + 16, worldPos.y + 16, "path_mid_14x14");
            dots.push(img)
        }
        this.pathDots = dots;
    }

    private destroyNextDot() {
        if (this.pathDots.length > 0) {
            this.pathDots.splice(0, 1)[0].destroy();
        }
    }

    private destroyAllDots() {
        if (this.pathDots) {
            for (let dot of this.pathDots) {
                dot.destroy()
            }
            this.pathDots = null;
        }
    }

}