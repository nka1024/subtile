/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/


export type UnitData = {
  id: string;
  icon: string;
  name: string;
  health: number;
  energy: number;
  range: number;
  quantity: number;
  type: string // archers, infantry, hero, scout
}

export type HeroData = {
  units: Array<UnitData>;
}

export class Hero {
  public data: HeroData;
  constructor() {
    this.createTestData();
  }

  public static makeHeroConf(): UnitData {
    return {
      id: "hero_squad",
      name: "Hiro",
      icon: "infantry_1_icon",
      type: "hero",
      health: 1,
      energy: 1,
      range: 1,
      quantity: 1,
    };
  }

  public static makeReconSquadConf(): UnitData {
    return {
      id: "recon_squad",
      name: "Scouts",
      icon: "infantry_1_icon",
      type: "scout",
      health: 1,
      energy: 1,
      range: 1,
      quantity: 1
    };
  }

  public static makeRogueSquadConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      name: "Rogues",
      type: "infantry",
      health: 1,
      energy: 1,
      range: 1,
      quantity: 99
    };
  }

  private createTestData() {
    this.data = { units: [] };
    this.data.units.push({
      id: "type_1_unit_1",
      icon: "archers_1_icon",
      name: "Archers",
      type: "archers",
      health: 1,
      energy: 1,
      range: 2,
      quantity: 99
    });

    for (let i in [0, 1,2,3,4]) {
      this.data.units.push({
        id: 'type_' + (i + 2) + '_unit_1',
        icon: "infantry_2_icon",
        name: "Infantry",
        type: "infantry",
        range: 1,
        health: Math.random(),
        energy: Math.random(),
        quantity: Math.floor(Math.random() * 10) * 10
      });
    }

  }
}
