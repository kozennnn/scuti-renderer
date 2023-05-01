import { FurnitureVisualization } from '../FurnitureVisualization';
import { FurnitureLayer } from '../FurnitureLayer';
import type { IFurnitureLayerData, IFurnitureVisualization } from '../../../interfaces/Furniture';
import { FloorFurniture } from "../FloorFurniture";
import { WallFurniture } from "../WallFurniture";

export class FurnitureAnimatedVisualization extends FurnitureVisualization {
  private readonly _frames: Map<number, number> = new Map();

  constructor(furniture: FloorFurniture | WallFurniture) {
    super(furniture);
  }

  public render(): void {
    this.destroy();
    for (let i = 0; i < this._properties.visualization.layerCount; i++) {
      this.renderLayer(i, this._frames.get(i) ?? 0);
    }
  }

  public renderLayer(layer: number, frame: number): void {
    const visualization: IFurnitureVisualization = this._properties.visualization;
    const furnitureLayer: FurnitureLayer | undefined = this._layers.get(layer);

    if (furnitureLayer != null) furnitureLayer.destroy();

    if (
      this._properties.infos.visualization === 'furniture_animated' &&
      visualization.animation[this._furniture.state] === undefined
    ) {
      this._furniture.state = Number(Object.keys(visualization.animation)[0]);
      return;
    }
    const layerData: IFurnitureLayerData = this.layerData(layer, frame);

    if (!visualization.directions.includes(this._furniture.direction))
      this._furniture.rotate(visualization.directions[0], 0);

    if (
      visualization.animation[this._furniture.state] !== undefined &&
      visualization.animation[this._furniture.state][layer] !== undefined &&
      visualization.animation[this._furniture.state][layer].frameSequence.length > 1
    )
      layerData.frame = frame;

    if (
      visualization.animation[this._furniture.state] !== undefined &&
      visualization.animation[this._furniture.state][layer] !== undefined
    )
      layerData.frame = visualization.animation[this._furniture.state][layer].frameSequence[layerData.frame] ?? 0;

    const layerContainer = new FurnitureLayer(this._furniture, {
      layer: layerData.layer,
      alpha: layerData.alpha,
      tint: layerData.tint,
      z: layerData.z,
      blendMode: layerData.blendMode,
      flip: layerData.flip,
      frame: layerData.frame,
      ignoreMouse: layerData.ignoreMouse,
      direction: this._furniture.direction,
      tag: layerData.tag
    });
    layerContainer.zIndex = layerData.z;
    this._layers.set(layer, layerContainer);
    if (this._furniture.room != null) {
      this._furniture.room.visualization.objectContainer.addChild(
        // @ts-expect-error
        layerContainer
      );
      this.updateLayerPosition(layer);
    }
    layerContainer.filters = this._furniture.filters; // TODO: Move this to global
  }

  public update(): void {
    const visualization: IFurnitureVisualization = this._properties.visualization;
    for (let i = 0; i < this._properties.visualization.layerCount; i++) {
      if (
        // @ts-expect-error
        visualization.animation[String(this._furniture.state)] !== undefined &&
        // @ts-expect-error
        visualization.animation[String(this._furniture.state)][i] !== undefined
      ) {
        // @ts-expect-error
        const frameSequence: number[] = visualization.animation[String(this._furniture.state)][i].frameSequence;
        const currentFrame = this._frames.get(i) ?? 0;
        if (frameSequence.length > 1) {
          if (frameSequence.length - 1 > currentFrame) {
            this._frames.set(i, currentFrame + 1);
          } else {
            this._frames.set(i, 0);
          }
          this.renderLayer(i, this._frames.get(i) ?? 0);
        } else {
          if (this._layers.get(i) == null) this.renderLayer(i, 0);
        }
      } else {
        if (this._layers.get(i) == null) this.renderLayer(i, 0);
      }
    }
  }
}