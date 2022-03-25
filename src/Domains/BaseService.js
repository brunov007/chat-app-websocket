export default class BaseService{
    constructor(ws, server) {
        this._ws = ws;
        this._server = server;
    }

    findRoomByName(rooms, roomName){
        return rooms.find(room => room.roomName === roomName)
    }

    changeRoomColor(room){
        return room.colors[parseInt(Math.random() * (room.colors.length - 0) + 0)]
    }
}