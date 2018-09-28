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
  icon: string;
  name: string;
  units: Array<UnitData>;
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
      icon: "infantry_1_icon",
      name: "Infantry",
      units: [
        {
          id: "type_1_unit_1",
          icon: "infantry_1_icon",
          health: 1,
          energy: 1,
          quantity: 99
        },
        {
          id: "type_1_unit_2",
          icon: "infantry_1_icon",
          health: 0.5,
          energy: 0.9,
          quantity: 20
        }
      ]
    });

    for (let i in [0, 1]) {
      this.data.unitTypes.push({
        icon: "infantry_2_icon",
        name: "Archers",
        units: [
          {
            id: 'type_' + (i + 2) + '_unit_1',
            icon: "infantry_1_icon",
            health: Math.random(),
            energy: Math.random(),
            quantity: Math.floor(Math.random() * 10) * 10
          },
          {
            id: 'type_' + (i + 2) + '_unit_2',
            icon: "infantry_1_icon",
            health: Math.random(),
            energy: Math.random(),
            quantity: Math.floor(Math.random() * 10) * 10
          }
        ]
      });
    }

  }
}
