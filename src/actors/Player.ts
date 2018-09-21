/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class Player extends Phaser.GameObjects.Sprite {
    private wKey:Phaser.Input.Keyboard.Key;
    private cursors: any;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        
        super(scene, x, y, "player_idle_32x32");

        this.wKey = scene.input.keyboard.addKey('W');
        this.cursors = scene.input.keyboard.createCursorKeys();

        var idleAnim = {
            key: 'player_idle',
            frames: scene.anims.generateFrameNumbers('player_idle_32x32', { start: 0, end: 4}),
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
        this.scaleX = 1;
        this.scaleY = 1;
        this.originX = 0.5;
        this.originY = 1;
        
        this.anims.play("player_idle");
        scene.input.keyboard.on('keydown_C', function (event) { console.log('sdds')});
    }

    update() {
        if (this.cursors.down.isDown) {
            console.log('s')
            this.anims.play("player_walk", true);
        } else {
            this.anims.play("player_idle", true);
        }

        this.flipX = true;
    }

}