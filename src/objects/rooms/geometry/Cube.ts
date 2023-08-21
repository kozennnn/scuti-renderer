import { Color, Container, Graphics, Matrix } from "pixi.js";
import { FloorMaterial } from "../materials/FloorMaterial.ts";
import { ICubeConfiguration } from "../../../interfaces/ICubeConfiguration.ts";
import { CubeFace } from "../../../enums/CubeFace.ts";
import { WallMaterial } from "../materials/WallMaterial.ts";

export class Cube extends Container {
    public faces: Record<CubeFace, Graphics> = {}
    constructor(
        public configuration: ICubeConfiguration
    ) {
        super();

        this._initialize();
    }

    private _initialize(): void {
        const material: FloorMaterial | WallMaterial = this.configuration.material ?? new FloorMaterial(101);
        this.faces[CubeFace.TOP] = new Graphics()
            .beginTextureFill({
                texture: material.texture,
                color: new Color(material.color).premultiply(1).toNumber(),
                matrix: new Matrix(
                    1,
                    0.5,
                    1, -0.5,
                    this.configuration.offsets?.[CubeFace.TOP]?.x ?? 0,
                    this.configuration.offsets?.[CubeFace.TOP]?.y ?? 0
                    //1 % 2 === 0 ? 32 : 64,
                    //1 % 2 === 0 ? 16 : 0
                )
            })
            .moveTo(0, 0)
            .lineTo(32 * this.configuration.size.y, -16 * this.configuration.size.y)
            .lineTo(32 * (this.configuration.size.x + 1) + 32 * (this.configuration.size.y - 1), -16 * (this.configuration.size.y - 1) + 16 * (this.configuration.size.x - 1))
            .lineTo(32 * this.configuration.size.x, 16 * this.configuration.size.x)
            .lineTo(0, 0)
            .endFill();
        this.faces[CubeFace.LEFT] = new Graphics()
            .beginTextureFill({
                texture: material.texture,
                color: new Color(material.color).premultiply(0.8).toNumber(),
                matrix: new Matrix(
                    1,
                    0.5,
                    0,
                    1,
                    this.configuration.offsets?.[CubeFace.LEFT]?.x ?? 0,
                    this.configuration.offsets?.[CubeFace.LEFT]?.y ?? 0
                )
            })
            .moveTo(0, 0)
            .lineTo(0, this.configuration.size.z * 32)
            .lineTo(32 * this.configuration.size.x, 16 * this.configuration.size.x + this.configuration.size.z * 32)
            .lineTo(32 * this.configuration.size.x, 16 * this.configuration.size.x)
            .endFill();
        this.faces[CubeFace.RIGHT] = new Graphics()
            .beginTextureFill({
                texture: material.texture,
                color: new Color(material.color).premultiply(0.71).toNumber(),
                matrix: new Matrix(
                    1,
                    -0.5,
                    0,
                    1,
                    this.configuration.offsets?.[CubeFace.RIGHT]?.x ?? 0,
                    this.configuration.offsets?.[CubeFace.RIGHT]?.y ?? 0
                )
            })
            .moveTo(32 * this.configuration.size.x, 16 * this.configuration.size.x)
            .lineTo(32 * this.configuration.size.x, 16 * this.configuration.size.x + this.configuration.size.z * 32)
            .lineTo(32 * (this.configuration.size.x + 1) + 32 * (this.configuration.size.y - 1), -16 * (this.configuration.size.y - 1) + 16 * (this.configuration.size.x - 1) + this.configuration.size.z * 32)
            .lineTo(32 * (this.configuration.size.x + 1) + 32 * (this.configuration.size.y - 1), -16 * (this.configuration.size.y - 1) + 16 * (this.configuration.size.x - 1))
            .lineTo(32 * this.configuration.size.x, 16 * this.configuration.size.x)
            .endFill();

        if (this.configuration.layer) {
            this.faces[CubeFace.TOP].parentLayer = this.configuration.layer;
            this.faces[CubeFace.TOP].zOrder = this.configuration.zOrders?.[CubeFace.TOP] ?? 0;
            this.faces[CubeFace.LEFT].parentLayer = this.configuration.layer;
            this.faces[CubeFace.LEFT].zOrder = this.configuration.zOrders?.[CubeFace.LEFT] ?? 0;
            this.faces[CubeFace.RIGHT].parentLayer = this.configuration.layer;
            this.faces[CubeFace.RIGHT].zOrder = this.configuration.zOrders?.[CubeFace.RIGHT] ?? 0;
        }

        this.addChild(this.faces[CubeFace.TOP]);
        this.addChild(this.faces[CubeFace.LEFT]);
        this.addChild(this.faces[CubeFace.RIGHT]);
    }
}
