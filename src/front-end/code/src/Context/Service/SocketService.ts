import { io, Socket } from "socket.io-client";
import { RequestService } from "./RequestService";
import { address, STATUS_SUCCESS } from "../../Const";
import { Triggers, UtilService } from "./UtilService";


export class SocketService {
    
    private socket : Socket | undefined
    private readonly requestService : RequestService
    private readonly utilService : UtilService
    private allFriendsList : any[]
    listFriends : any[]
    listNotification : any[]


    constructor(requestService : RequestService, utilService : UtilService) {
        this.requestService = requestService
        this.utilService = utilService
        this.listFriends = []
        this.listNotification = []
        this.allFriendsList = []
    }

    private async getListNotification() {
        const res = await this.requestService.getNotification()
        if (res.status === STATUS_SUCCESS) {
            this.listNotification = res.data
            this.utilService.trigger(Triggers.RefreshNotification)
        }
    }


    private async getListOfAllFriends() {
        const res = await this.requestService.getAllUserFriends()
        if (res.status === STATUS_SUCCESS) {
            this.allFriendsList = res.data
            this.utilService.trigger(Triggers.RefreshListFriend)
        }
    }


    setUpSocket() {

        this.getListNotification()
        this.getListOfAllFriends()

        this.socket = io(`http://${address}`, {
            extraHeaders: {
                Authorization: `Bearer ${this.requestService.getAuthService.getAccessToken}`
            }
        })


        this.socket.on("connect", () => {
            console.log("Connected")
        })

        this.socket.on("disconnect", () => {
            console.log("disconnected")
        })

        //******************************** friends

        this.socket.on("newFriendOnline", (data : any) => {
            console.log("newFriendOnline", data)
            let isExist = this.listFriends.find((item : any) => item.id === data?.user?.id)
            if (!isExist && data?.user) {
                this.listFriends.push(data.user)
                this.utilService.trigger(Triggers.RefreshListFriend)
                this.utilService.trigger(Triggers.RefreshProfileImageOfOnlineFriend)
            }
        })
    
        //!unfriend
        //!online friend with new friend
        this.socket.on("friendDisconnect", (data : any) => {
            console.log("friendDisconnect", data)
            this.listFriends = this.listFriends.filter((item : any) => item.id !== data?.user?.id)
            this.utilService.trigger(Triggers.RefreshListFriend)
            this.utilService.trigger(Triggers.RefreshProfileImageOfOnlineFriend)
        })

        this.socket.on("myOnlineFriends", (data : any[]) => {
            console.log("myOnlineFriends", data)
            this.listFriends = data
            this.utilService.trigger(Triggers.RefreshListFriend)
            this.utilService.trigger(Triggers.RefreshProfileImageOfOnlineFriend)
        })


        //******************************** Notification

        this.socket.on("new_notification", (data : any) => {
            this.listNotification.push(data.notification)
            this.utilService.trigger(Triggers.RefreshNotification)
            this.utilService.trigger(Triggers.RefreshProfile)
        })


    }

    //******************************** Friends Utils */

    isFriendOnline(friendId : number) {
        const isFriend = this.allFriendsList.find((item : any) => item.id === friendId)
        if (isFriend && this.requestService.getAuthService.user && friendId !== this.requestService.getAuthService.user.id) {
            const isOnline = this.listFriends.find((item : any) => item.id === friendId)
            if (isOnline)
                return (true)
            return (false)
        }
        return (undefined)
    }

    //******************************** Notification Utils */

    deleteNotification(notificationId : number) {
        this.listNotification = this.listNotification.filter((a : any) => {
            return a.id !== notificationId
        })
    }


    //******************************** Socket Utils */

    emitEvent(event : string, payload : any = {}) {
        this.socket?.emit(event, payload)
    }

    on(event : string, callBack : any) {
        console.log(event, "On")
        this.socket?.on(event, callBack)
    }

    off(event : string) {
        console.log(event, "Off")
        this.socket?.off(event)
    }

    getSocket() {
        return this.socket
    }
}
