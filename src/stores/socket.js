import { defineStore } from 'pinia';
import { Socket, Presence } from 'phoenix';


const baseURL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000" // Local development
  : "http://116.203.210.54:4001"; // Production
export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: null,
        channel: null,
        presence: null
    }),
    
    actions: {
        connect(token) {
            return new Promise((resolve, reject) => {
                this.socket = new Socket(baseURL, { params: { token } });
                this.socket.connect();
                
                this.socket.onOpen(() => {
                    resolve();
                });
                
                this.socket.onError((error) => {
                    reject(error);
                });
            });
        },
        
        joinChannel(channelName, params) {
            return new Promise((resolve, reject) => {
                this.channel = this.socket.channel(channelName, params);
                this.presence = new Presence(this.channel);
                
                this.channel.join()
                    .receive("ok", resp => {
                        resolve(resp);
                    })
                    .receive("error", resp => {
                        reject(resp);
                    });
            });
        },


        leaveChannel() {
            if (this.channel) {
                this.channel.leave();
                this.channel = null;
                this.presence = null;
            }
        },

        disconnect() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
                this.channel = null;
                this.presence = null;
            }
        },
        push(event, payload) {
        return new Promise((resolve, reject) => {
            this.channel.push(event, payload)
                .receive("ok", resp => resolve(resp))
                .receive("error", resp => reject(resp));
        });
    }

       
     
    }
});
