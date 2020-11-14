import $ from "jquery";
import {client} from "../../../main";
import {RoomEngine} from "../../../rooms/RoomEngine";
import {store} from "../../../../interface/store/store";


export class LoadRoomMessage {
    constructor(packet) {
        this.packet = packet;
    }

    execute() {
        store.state.visibility.landingview = false;
        store.state.visibility.navigator = false;

        var heightmap = this.packet.data["heightmap"]
        var floorThickness = this.packet.data["floorThickness"]
        var wallHeight = this.packet.data["wallHeight"]
        var furnitures = this.packet.data["furnitures"]

        store.state.currentRoom.name = this.packet.data["name"]
        store.state.currentRoom.owner_name = this.packet.data["ownerName"]

        console.log(this.packet.data);


        client.currentRoom = new RoomEngine(client.app,client.container, {
            'floor': heightmap,
            'tileThickness': floorThickness,
            'wallHeight': wallHeight,
            'furnitures': furnitures

        }).renderRoom();


    }
}