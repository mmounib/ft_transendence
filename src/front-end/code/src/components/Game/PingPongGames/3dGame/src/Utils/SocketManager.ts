import { Game } from "../MyObjects/Game";
import { Socket, io } from 'socket.io-client'
import { LiveData } from "../interfaces/interface.live.data";
import { GameState } from "../../../GameState";

export class SocketManager {

    socket : Socket

    constructor(game : Game) {
        this.socket = this.getSocket(game)
    }

    hitBall(payload : any) {
        if (!this.socket)
            return
        this.socket.emit("hitBall", payload)
    }

    lose(payload : any) {
        if (!this.socket)
            return
        this.socket.emit("lose", payload)
    }

    racketMove(payload : any) {
        if (!this.socket)
            return
        //payload.position
        
        payload.position = payload.position.clone()
        payload.position.z *= -1
        payload.position.x *= -1
        this.socket.emit("moveRacket", payload)
    }
    
    //###########################################
    //###########################################
    //###########################################

    socketOn(socket : Socket, game : Game) {
        if (!game.gameParams.isWatchMode) {
            socket.on("start", (data : any) => {
                game.start(data)
            })
        
            socket.on("end_game", (data : any) => {
                game.end(data)
            })
            
            socket.on("ballInfo", (data : any) => {
                game.ballObj.socketGetBallInfo(data)
            })
        
        
            socket.on("moveRacket", (data : any) => {
                game.player2.socketMoveRacket(data)
            })
        
            socket.on("gameScore", (data : any) => {
                game.changeScore(data)
            })
        
            socket.on("turn", (data : any) => {
                game.gameInfo.turn = data.turn
            })

            socket.on("exception", (data : any) => {
                game.gameParams.callBack(GameState.gameException)
                //console.log("exception",  data)
            })
        
        } else {

            socket.on("live_data", (data : LiveData) => {
                game.changeScore({
                    score : data.score.reverse()
                })
                game.ballObj.socketGetBallInfo(data.ballInfo)
                game.player2.socketMoveRacket({position: data.racketPlayer1Pos})
                game.racketObj.socketMoveRacket({position: data.racketPlayer2Pos})
            })

        }
    }

    getSocket(game : Game) {
        // const socket = io(this.socketAddr , {
        //     extraHeaders: {
        //         Authorization: `Bearer ${game.gameParams.authToken}`
        //     }
        // })

        const socket = game.gameParams.socket
        
        //socket.on("connect", () => {
            //console.log("Client is connected")
        
            //after connecting
            socket.emit("join_game", ({
                isClassic : false,
                isBotMode : game.gameParams.isBotMode,
                isWatchMode : game.gameParams.isWatchMode,
                token : game.gameParams.gameToken,
                userToInvite : game.gameParams.userToInvite,
            }))
        
            // socket.on('disconnected', () => {
            //     socket.emit('leave', "aaa");
            // });

            // socket.on("disconnect", () => {
            //     //console.log("Disconnected", socket.id)
            // })

        //})
    

        this.socketOn(socket, game)
    
        return (socket)
    }
    

    stop() {
        this.socket.off("start")
        this.socket.off("end_game")
        this.socket.off("ballInfo")
        this.socket.off("moveRacket")
        this.socket.off("gameScore")
        this.socket.off("turn")
        this.socket.off("live_data")
        this.socket.off("connect")
        this.socket.off("exception")
        //this.socket.disconnect()
    }
}