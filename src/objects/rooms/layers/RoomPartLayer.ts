import type { Room } from '../Room';
import { RoomPart } from "../parts/RoomPart";
import {EventManager} from "../../interactions/EventManager";
import {IPosition2D} from "../../../interfaces/Room";
import {Tile} from "../parts/Tile";
import {Stair} from "../parts/Stair";
import {Point} from "pixi.js";

/**
 * RoomPartLayer class that manage all the room parts.
 *
 * @class
 * @memberof Scuti
 */
export class RoomPartLayer {
  /**
   * The room instance that will be managed by the camera.
   *
   * @member {Room}
   * @private
   */
  private readonly _room: Room;

  /**
   * The part list.
   *
   * @member {RoomPart[]}
   * @private
   */
  private _parts: RoomPart[] = [];

  /**
   * The room tiles interaction manager.
   *
   * @member {EventManager}
   * @private
   */
  private readonly _tileInteractionManager = new EventManager();

  /**
   * The room walls interaction manager.
   *
   * @member {EventManager}
   * @private
   */
  private readonly _wallInteractionManager = new EventManager();

  /**
   * @param {Room} [room] - The room instance that we want to visualize.
   */
  constructor(room: Room) {
    this._room = room;
  }

  /**
   * Add the given room part into the part layer of the room.
   *
   * @param {RoomPart} [part] - The room part that we want to add.
   * @return {void}
   * @public
   */
  public add(part: RoomPart): void {
    this._parts.push(part);
    console.log(this._room);
  }

  /**
   * Return the part at the specified screen position.
   *
   * @param {IPosition2D} [position] - The screen position.
   * @return {Tile | Stair}
   * @public
   */
  public getFromGlobal(position: IPosition2D): Tile | Stair {
    const container = this._room.visualization.objectContainer.children.find((container) => {
      const point = new Point(position.x, position.y);
      if (Boolean(container.hitArea?.contains(container.toLocal(point).x, container.toLocal(point).y)))
        return container;
    });

    // @ts-expect-error
    return container;
  }

  /**
   * Return the tile event manager.
   *
   * @return {EventManager}
   * @public
   */
  public get tiles(): EventManager {
    return this._tileInteractionManager;
  }

  /**
   * Return the wall event manager.
   *
   * @return {EventManager}
   * @public
   */
  public get walls(): EventManager {
    return this._wallInteractionManager;
  }
}