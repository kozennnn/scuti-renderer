import * as PIXI from 'pixi.js';
import {client} from "../../../../main";

export class DoorObject extends PIXI.Graphics {
    constructor(container, coords) {
        super();

        this.coords = coords;
        this.container = container;
    }

    drawTile() {
        this.first = { x: this.coords.x, y: this.coords.y };
        this.second = { x: this.coords.x + 32, y: this.coords.y - 16 };
        this.third = { x: this.second.x + 32, y: this.first.y };
        this.fourth = { x: this.second.x, y: this.first.y + 16 };
        this.thikness = {
            first: { x: this.first.x, y: this.first.y },
            second: { x: this.first.x, y: this.first.y + 0.5 },
            third: { x: this.fourth.x , y: this.fourth.y + 0.5 },
            fourth: { x: this.third.x, y: this.third.y + 0.5 },
            fifth: { x: this.third.x, y: this.third.y },
            sixth: { x: this.fourth.x , y: this.fourth.y }
        };

        this.lineStyle({
            width: 0.5,
            color: "0x8E8E5E",
            alignment: 0,
        });
        this.beginFill("0x989865");
        this.moveTo(this.first.x, this.first.y);
        this.lineTo(this.second.x, this.second.y);
        this.lineTo(this.third.x, this.third.y);
        this.lineTo(this.fourth.x, this.fourth.y);
        this.lineTo(this.first.x, this.first.y);
        this.endFill();

        // thik
        this.lineStyle(1, "0x7A7A51");
        this.beginFill("0x838357");
        this.moveTo(this.thikness.first.x, this.thikness.first.y);
        this.lineTo(this.thikness.second.x, this.thikness.second.y);
        this.lineTo(this.thikness.third.x, this.thikness.third.y);
        this.lineTo(this.fourth.x, this.fourth.y);
        this.endFill();

        this.lineStyle(1, "0x676744");
        this.beginFill("0x6F6F49");
        this.moveTo(this.fourth.x, this.fourth.y);
        this.lineTo(this.thikness.third.x, this.thikness.third.y);
        this.lineTo(this.thikness.fourth.x, this.thikness.fourth.y);
        this.lineTo(this.third.x, this.third.y);
        this.lineStyle({ width: 0 })
        this.lineTo(this.fourth.x, this.fourth.y);
        this.container.addChild(this);
        this.interactive = true;

        this.mouseover = function(mouseData) {
            client.getCurrentRoom().tileCursor.visibility(1);
            client.getCurrentRoom().tileCursor.set({x: this.coords.x - 24, y: this.coords.y + 48});
        }

        this.mouseout = function(mouseData) {
            client.getCurrentRoom().tileCursor.visibility(0);
        }

        this.click = function(mouseData) {
        }
    }

    drawWall(wallThickness, tileThickness, tileHeight, zMax) {

        let wall = new PIXI.Container();
        let color = "0xB6B8C7";

        console.log("wall door enft");

        this.wallThickness = wallThickness;
        this.tileThickness = tileThickness;
        this.tileHeight = tileHeight;
        this.zMax = zMax;
        this.coords.x = this.coords.x - this.wallThickness + 32
        this.coords.y = this.coords.y - this.wallThickness / 2 + this.tileThickness - 70
        this.first = { x: this.coords.x, y: this.coords.y - 37 - this.zMax * 32 + this.tileHeight * 32};
        this.second = { x: this.first.x + 32, y: this.first.y - 16 };
        this.third = { x: this.second.x + this.wallThickness, y: this.second.y + this.wallThickness / 2 };
        this.fourth = { x: this.third.x - 32, y: this.third.y + 16 };

        this.thikness = {
            first: { x: this.first.x, y: this.first.y },
            second: { x: this.first.x, y: this.first.y + 37 + this.zMax * 32 - this.tileHeight * 32 },
            third: { x: this.fourth.x , y: this.fourth.y + 37 + this.zMax * 32 - this.tileHeight * 32 },
            fourth: { x: this.third.x, y: this.third.y + 37 + this.zMax * 32 - this.tileHeight * 32 },
            fifth: { x: this.third.x, y: this.third.y },
            sixth: { x: this.fourth.x , y: this.fourth.y }
        };

        let top = new PIXI.Graphics()
            .beginFill("0xFFFFFF")
            .moveTo(this.first.x, this.first.y)
            .lineTo(this.second.x, this.second.y)
            .lineTo(this.third.x, this.third.y)
            .lineTo(this.fourth.x, this.fourth.y)
            .lineTo(this.first.x, this.first.y)
            .endFill();

        let right = new PIXI.Graphics()
            .beginFill("0xFFFFFF")
            .moveTo(this.fourth.x, this.fourth.y)
            .lineTo(this.thikness.third.x, this.thikness.third.y)
            .lineTo(this.thikness.fourth.x, this.thikness.fourth.y)
            .lineTo(this.third.x, this.third.y)
            .lineTo(this.fourth.x, this.fourth.y)
            .endFill();

        // Todo: wall color system

        top.tint = PIXI.utils.premultiplyTint(color, 0.61);
        right.tint = PIXI.utils.premultiplyTint(color, 0.8);

        wall.addChild(top);
        wall.addChild(right);

        this.container.addChild(wall);
    }

}