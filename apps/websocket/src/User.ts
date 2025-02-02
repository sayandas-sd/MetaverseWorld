import { WebSocket } from "ws";
import { Room } from "./Room";
import { OutgoingMessage } from "./types";

function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkImnopqrstuvwxyz0123456789";
    let result = "";
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result;
}


export class User{
    
    public id: string;

    constructor(private ws: WebSocket) {
        this.id = getRandomString(10);
    }

    initHandler() {
       this.ws.on("message", (data)=>{
            const parseData = JSON.parse(data.toString());
            switch(parseData.type) {
                case "join":
                    const spaceId = parseData.payload.spaceId;
                    Room.addUser(spaceId, this)
            }
       })
    }

    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }
}