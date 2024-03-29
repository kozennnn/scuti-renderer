import { RoomPart } from '../RoomPart';
import { Room } from '../../Room';
import { Container, FederatedPointerEvent, Graphics, Point, Polygon } from 'pixi.js';
import { FloorMaterial } from '../../materials/FloorMaterial';
import { Cube } from '../../geometry/Cube';
import { EventManager } from '../../../events/EventManager';
import { Vector2D, Vector3D } from '../../../../types/Vector';
import { CubeFace } from '../../../../enums/CubeFace';
import { floorOrder } from '../../../../utils/Sorting';

interface Configuration {
  material?: FloorMaterial;
  position: Vector3D;
  size: Vector2D;
  thickness: number;
  door?: boolean;
}

export class TilePart extends RoomPart {
  public room!: Room;
  public container: Container = new Container();
  public eventManager: EventManager = new EventManager();

  private _material: FloorMaterial;
  private _position: Vector3D;
  private _size: Vector2D;
  private _thickness: number;
  private _door: boolean;

  constructor({ material, position, size, thickness, door }: Configuration) {
    super();

    this._material = material ?? new FloorMaterial(101);
    this._position = position;
    this._size = size;
    this._thickness = thickness;
    this._door = door ?? false;

    this._registerEvents();
  }

  private _registerEvents(): void {
    this.container.onpointerdown = (event: FederatedPointerEvent) =>
      this.eventManager.handlePointerDown({
        position: this.getGlobalTilePosition(event.global),
        dragging: this.room.camera.hasDragged,
      });
    this.container.onpointerup = (event: FederatedPointerEvent) =>
      this.eventManager.handlePointerUp({
        position: this.getGlobalTilePosition(event.global),
        dragging: this.room.camera.hasDragged,
      });
    this.container.onpointermove = (event: FederatedPointerEvent) =>
      this.eventManager.handlePointerMove({
        position: this.getGlobalTilePosition(event.global),
        dragging: this.room.camera.hasDragged,
      });
    this.container.onpointerout = (event: FederatedPointerEvent) =>
      this.eventManager.handlePointerOut({
        position: this.getGlobalTilePosition(event.global),
        dragging: this.room.camera.hasDragged,
      });
    this.container.onpointerover = (event: FederatedPointerEvent) =>
      this.eventManager.handlePointerOver({
        position: this.getGlobalTilePosition(event.global),
        dragging: this.room.camera.hasDragged,
      });
  }

  public render(): void {
    let zOrder: number = floorOrder(this._position, this._size);

    if (this._door) zOrder = floorOrder(this._position, this._size, true);

    const position = this._containerPosition();
    const cube: Cube = new Cube({
      layer: this.room.renderer.layer,
      zOrders: {
        [CubeFace.TOP]: zOrder,
        [CubeFace.LEFT]: zOrder,
        [CubeFace.RIGHT]: zOrder,
      },
      texture: this._material.texture,
      color: this._material.color,
      size: {
        x: this._size.x,
        y: this._size.y,
        z: this._door ? 0 : this._thickness / 32,
      },
    });
    this.container.addChild(new Graphics().lineStyle(2, 0xff0000).drawPolygon(this._hitArea()).endFill());
    this.container.hitArea = this._hitArea();
    this.container.eventMode = 'static';
    this.container.x = position.x;
    this.container.y = position.y;

    this.container.addChild(cube);
  }

  public destroy() {
    if (this.container !== undefined) {
      this.container.destroy();
      this.container = undefined as any;
    }
  }

  private _hitArea(): Polygon {
    return new Polygon(
      new Point(0, 0),
      new Point(32 * this._size.y, -16 * this._size.y),
      new Point(32 * (this._size.x + 1) + 32 * (this._size.y - 1), -16 * (this._size.y - 1) + 16 * (this._size.x - 1)),
      new Point(32 * this._size.x, 16 * this._size.x),
      new Point(0, 0),
    );
  }

  private _containerPosition(): Vector2D {
    return {
      x: 32 * this._position.x - 32 * (this._position.y + this._size.y - 1),
      y: 16 * this._position.x + 16 * (this._position.y + this._size.y - 1) - 32 * this._position.z,
    };
  }

  public getGlobalTilePosition(point: Point): Vector3D {
    const localPosition: Point = this.container.toLocal(point);
    const localX: number = Math.floor(localPosition.x / 64 + localPosition.y / 32),
      localY: number = Math.floor(localPosition.y / 32 - localPosition.x / 64 - 0.01) + this._size.y;
    return {
      x: localX + this._position.x,
      y: localY + this._position.y,
      z: this._position.z,
    };
  }
}
