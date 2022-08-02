import {RoomObject} from "../room/RoomObject";
import {IFloorFurnitureProps} from "../../interfaces/IFloorFurnitureProps";
import {BLEND_MODES, Container, Sprite, utils, Ticker} from "pixi.js";
import {FurnitureLayer} from "./FurnitureLayer";
import {Scuti} from "../../Scuti";

export class FloorFurniture extends RoomObject {

    private _engine: Scuti;

    private _x: number;
    private _y: number;
    private _z: number;
    private _direction: number;
    private _id: number;
    private _name: string;
    private _layers: Map<string, FurnitureLayer> = new Map();
    private _layersFrame: Map<number, number> = new Map();
    private _container?: Container;
    private _state: number;
    private _loaded: boolean = false;

    constructor(engine: Scuti, props: IFloorFurnitureProps) {
        super();

        this._engine = engine;

        this._x = props.x;
        this._y = props.y;
        this._z = props.z;
        this._direction = props.direction;
        this._state = props.state ?? 0;
        this._id = props.id;

        this._draw();

        /*setInterval(() => {
            this._nextFrame();
        }, 76.66);*/
    }

    private async _draw(): Promise<void> {

        if(!this._loaded) {
            this._createPlaceholder();
            await this._engine.furnitures.loadFurni(this._id).then((name: string) => {
                this._name = name;
                this._loaded = true;
            });
        }

        this._container?.destroy();
        this._container = new Container();

        this._container.sortableChildren = true;

        let furnitureData = this._engine.resources.get('furni/' + this._id);
        let visualization = furnitureData.data.furniProperty.visualization;

        for(let layerCount = 0; layerCount < visualization.layerCount; layerCount++) {
            let currentFrame = 0;
            if(visualization.animation[this._state][layerCount] !== undefined && visualization.animation[this._state][layerCount].frameSequence.length > 1) {
                if (this._layersFrame.has(layerCount)) {
                    currentFrame = visualization.animation[this._state][layerCount] !== undefined ? visualization.animation[this._state][layerCount].frameSequence[this._layersFrame.get(layerCount)] : 0;
                    this._layersFrame.set(layerCount, currentFrame);
                } else {
                    currentFrame = visualization.animation[this._state][layerCount].frameSequence[0];
                    this._layersFrame.set(layerCount, currentFrame);
                }
            } else if(visualization.animation[this._state][layerCount] !== undefined) {
                currentFrame = visualization.animation[this._state][layerCount].frameSequence[0];
            }

            let layerName = this._engine.furnitures.splitColorName(this._name).name + '_' + this._engine.furnitures.splitColorName(this._name).name + '_64_' + String.fromCharCode(97 + Number(layerCount)) + '_' + this._direction + '_' + (visualization.animation[this._state][layerCount] !== undefined ? currentFrame : 0);

            let layer = new FurnitureLayer({
                frame: currentFrame,
                texture: furnitureData.textures[layerName],
                name: layerName,
                alpha: visualization.layers[layerCount] ? visualization.layers[layerCount].alpha ? (visualization.layers[layerCount].alpha / 255) : undefined : undefined,
                tint: this._engine.furnitures.splitColorName(this._name).colorId ? visualization.colors[this._engine.furnitures.splitColorName(this._name).colorId][layerCount] !== undefined ? (('0x' + visualization.colors[this._engine.furnitures.splitColorName(this._name).colorId][layerCount])) : undefined : undefined,
                z: visualization.layers[layerCount] ? visualization.layers[layerCount].z ?? 0 : 0,
                blendMode: visualization.layers[layerCount] ? BLEND_MODES[visualization.layers[layerCount].ink] ?? BLEND_MODES.NORMAL : BLEND_MODES.NORMAL

            });
            this._layers.set(layerName, layer);
            this._container.addChild(layer);
        }

        let shadowName = this._engine.furnitures.splitColorName(this._name).name + '_' + this._engine.furnitures.splitColorName(this._name).name + '_64_sd_' + this._direction + '_' + 0;
        let shadow = new FurnitureLayer({
            frame: 0,
            texture: furnitureData.textures[shadowName],
            name: shadowName,
            alpha: 0.19,
            tint: undefined,
            z: -1,
            blendMode: BLEND_MODES.ADD

        });

        this._layers.set(shadowName, shadow);
        this._container.addChild(shadow);

        this.addChild(this._container);
        this.x = 32 + 32 * this._x - 32 * this._y;
        this.y = 16 * this._x + 16 * this._y - 32 * this._z;

    }

    private _createPlaceholder(): void {

        this._container?.destroy();
        this._container = new Container();

        let placeholder = new Sprite(this._engine.resources.get('place_holder_furniture').textures['place_holder_furniture_64.png'])

        this._container.addChild(placeholder);

        this.addChild(this._container);

        this.x = 32 * this._x - 32 * this._y - 1;
        this.y = 16 * this._x + 16 * this._y - 32 * this._z - 50;
        this.zIndex = 2;

    }

    private _nextFrame(): void {
        this._layersFrame.forEach((frame: number, layer: number) => {
            let furnitureData = this._engine.resources.get('furni/' + this._id);
            let visualization = furnitureData.data.furniProperty.visualization;
            if(visualization.animation[this._state][layer] !== undefined) {
                let frameSequence = visualization.animation[this._state][layer].frameSequence;
                let currentFrame = frame;
                if ((frameSequence.length - 1) < currentFrame)  {
                    this._layersFrame.set(layer, 0);
                }
                this._draw();

            }

        });
    }

    private _onTick(): void {
        this._nextFrame();
    }

    public animate() {
        this.animationTicker.maxFPS = 15.666;
        this.animationTicker.start();
        this.animationTicker.add(() => {
            this._onTick();
        });
    }

}