import './style.css';
import { Scuti } from '../../src/Scuti';
import { Room } from '../../src/objects/rooms/Room';
import { FloorMaterial } from '../../src/objects/rooms/materials/FloorMaterial';
import { TileEvent } from '../../src/entities/IEvents';
import { WallMaterial } from '../../src/objects/rooms/materials/WallMaterial';

const renderer: Scuti = new Scuti({
  canvas: document.getElementById('app') as HTMLElement,
  width: window.innerWidth,
  height: window.innerHeight,
  resources: 'http://127.0.0.1:8081',
  backgroundColor: 0x0c567c,
  resizeTo: window,
});

// @ts-ignore
await renderer.load();

/*const heightMap: string =`
xxxxxxxxxxxxxxxxxxxxxxxxxxxx
x2222xx1111111111xx11111111
x2222xx1111111111xx11111111
222222111111111111111111111
x22222111222222222211211111
x22222111111111111111211111
x22222111111111111111211111
x2222xx1112111111xx11222211
x2222xx1112211111xx11111111
x2222xx1222221111xxxx1111xx
x2222xx1112111111xxxx0000xx
xxxxxxx1111111111xx00000000
xxxxxxx1111111111xx00111000
x22222111111111111000122000
x22222111112111111000111000
x22222111122211111000111000
x22222111112111111000010000
x2222xx1111111111xx00000000
x2222xx1111111111xx00000000
x2222xxxx1111xxxxxxxxxxxxxx
x2222xxxx0000xxxxxxxxxxxxxx
x2222x0000000000xxxxxxxxxxx
x2222x0011111100xxxxxxxxxxx
x2222x0010000100xxxxxxxxxxx
x2222x0010000100xxxxxxxxxxx
x2222x0010000100xxxxxxxxxxx
x2222x0000000000xxxxxxxxxxx
`;*/

const heightMap: string = `
xxxxxxxxxx
3321000100
x100000000
x000000000
x000001000
xxx00111xx
xxx0001000
x00000x000
x00000xx00
x000xxxxx0
x400000000
x300000000
x200000000
x100000000
x000000000
`;

/*const heightMap: string = `
xxxxxxxxxx
3310000100
x200000000
x100000000
x000001000
xxx00111xx
xxx0001000
x00000x000
x00000xx00
x000xxxxx0
`;*/

const room: Room = new Room({
  heightMap: heightMap,
  dragging: true,
  centerCamera: true,
  floorMaterial: new FloorMaterial(101),
  floorThickness: 8,
  wallMaterial: new WallMaterial(108),
  wallThickness: 8,
  wallHeight: -1,
});

renderer.add(room);

let zoom = 1;
const [min_zoom, max_zoom] = [0.5, 5];

renderer.application.view.addEventListener(
  'wheel',
  // @ts-ignore
  ({ deltaY }) => {
    // todo(): add support accross browsers
    const delta = deltaY > 0 ? -0.25 : 0.25;

    zoom += delta;
    zoom = Math.max(min_zoom, Math.min(max_zoom, zoom));

    room.camera.zoom(zoom, 0.25);
  },
  { passive: true },
);

/*setInterval(() => {
    const random = Math.floor(Math.random() * (111 - 101 + 1)) + 101;
    room.configuration.floorMaterial = new FloorMaterial(random)
    room.configuration.floorThickness = 8;
}, 1000);*/

room.events.tiles.onPointerUp = (event: TileEvent) => {
  console.log(event.position);
};

//setTimeout(() => renderer.configuration.backgroundColor = 0xFF0000, 2000);
//setTimeout(() => renderer.configuration.width = 200, 3000);
//setTimeout(() => renderer.configuration.resizeTo = window, 4000);
//setTimeout(() => renderer.configuration.canvas = document.getElementById("stats") ?? document.body, 4000);

/*setTimeout(() => room.camera.zoom(2), 1000);
setTimeout(() => room.camera.zoom(4), 2000);
setTimeout(() => room.camera.zoom(5), 3000);
setTimeout(() => room.camera.zoom(8, 1), 4000);

setTimeout(() => room.camera.zoom(2), 5000);
setTimeout(() => room.camera.zoom(4), 6000);
setTimeout(() => room.camera.zoom(0.5), 7000);

setTimeout(() => room.camera.zoom(5), 8000);*/

/*setTimeout(() => room.camera.zoom = 3, 3000);
setTimeout(() => room.camera.zoom = 0.5, 4000);
setTimeout(() => room.camera.zoom = 2, 5000);
setTimeout(() => room.camera.zoom = 1, 6000);*/