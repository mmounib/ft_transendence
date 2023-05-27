import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Default, OneToMany } from 'typeorm';
import User from './user.entity';
import Channel from './channel.entity';
import { channel } from 'diagnostics_channel';



enum channelUserRole
{
    owner,
    admin,
    member
}

@Entity()
class ChannelUsers{
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => User, user => user.channelUsers, { primary: true })
    user: User;

    @ManyToOne(() => Channel, channel => channel.channelUsers, { primary: true })
    channel: Channel;

    @Column()
    public userRole : channelUserRole;

}

export default ChannelUsers;