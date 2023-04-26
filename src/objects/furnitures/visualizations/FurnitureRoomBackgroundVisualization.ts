import { FurnitureVisualization } from './FurnitureVisualization';

/**
 * FurnitureGuildCustomizedVisualization class for the guild furnitures.
 *
 * @class
 * @memberof Scuti
 */
export class FurnitureRoomBackgroundVisualization extends FurnitureVisualization {
  /**
   * The image url.
   *
   * @member {string}
   * @private
   */
  private _imageUrl = '';

  /**
   * The image offset X.
   *
   * @member {number}
   * @private
   */
  private _offsetX = 0;

  /**
   * The image offset Y.
   *
   * @member {number}
   * @private
   */
  private _offsetY = 0;

  /**
   * The image offset Z.
   *
   * @member {number}
   * @private
   */
  private _offsetZ = 0;

  /**
   * Reference to the imageUrl.
   *
   * @member {string}
   * @readonly
   * @public
   */
  public get imageUrl(): string {
    return this._imageUrl;
  }

  /**
   * Update the imageUrl.
   *
   * @param {number} [imageUrl] - The image link.
   * @public
   */
  public set imageUrl(imageUrl: string) {
    this._imageUrl = imageUrl;
    this.furniture.view.update();
  }

  /**
   * Reference to the offsetX.
   *
   * @member {number}
   * @readonly
   * @public
   */
  public get offsetX(): number {
    return this._offsetX;
  }

  /**
   * Update the offsetX.
   *
   * @param {number} [offsetX] - The new offsetX.
   * @public
   */
  public set offsetX(offsetX: number) {
    this._offsetX = offsetX;
    this.furniture.view.update();
  }

  /**
   * Reference to the offsetY.
   *
   * @member {number}
   * @readonly
   * @public
   */
  public get offsetY(): number {
    return this._offsetY;
  }

  /**
   * Update the offsetY.
   *
   * @param {number} [offsetY] - The new offsetY.
   * @public
   */
  public set offsetY(offsetY: number) {
    this._offsetY = offsetY;
    this.furniture.view.update();
  }

  /**
   * Reference to the offsetZ.
   *
   * @member {number}
   * @readonly
   * @public
   */
  public get offsetZ(): number {
    return this._offsetZ;
  }

  /**
   * Update the offsetZ.
   *
   * @param {number} [offsetZ] - The new offsetZ.
   * @public
   */
  public set offsetZ(offsetZ: number) {
    this._offsetZ = offsetZ;
    this.furniture.view.update();
  }
}
