import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/components/user/user.service';
import { User } from 'src/database/entities';

@Injectable()
export class AddBotMiddleware implements NestMiddleware {
  static botCreated :boolean = false;
  constructor(private readonly userService: UserService) {}
  private async createBot() : Promise<User> {
      const user = {id : 1, username : 'bot', IntraId: 2147483647,avatar: "botavatar", wins : 0, loss : 0, winrate : 0, two_factors_enabled: false};
      return this.userService.createUser(user);
  }

  async use(req: any, res: any, next: () => void) {
    if(AddBotMiddleware.botCreated)
      return next();
    const BOT = await this.userService.findById(2147483647);

    if(!BOT)
      await this,this.createBot()
    AddBotMiddleware.botCreated = true;
    next();
  }
}
