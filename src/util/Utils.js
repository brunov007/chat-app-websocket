import Rooms from '../domains/Rooms.js'

export default class Utils{
    
    static createRoom(server, limit){
        const rooms = [];
    
        for (let num=1; num <= limit; num++) {
            let roomName = 'sala' + num;
            rooms.push(new Rooms(roomName, server));
        }
    
        return rooms;
    }

    static customMessage(header, content){
        return (JSON.stringify({
            header,
            content
        }));
    }
}