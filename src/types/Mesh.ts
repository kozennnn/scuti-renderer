import { Vector2D, Vector3D } from './Vector';
import { Direction } from '../enums/Direction';
import { StairType } from '../enums/StairType';

export type TileMesh = {
  position: Vector3D;
  size: Vector2D;
  door: boolean;
};

export type StairMesh = {
  position: Vector3D;
  length: number;
  direction: Direction;
  corners: {
    left: StairType;
    right: StairType;
  };
};

export type WallMesh = {
  position: Vector3D;
  length: number;
  direction: Direction;
  corner: boolean;
  door?: number;
};
