import { Container, Ticker } from 'pixi.js';

import type { Room } from './Room';
import type { IPosition3D, ITileInfo } from '../../types/Room';
import { Tile } from './parts/Tile';
import { Wall } from './parts/Wall';
import { Stair } from './parts/Stair';
import { WallType } from '../../enums/WallType';
import type { StairType } from '../../enums/StairType';
import { Cursor } from './parts/Cursor';
import { RoomObjectLayer } from './layers/RoomObjectLayer';
import { RoomPartLayer } from './layers/RoomPartLayer';

/**
 * RoomView class that manage all the rendering part of the room.
 *
 * @class
 * @memberof Scuti
 */
export class RoomVisualization extends Container {
  /**
   * The room instance that will be managed by the camera.
   *
   * @member {Room}
   * @private
   */
  private readonly _room: Room;

  /**
   * The container that will contains all the objects like avatars or furnitures.
   *
   * @member {RoomObjectLayer}
   * @private
   */
  private readonly _objectLayer: RoomObjectLayer;

  /**
   * The container that will contains all the parts like tiles, walls and stairs.
   *
   * @member {RoomPartLayer}
   * @private
   */
  private readonly _partLayer: RoomPartLayer;

  /**
   * List containing all the walls instances.
   *
   * @member {Wall}
   * @private
   */
  private _walls: Wall[] = [];

  /**
   * List containing all the tiles and stairs instances.
   *
   * @member {Tile | Stair}
   * @private
   */
  private _tiles: Array<Tile | Stair> = [];

  /**
   * Infos related to the door tile.
   *
   * @member {ITileInfo}
   * @private
   */
  private _doorTile!: ITileInfo;

  /**
   * The room tile cursor instance.
   *
   * @member {Cursor}
   * @private
   */
  private _cursor!: Cursor;

  /**
   * The room animation ticker instance that will manage all the objects animations
   *
   * @member {Ticker}
   * @private
   */
  private readonly _animationTicker = new Ticker();

  /**
   * @param {Room} [room] - The room instance that we want to visualize.
   */
  constructor(room: Room) {
    super();

    this._room = room;
    this._objectLayer = new RoomObjectLayer(this._room);
    this._partLayer = new RoomPartLayer(this._room);

    /** Start the animation ticker */
    this._animationTicker.maxFPS = 4;
    this._animationTicker.start();

    /** Render everything */
    this._draw();
  }

  /**
   * Draw the room visualization with all the tiles and walls.
   *
   * @return {void}
   * @private
   */
  private _draw(): void {
    this._destroyParts();
    this._destroyCursor();

    for (let y = 0; y < this._room.tileMap.tileMap.length; y++) {
      for (let x = 0; x < this._room.tileMap.tileMap[y].length; x++) {
        const tileInfo = this._room.tileMap.getTileInfo({ x, y });

        // todo: avoid duplicate tile doors
        if (tileInfo.door && this._doorTile != null) tileInfo.door = false;
        if (tileInfo.door && this._doorTile == null) this._doorTile = tileInfo;

        this._createPart(tileInfo, { x, y, z: tileInfo.height });
      }
    }
  }

  /**
   * Destroy all the parts (tiles, walls, stairs, ...).
   *
   * @return {void}
   * @private
   */
  private _destroyParts(): void {
    [...this._tiles, ...this._walls].forEach((part) => part.destroy());
    this._tiles = [];
    this._walls = [];
  }

  /**
   * Rerender all the room visualization.
   *
   * @return {void}
   * @private
   */
  public update(): void {
    this._draw();
  }

  /**
   * Create a room part and add it into the visualization.
   *
   * @param {ITileInfo} [tileInfo] - The tile informations where we want to create the part.
   * @param {IPosition3D} [position] - And the position.
   * @return {void}
   * @private
   */
  private _createPart(tileInfo: ITileInfo, position: IPosition3D): void {
    if (tileInfo.wallType !== null || tileInfo.door) {
      if (
        tileInfo.wallType === WallType.CORNER_WALL &&
        !this._room.tileMap.hasWall(position).x &&
        !this._room.tileMap.hasWall(position).y
      ) {
        this._createWall(position, WallType.CORNER_WALL);
        this._createWall(position, WallType.LEFT_WALL);
        this._createWall(position, WallType.RIGHT_WALL);
      } else if (tileInfo.wallType === WallType.CORNER_WALL && !this._room.tileMap.hasWall(position).x) {
        this._createWall(position, WallType.LEFT_WALL);
      } else if (tileInfo.wallType === WallType.CORNER_WALL && !this._room.tileMap.hasWall(position).y) {
        this._createWall(position, WallType.RIGHT_WALL);
      }

      if (tileInfo.wallType === WallType.LEFT_WALL && !this._room.tileMap.hasWall(position).y)
        this._createWall(position, WallType.LEFT_WALL);
      if (tileInfo.wallType === WallType.RIGHT_WALL && !this._room.tileMap.hasWall(position).y)
        this._createWall(position, WallType.RIGHT_WALL);

      if (tileInfo.door) this._createWall(position, WallType.DOOR_WALL);
    }

    if (tileInfo.stairType != null) {
      position.direction = tileInfo.stairType.direction;
      this._createStair(position, tileInfo.stairType.type);
    } else if (tileInfo.door) {
      this._createDoor(position);
    } else if (tileInfo.tile) {
      this._createTile(position, tileInfo);
    }
  }

  /**
   * Destroy the current cursor and draw a new one at the new position.
   *
   * @param {IPosition3D} [position] - The cursor position.
   * @return {void}
   * @private
   */
  private _createCursor(position: IPosition3D): void {
    if (this._cursor != null) {
      this._cursor.visible = true;
      return this._cursor.moveTo(position);
    }

    this._destroyCursor();
    const cursor = new Cursor(this._room, { position });
    this.addChild(cursor);
    this._cursor = cursor;
  }

  /**
   * Destroy the room cursor
   *
   * @return {void}
   * @private
   */
  private _destroyCursor(): void {
    if (this._cursor != null) this._cursor.visible = false;
  }

  /**
   * Create a tile.
   *
   * @param {IPosition3D} [position] - The tile position.
   * @param {ITileInfo} [tileInfo]
   * @return {void}
   * @private
   */
  private _createTile(position: IPosition3D, tileInfo: ITileInfo): void {
    const tile = new Tile(
      this._room,
      { position, material: this._room.floorMaterial, thickness: this._room.floorThickness },
      tileInfo
    );

    /** Register interactions */
    tile.onPointerDown = (event) => {
      if (this._partLayer.tiles.onPointerDown != null) this._partLayer.tiles.onPointerDown(event);
    };
    tile.onPointerUp = (event) => {
      if (this._partLayer.tiles.onPointerUp != null) this._partLayer.tiles.onPointerUp(event);
    };
    tile.onPointerMove = (event) => {
      if (this._partLayer.tiles.onPointerMove != null) this._partLayer.tiles.onPointerMove(event);
    };
    tile.onPointerOut = (event) => {
      if (this._partLayer.tiles.onPointerOut != null) this._partLayer.tiles.onPointerOut(event);
      this._destroyCursor();
    };
    tile.onPointerOver = (event) => {
      if (this._partLayer.tiles.onPointerOver != null) this._partLayer.tiles.onPointerOver(event);
      this._createCursor(position);
    };
    tile.onDoubleClick = (event) => {
      if (this._partLayer.tiles.onDoubleClick != null) this._partLayer.tiles.onDoubleClick(event);
    };

    this.addChild(tile);
    this._tiles.push(tile);
  }

  /**
   * Create a door.
   *
   * @param {IPosition3D} [position] - The door position.
   * @return {void}
   * @private
   */
  private _createDoor(position: IPosition3D): void {
    const tile = new Tile(this._room, { position, material: this._room.floorMaterial });

    /** Register interactions */
    tile.onPointerDown = (event) => {
      if (this._partLayer.tiles.onPointerDown != null) this._partLayer.tiles.onPointerDown(event);
    };
    tile.onPointerUp = (event) => {
      if (this._partLayer.tiles.onPointerUp != null) this._partLayer.tiles.onPointerUp(event);
    };
    tile.onPointerMove = (event) => {
      if (this._partLayer.tiles.onPointerMove != null) this._partLayer.tiles.onPointerMove(event);
    };
    tile.onPointerOut = (event) => {
      if (this._partLayer.tiles.onPointerOut != null) this._partLayer.tiles.onPointerOut(event);
      this._destroyCursor();
    };
    tile.onPointerOver = (event) => {
      if (this._partLayer.tiles.onPointerOver != null) this._partLayer.tiles.onPointerOver(event);
      this._createCursor(position);
    };
    tile.onDoubleClick = (event) => {
      if (this._partLayer.tiles.onDoubleClick != null) this._partLayer.tiles.onDoubleClick(event);
    };

    this.addChild(tile);
    this._tiles.push(tile);
  }

  /**
   * Create a wall.
   *
   * @param {IPosition3D} [position] - The wall position.
   * @param {WallType} [type] - The wall type.
   * @return {void}
   * @private
   */
  private _createWall(position: IPosition3D, type: WallType): void {
    const wall = new Wall(this._room, {
      position,
      material: this._room.wallMaterial,
      thickness: this._room.wallThickness,
      height: this._room.wallHeight,
      type
    });

    // todo!(): register event interactions for walls */

    this.addChild(wall);
    this._walls.push(wall);
  }

  /**
   * Create stairs.
   *
   * @param {IPosition3D} [position] - The stairs position.
   * @param {StairType} [type] - The stairs type.
   * @return {void}
   * @private
   */
  private _createStair(position: IPosition3D, type: StairType): void {
    const stair = new Stair(this._room, {
      position,
      material: this._room.floorMaterial,
      thickness: this._room.floorThickness,
      type
    });

    /** Register interactions */
    stair.onPointerDown = (event) => {
      if (this._partLayer.tiles.onPointerDown != null) this._partLayer.tiles.onPointerDown(event);
    };
    stair.onPointerUp = (event) => {
      if (this._partLayer.tiles.onPointerUp != null) this._partLayer.tiles.onPointerUp(event);
    };
    stair.onPointerMove = (event) => {
      if (this._partLayer.tiles.onPointerMove != null) this._partLayer.tiles.onPointerMove(event);
    };
    stair.onPointerOut = (event) => {
      if (this._partLayer.tiles.onPointerOut != null) this._partLayer.tiles.onPointerOut(event);
      this._destroyCursor();
    };
    stair.onPointerOver = (event) => {
      if (this._partLayer.tiles.onPointerOver != null) this._partLayer.tiles.onPointerOver(event);
      this._createCursor(position);
    };
    stair.onDoubleClick = (event) => {
      if (this._partLayer.tiles.onDoubleClick != null) this._partLayer.tiles.onDoubleClick(event);
    };

    this.addChild(stair);
    this._tiles.push(stair);
  }

  /**
   * Reference to the room visualization room instance.
   *
   * @member {Room}
   * @readonly
   * @public
   */
  public get room(): Room {
    return this._room;
  }

  /**
   * Reference to the object layer container.
   *
   * @member {RoomObjectLayer}
   * @readonly
   * @public
   */
  public get objectLayer(): RoomObjectLayer {
    return this._objectLayer;
  }

  /**
   * Reference to the part layer container.
   *
   * @member {RoomObjectLayer}
   * @readonly
   * @public
   */
  public get partLayer(): RoomPartLayer {
    return this._partLayer;
  }

  /**
   * Reference to the room animation ticker instance.
   *
   * @member {Ticker}
   * @readonly
   * @public
   */
  public get animationTicker(): Ticker {
    return this._animationTicker;
  }
}
