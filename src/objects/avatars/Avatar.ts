import {RoomObject} from "../rooms/RoomObject";
import {IFloorPosition} from "../../interfaces/Furniture.interface";
import {Direction} from "../../enums/Direction";
import {AvatarAction} from "./actions/AvatarAction";
import {
    IAvatarConfiguration,
    AvatarFigure,
    IAvatarPart,
} from "../../interfaces/Avatar.interface";
import {AvatarUtil} from "../../utilities/AvatarUtil";
import {gsap} from "gsap";
import {AvatarActionManager} from "./actions/AvatarActionManager";
import {AvatarAnimationManager} from "./animations/AvatarAnimationManager";
import {AvatarBodyPart} from "./AvatarBodyPart";
import {AvatarLayer} from "./AvatarLayer";
import {Assets} from "pixi.js";

export class Avatar extends RoomObject {

    private _figure: AvatarFigure;

    private _position: IFloorPosition;

    private _bodyDirection: Direction;

    private _headDirection: Direction;

    private _actions: AvatarAction[];

    private _actionManager: AvatarActionManager;
    private _animationManager: AvatarAnimationManager;
    private _bodyParts: AvatarBodyPart[] = [];

    constructor(
        configuration: IAvatarConfiguration
    ) {
        super();

        this._figure = this._parseFigure(configuration.figure);
        this._position = configuration.position;
        this._headDirection = configuration.headDirection;
        this._bodyDirection = configuration.bodyDirection;
        this._actions = configuration.actions;

        this._actionManager = new AvatarActionManager(AvatarAction.Default);
        this._animationManager = new AvatarAnimationManager();
        this._actions.forEach((action: AvatarAction) => this._animationManager.registerAnimation(action));

        this._figure.forEach((set: { setId: number, colors: number[] }, type: string) => {
            const parts: IAvatarPart[] = this._getParts(type, set.setId);
            this._bodyParts.push(new AvatarBodyPart(this, {
                type: type,
                setId: set.setId,
                colors: set.colors,
                parts: parts,
                actions: this._actions
            }));
        });
    }

    private _draw(): void {
        this._destroyParts();
        if(Assets.get("figures/hh_human_body") === undefined) {
            Assets.add("figures/hh_human_body", "http://localhost:8081/figure/hh_human_body/hh_human_body.json");
            Assets.load("figures/hh_human_body").then(() => this._createShadow());
        } else {
            this._createShadow();
        }
        this._bodyParts.forEach((bodyPart: AvatarBodyPart) => bodyPart.updateParts());

        this.x = 32 * this._position.x - 32 * this._position.y;
        this.y = 16 * this._position.x + 16 * this._position.y - 32 * this._position.z;
    }

    private _parseFigure(figure: string): AvatarFigure {
        return new Map(figure.split(".").map(part => {
            const data: string[] = part.split("-");
            return [
                data[0],
                {
                    setId: Number(data[1]),
                    colors: data.splice(2, 2).map(color => {
                        return Number(color);
                    })
                },
            ] as const;
        }));
    }

    private _getParts(type: string, setId: number): IAvatarPart[] {
        const figureData: [] = Assets.get('figures/figuredata');
        const figureMap: [] = Assets.get('figures/figuremap');
        const hiddenLayers: [] = figureData.settype[type]?.set[setId]["hiddenLayers"];
        let parts = [];
        let set = figureData.settype[type]?.set[setId];
        set?.parts.forEach((part) => {
            let libId = figureMap.parts[part.type][String(part.id)];
            let lib = figureMap.libs[libId];
            //console.log(part.type, libId);
            part.lib = lib;
            parts.push(part);
        });
        if(hiddenLayers !== undefined) {
            parts = parts.filter(part => !hiddenLayers.includes(part.type));
        }
        return parts;
    }

    /**
     * On each animation tick
     * @private
     */
    private _onTicker(): void {
        this._draw();
    }

    /**
     * Start the furniture animation
     */
    public startAnimation(): void {
        this.animationTicker.add(() => this._onTicker());
    }

    /**
     * Stop the furniture animation
     */
    public stopAnimation(): void {
        this.animationTicker.remove(() => this._onTicker());
    }

    private _createPlaceholder(): void {

    }

    private _createShadow(): void {
        this.addChild(new AvatarLayer(this, {
            type: "sd",
            part: { id: 1, lib: { id: "hh_human_body" }},
            gesture: "std",
            tint: undefined,
            z: 0,
            flip: true,
            direction: 0,
            frame: 0,
            alpha: 0.1
        }));
    }

    private _destroyParts(): void {
        while(this.children[0]) {
            this.removeChild(this.children[0]);
        }
    }

    public get pos(): IFloorPosition {
        return this._position;
    }

    public set pos(position: IFloorPosition) {
        gsap.to(this, {
            x: 32 * position.x - 32 * position.y, y: 16 * position.x + 16 * position.y - 32 * position.z, duration: 0.5, ease: "linear", onComplete: () => {
                this._position = position;
            }
        });
    }

    public get actions(): AvatarAction[] {
        return this._actions;
    }

    public get headDirection(): Direction {
        return this._headDirection;
    }

    public get bodyDirection(): Direction {
        return this._bodyDirection;
    }

    public get actionManager(): AvatarActionManager {
        return this._actionManager;
    }

    public get animationManager(): AvatarAnimationManager {
        return this._animationManager;
    }

}