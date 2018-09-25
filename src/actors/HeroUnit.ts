/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

import { TileGrid } from "../TileGrid";
import { IUnit } from "../actors/IUnit"
import { UnitMoverModule } from "../modules/unit/UnitMoverModule";

export class HeroUnit extends Phaser.GameObjects.Sprite implements IUnit {

    public mover: UnitMoverModule;

    constructor(scene: Phaser.Scene, x: number, y: number, grid:TileGrid) {
        super(scene, x, y, "player_idle_32x32");
        
        this.setInteractive();
        this.mover = new UnitMoverModule(this, scene, grid);

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

        this.anims.play("player_idle");
    }

    update() {
        this.mover.update();
        this.depth = this.y - 4;
    }
    
    destroy() {
        this.mover.destroy();
        super.destroy()
    }

    public playUnitAnim(key:string, ignoreIfPlaying:boolean) {
        let anim = 'player_' + key;
        this.anims.play(anim, ignoreIfPlaying);
    }
   
}