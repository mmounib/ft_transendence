import { BadRequestException, Inject, Injectable, MethodNotAllowedException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IBlockedUsersRepository, IGamesRepository, IUserRepository } from '../repositories/repositories_interfaces';
import { MatchHistory, User } from 'src/database/entities';
import { IsNull, MoreThan, Not } from 'typeorm';
import { FriendsService } from '../friends/friends.service';

@Injectable()
export class GameService {

    
    constructor(
        @Inject("MyUserRepository") private readonly userRepository : IUserRepository,
        @Inject("MyGamesRepository") private readonly gamesRepository : IGamesRepository,
        private readonly friendsService: FriendsService
        ){}
    
    //user exists guard
    async getUserGamesHistory(user: User) {
        this.gamesRepository.findByCondition({
            where: [
                { player1: user, match_time_end: Not(IsNull()) },
                { player2: user, match_time_end: Not(IsNull()) }
            ]
        });
    }
    
    async getLiveGames(page: number = 1, pageSize: number = 10) {
        //make it bring only 10 games last started

        const rowsToSkip = (page - 1) * pageSize;
        const liveGames = await this.gamesRepository.findByOptions({
          take: pageSize,
          skip : rowsToSkip, 
          where : {
             player2 : Not(IsNull()),
             match_time_end: IsNull() 
          },
        });
        return liveGames;
    }
    
    //if User exist guards
    async createGame(player1: User,  gameType : boolean){
        
        const existingGame = await this.hasOpenGame(player1)
        if(existingGame && existingGame.player2)
            return ({
                message : "already have an on going game",
                inviteId : existingGame.token
            })
        if(existingGame)
            await this.gamesRepository.remove(existingGame);
        const game = await this.gamesRepository.create({
            player1,
            type : gameType
        });
        return ({
            inviteId : game.token
        })

    };

    async hasOpenGame(player1: User)
    {
        const existingGame = await this.gamesRepository.findOneByOptions({
            where : {
                player1,
                match_time_end: IsNull(),
            },
            relations : ["player2"]
        })
        return (existingGame);
    }
    // //player2 exists guard
    async joinGame(player2: User,  token : string){

        const game = await this.gamesRepository.findOneByOptions(
            {
                where : {token, match_time_end: IsNull() } ,
                relations: ["player1","player2"]
            }
        )
        if(!game)
            throw new NotFoundException("game finished Or doesn't exist")
        if(game.player2)
            throw new UnauthorizedException("game is full");
        if(game.player1.id === player2.id)
            throw new UnauthorizedException("can't join your own games");
        const inaccessible = await this.friendsService.blocking_exists(game.player1,player2);
        if(inaccessible)
            throw new UnauthorizedException("user innacessible");
        game.player2 = player2;
        return await this.gamesRepository.save(game);

    }

    //user exists?
    async get_game_link(user: User) : Promise <string | {message : string}>
    {
        const game = await this.gamesRepository.findOneByCondition({
            where : {
                player1: user,
                match_time_end: IsNull(),
            }
        })
        if(!game)
            return ({
                message : "no on going game with that id"
            })
        return game.token;
    }


    //to know which players can input
    async getGamePlayers(token: string) {
        const matchHistory = await this.gamesRepository.findOneByCondition({where :{ token }});
        if (matchHistory) {
            const { player1, player2, match_time_end } = matchHistory;
            const isLive = match_time_end === null;
            return {
                player1,
                player2,
                isLive
            };
        } else {
            throw new NotFoundException('Match not found');
        }
    }
    
    
    async setGameResult(user1Id : number,token: string, player1Score: number, player2Score: number) : Promise <MatchHistory> {
    
        const matchHistoryArr : MatchHistory[] = await this.gamesRepository.findByConditionWithRelations({token,player2 : Not(IsNull()), match_time_end : IsNull()},["player1", "player2"]);
        if (matchHistoryArr.length) {
            const matchHistory : MatchHistory = matchHistoryArr[0];

            if(matchHistory.player1.id == user1Id)
            {} else if(matchHistory.player2.id == user1Id)
            {
                [player1Score,player2Score] = [player2Score,player1Score]
            }
            else throw new BadRequestException("user 1 wasn't in playing in this game");

            if(matchHistory.player1_score && matchHistory.player2_score)
                throw new MethodNotAllowedException("already set scores")
            matchHistory.player1_score = player1Score;
            matchHistory.player2_score = player2Score;
            matchHistory.match_time_end = new Date();
            // await this.gamesRepository.save(matchHistory);

            
            if(player1Score > player2Score)
            {
                matchHistory.player1.wins += 1 
                matchHistory.player2.loss += 1 
            } else {
                matchHistory.player1.wins += 1 
                matchHistory.player2.loss += 1 
            }
            matchHistory.player1.winrate = Math.round((matchHistory.player1.wins * 100) / (matchHistory.player1.wins + matchHistory.player1.loss))
            matchHistory.player2.winrate = Math.round((matchHistory.player2.wins * 100) / (matchHistory.player2.wins + matchHistory.player2.loss))
            await this.userRepository.save([matchHistory.player1 , matchHistory.player2])
            return this.gamesRepository.save(matchHistory);

            //TODO: on testing phase test if findOneWithRelationsWork
            // chatgpt says I can just save like this when I retrieve with relations
            
        } else {
            throw new NotFoundException(`Match not found, Or Hasn't started`);
        }
    }
  
    async getLeaderboard(page: number = 1, pageSize: number = 10){
        const rowsToSkip = (page - 1) * pageSize;
        const leaderboard = await this.userRepository.findByOptions({
          take: pageSize,
          skip : rowsToSkip, 
          where : [
            {
                wins : MoreThan(0)
            },
            {
                loss : MoreThan(0)
            }
                ],
          order: {
          //sort by winrate than sort b games ()
            winrate: 'DESC',
            wins: 'DESC',
          },
        });
        return leaderboard;
        //highest wr order by games played
    };


    //for guard
    async findGame(token : string)
    {
        return await this.gamesRepository.findOneByCondition({token});
    }
}
