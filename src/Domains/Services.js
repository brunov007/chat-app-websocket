import ClientHeader from "./ClientHeader.js";
import Chatbot from "../chatbot/config.js"
import Register from "./Register.js";
import Member from "./Member.js"
import BaseService from "./BaseService.js";
import Utils from '../util/Utils.js'

export default class Services extends BaseService {
    
    constructor(ws, server) {
        super(ws, server)
    }
    
    responseStatusRooms(rooms) {
        const header = { type: 'response-status-rooms'};
        const content = { rooms: [] };

        rooms.forEach(room => {
            content.rooms.push({
                roomName: room.roomName,
                inRoom: room.clients.length,
                limitPlaces: room.limitPlaces
            });
        });

        //Trocar para broadcast
        this._server.clients.forEach(client => {
            if (client && !client.header) client.send(Utils.customMessage(header, content));
        });
    }


    requestRegister({headers}, {nickname, roomName}, rooms) {
        this._ws.header = new ClientHeader(
            headers['sec-websocket-key'],
            nickname,
            roomName
        );

        const room = this.findRoomByName(rooms, roomName);
        room.addClientToPlace(this._ws);

        this._ws.header.color = this.changeRoomColor(room)

        const resContent = {
            accept: true,
            id: this._ws.header.id,
            color: this._ws.header.color
        }

        this._ws.send(Utils.customMessage({ type: 'response-register' }, resContent));
    }

    requestListMembers(rooms, roomName) {
        const members = [];
        const room = this.findRoomByName(rooms, roomName);

        room.clients.forEach(client => {
            members.push({
                nickname: client.header.nickname,
                color: client.header.color
            });
        });
        
        room.clients.forEach(client => {
            client.send(Utils.customMessage({ type:'response-list-members' }, { members}));
        })
    }


    userMsgServer(header, {message}, rooms){

        const {id, roomName, nickname} = header

        /* Pegando o socket do usuario que enviou a msg
            const wsUserMsg = this._server.clients.find(client => {
                return this._server.clients.header ? client.header.id === idUserMsg ? client : null : null
            })
        */

        // Enviando a msg para os membros da Room "sala"
        const room = this.findRoomByName(rooms, roomName);
        
        const clients = room.clients.filter(client => client.header.id != id)

        header.type = 'user-msg-room'

        clients.forEach(client => client ? client.send(Utils.customMessage(header, { message: message })) : null)
        
    }
}