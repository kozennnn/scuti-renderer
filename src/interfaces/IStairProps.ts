import { Texture } from 'pixi.js';
import {StairType} from "../types/StairCornerType";

export interface IStairProps {
    color: number,
    tileThickness: number,
    texture?: Texture,
    direction: number,
    type: StairType
}