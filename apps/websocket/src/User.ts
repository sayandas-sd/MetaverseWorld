import { WebSocket } from "ws";
import { Room } from "./Room";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

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
    public userId?: string; 
    private spaceId?: string;
    private x: number;
    private y: number;

    constructor(private ws: WebSocket) {
        this.id = getRandomString(10);
        this.x = 0;
        this.y = 0;
    }

    initHandler() {
       this.ws.on("message", async (data)=>{
            const parseData = JSON.parse(data.toString());

            switch(parseData.type) {

                case "join":
                    const spaceId = parseData.payload.spaceId;
                    const token = parseData.payload.token;
                    const userId = (jwt.verify(token, JWT_SECRET) as JwtPayload).userId

                    if(userId!) {
                        this.ws.close()
                        return
                    }

                    this.userId = userId
                    
                    const space = await client.space.findFirst({
                        where: {
                            id: spaceId
                        }
                    })
                    
                    if(!space) {
                        this.ws.close()
                        return;
                    }

                    this.spaceId = spaceId;

                    Room.getInstance().addUser(spaceId, this);

                    this.x = Math.floor(Math.random() * space?.width);
                    this.y = Math.floor(Math.random() * space?.height);

                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            users: Room.getInstance().rooms.get(spaceId)?.map((u) => ({id: u.id})) ?? []
                        }
                    });

                    Room.getInstance().broadCast({
                        type: "user-joined",
                        payload: {
                            userId: this.id,
                            x: this.x,
                            y: this.y
                        }
                        
                    })

                case "move": 
                    const movex = parseData.payload.x;
                    const movey = parseData.payload.y;
                    const xDisplacement = Math.abs(this.x - movex);
                    const yDisplacement = Math.abs(this.y - movey);
                    
                    if ((xDisplacement == 1 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 1)) {
                        this.x = movex;
                        this.y = movey;

                        Room.getInstance().broadCast({
                            type: "move",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        }, this, this.spaceId!);
                        return;
                    }
                    
                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y
                        }
                    })

            }
       })
    }

    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }
}