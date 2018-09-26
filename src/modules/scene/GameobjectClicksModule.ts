/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export class GameobjectClicksModule extends Phaser.Events.EventEmitter{
  private scene: Phaser.Scene;
  private groups: Array<Phaser.GameObjects.Group>;

  constructor(scene: Phaser.Scene) {
    super();
    this.groups = [];
    this.scene = scene;
  }

  private trackClicks(object: Phaser.GameObjects.GameObject) {
    object.on('pointerdown', () => {
      this.emit('click', object);
    })
  }

  private untrackClicks(object: Phaser.GameObjects.GameObject) {
    object.off('pointerdown', null, null, false);
  }

  public addObjectsGroup(group: Phaser.GameObjects.Group) {
    this.groups.push(group);

    group.createCallback = (item: Phaser.GameObjects.GameObject) => {
      this.trackClicks(item);
    };
    group.removeCallback = (item: Phaser.GameObjects.GameObject) => {
      this.untrackClicks(item);
    };
  }

  public removeObjectsGroup(group: Phaser.GameObjects.Group) {
    // remove listeners from all objects in group
    for (let object of group.children.entries) {
      this.untrackClicks(object);
    }
    // remove group from groups array
    this.groups = this.groups.filter((grp, idx, array) => {
      return grp != group;
    });
  }
}