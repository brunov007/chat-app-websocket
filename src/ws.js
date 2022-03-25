import { WebSocketServer } from 'ws'
import Services from './domains/Services.js'
import Utils from './util/Utils.js'

const WebSocketRuning = app => {
    const server = new WebSocketServer({ server: app });
    const rooms = Utils.createRoom(server, 3);

    // connection init
    server.on('connection', (ws, request) => {

        const services = new Services(ws, server);

        // Event Message On
        ws.on('message', msg => {
            const { header, content } = JSON.parse(msg.toString());
            const { type } = header;

            switch(type) {
                case 'request-status-rooms':
                    services.responseStatusRooms(rooms);
                    break;
                    
                case 'request-register':
                    services.requestRegister(request, content, rooms);
                    break;
                
                case 'user-msg-server':
                    services.userMsgServer(header, content, rooms);
                    break;
                
                case 'request-list-members':
                    services.requestListMembers(rooms, content.roomName);
                    break;
            }
        });

        // Event Close On
        ws.on('close', () => {
            if (ws.header) {
                const room = rooms.find(room => room.roomName === ws.header.roomName);
                room.removeClienteToPlace(ws);
                services.requestListMembers(rooms, ws.header.roomName);
            }

            services.responseStatusRooms(rooms);
        });
    });
}

export default WebSocketRuning;