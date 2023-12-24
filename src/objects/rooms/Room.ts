import { Scuti } from '../../Scuti';
import { RoomVisualization } from './RoomVisualization';
import { RoomCamera } from './RoomCamera';
import { GameObject } from '../GameObject';
import { RoomHeightmap } from './RoomHeightmap';
import { Configuration, RoomConfiguration } from './RoomConfiguration';
import { RoomEvents } from './RoomEvents';

export class Room extends GameObject {
  public renderer!: Scuti;
  public heightMap!: RoomHeightmap;
  public visualization!: RoomVisualization;
  public camera!: RoomCamera;
  public configuration: RoomConfiguration;
  public events!: RoomEvents;

  constructor(configuration: Omit<Configuration, 'room'>) {
    super();

    this.configuration = new RoomConfiguration({ ...configuration, ...{ room: this } });
    this.configuration.floorMaterial.room = this;
    this.configuration.wallMaterial.room = this;
  }

  public render(): void {
    this.heightMap = new RoomHeightmap(this.configuration.heightMap);
    this.visualization = new RoomVisualization(this);
    this.camera = new RoomCamera(this);
    this.events = new RoomEvents();
    //this.renderer.application.ticker.maxFPS = 144; todo(): Add configurable FPS

    this.visualization.render();
    this.renderer.application.stage.addChild(this.camera);
  }

  public update(): void {
    this.heightMap = new RoomHeightmap(this.configuration.heightMap);
    this.visualization.update();
  }
}
