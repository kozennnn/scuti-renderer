import { Assets, Sprite, Texture } from 'pixi.js'

import { Material } from './Material'
import type { Scuti } from '../../../Scuti'

export class WallMaterial extends Material {
  /**
   * The game engine instance that the room will be using to render texture.
   *
   * @member {Scuti}
   * @private
   */
  private readonly _engine: Scuti

  /**
   * The material id from materials.json.
   *
   * @member {number}
   * @private
   */
  private readonly _id: number

  /**
   * @param {Scuti} [engine] - The scuti engine instance to use.
   * @param {number} [id] - The id of the material (it can be found into materials.json).
   **/
  constructor(engine: Scuti, id: number) {
    super(0xffffff, Texture.WHITE)

    this._engine = engine
    this._id = id
    /** Load the material */
    this._load()
  }

  /**
   * Load the material.
   *
   * @return {void}
   * @private
   */
  private _load(): void {
    const materials: { wallData: { textures: [] } } = Assets.get('room/materials')
    // @ts-expect-error
    const material: { id: string; visualizations: [] } = materials.wallData.walls.find((material) => {
      return material.id === this._id.toString()
    })
    // @ts-expect-error
    const { color, materialId } = material.visualizations[0].layers[0]
    // @ts-expect-error
    const materialTexture: { id: string; bitmaps: [] } = materials.wallData.textures.find((texture) => {
      // @ts-expect-error
      return texture.id === materialId.toString()
    })
    // @ts-expect-error
    const name: string = materialTexture.bitmaps[0].assetName
    const texture: Texture = Assets.get('room/room').textures[`room_${name}.png`]
    const sprite: Sprite = new Sprite(texture)
    this.color = color
    this.texture = new Texture(this._engine.application.renderer.generateTexture(sprite).baseTexture)
  }
}
