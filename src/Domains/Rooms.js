export default class Rooms {
    colors = ["#98092b","#df931b", "#45ada8","#0a996f", "#7b6ed6", "#fd65a0", "#8e3f65", "#a8c030", "#836177"]

    constructor(roomName, server, limitPlaces = 4) {
        this.roomName = roomName;
        this.server = server;
        this.limitPlaces = limitPlaces;
        this.clients = [];
    }

    get colors(){
        return this.colors
    }

    addClientToPlace(ws) {
        if (this.clients.length < this.limitPlaces) {
            this.clients.push(ws);
        }
    }

    removeClienteToPlace(ws) {
        const index = this.clients.indexOf(ws);
        this.clients.splice(index, 1);
    }
}