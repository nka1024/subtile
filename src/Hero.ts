/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  subtile
* @license      Apache 2.0
*/

export type UnitData = {
  id: string;
  icon: string;
  health: number;
  energy: number;
  quantity: number;
}

export type UnitTypeData = {
  id: string;
  icon: string;
  name: string;
  health: number;
  energy: number;
  quantity: number;
}

export type HeroData = {
  unitTypes: Array<UnitTypeData>;
}

export class Hero {
  public data: HeroData;
  constructor() {
    this.createTestData();
  }

  public static makeHeroConf(): UnitData {
    return {
      id: "hero_squad",
      icon: "infantry_1_icon",
      health: 1,
      energy: 1,
      quantity: 1
    };
  }

  public static makeReconSquadConf(): UnitData {
    return {
      id: "recon_squad",
      icon: "infantry_1_icon",
      health: 1,
      energy: 1,
      quantity: 1
    };
  }

  public static makeRogueSquadConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      health: 1,
      energy: 1,
      quantity: 99
    };
  }

  private createTestData() {
    this.data = { unitTypes: [] };
    this.data.unitTypes.push({
      id: "type_1_unit_1",
      icon: "infantry_1_icon",
      name: "Infantry",
      health: 1,
      energy: 1,
      quantity: 99
    });

    for (let i in [0, 1]) {
      this.data.unitTypes.push({
        id: 'type_' + (i + 2) + '_unit_1',
        icon: "infantry_2_icon",
        name: "Archers",
        health: Math.random(),
        energy: Math.random(),
        quantity: Math.floor(Math.random() * 10) * 10
      });
    }

  }
}
