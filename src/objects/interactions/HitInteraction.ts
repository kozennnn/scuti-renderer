import {Container, Graphics, Point} from "pixi.js"

export const handleClick = (stage: Container, event): void => {
    stage.children.forEach((container: Container) => {
        container.children.forEach((object: Container) => {
            let highestSprite;
            // @ts-ignore
            object.children[0].children.forEach((sprite) => {
                if(sprite.isSprite && (sprite as any).containsPoint) {
                    if(sprite.containsPoint(new Point(event.data.global.x, event.data.global.y))) {
                        if(!highestSprite) {
                            highestSprite = sprite;
                        } else {
                            if(sprite.zOrder > highestSprite.zOrder) {
                                highestSprite = sprite;
                            }
                        }
                    }
                }
                if(sprite instanceof Graphics) {
                    if(sprite.containsPoint(new Point(event.data.global.x, event.data.global.y))) {
                        // @ts-ignore
                        object.click();
                    }
                }
            });
            if(highestSprite) highestSprite.click();
        });
    });
}

export const handleDoubleClick = (stage: Container, event): void => {
    stage.children.forEach((container: Container) => {
        container.children.forEach((object: Container) => {
            let highestSprite;
            // @ts-ignore
            object.children[0].children.forEach((sprite) => {
                if(sprite.isSprite && (sprite as any).containsPoint) {
                    if(sprite.containsPoint(new Point(event.data.global.x, event.data.global.y))) {
                        if(!highestSprite) {
                            highestSprite = sprite;
                        } else {
                            if(sprite.zOrder > highestSprite.zOrder) {
                                highestSprite = sprite;
                            }
                        }
                    }
                }
                if(sprite instanceof Graphics) {
                    if(sprite.containsPoint(new Point(event.data.global.x, event.data.global.y))) {
                        // @ts-ignore
                        object.click();
                    }
                }
            });
            if(highestSprite) highestSprite.dblclick();
        });
    });
}

export const handleMouseMove = (stage: Container, event): void => {
    stage.children.forEach((container: Container) => {
        let hoveredTile;
        container.children.forEach((object: Container) => {
            let highestSprite;
            // @ts-ignore
            object.children[0].children.forEach((sprite) => {
                if(sprite.isSprite && (sprite as any).containsPoint) {
                    if(sprite.containsPoint(new Point(event.data.global.x, event.data.global.y))) {
                        if(!highestSprite) {
                            highestSprite = sprite;
                        } else {
                            if(sprite.zOrder > highestSprite.zOrder) {
                                highestSprite = sprite;
                            }
                        }
                    }
                }
                if(sprite instanceof Graphics) {
                    if(sprite.containsPoint(new Point(event.data.global.x, event.data.global.y))) {
                        hoveredTile = object;
                        // @ts-ignore
                        object.mouseover();
                    }
                }
            });
            //if(highestSprite) highestSprite.mousemove(); TODO: Implement mouse mouvement interaction.
        });
    });
}