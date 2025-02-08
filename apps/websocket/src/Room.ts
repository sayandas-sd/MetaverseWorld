import { OutgoingMessage } from "./types";
import { User } from "./User";


export class Room {

    rooms: Map<string, User[]> = new Map();

    static instance: Room;

    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {

        if(!this.instance) {
            this.instance = new Room();
        }
        return this.instance;
    }

    public removeuser(user: User, spaceId: string) {
        if (!this.rooms.has(spaceId)) {
            return;
        }
        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? []));
    }

    public addUser(spaceId: string, user: User) {

        if(!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
            return;
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
    }

    public broadCast(message: OutgoingMessage, user: User, roomId: string) {
        if(this.rooms.has(roomId)) {
            return;
        }

        this.rooms.get(roomId)?.forEach((u) => {
            if(u.id !== user.id) {
                u.send((message))
            }
        });
    }
}