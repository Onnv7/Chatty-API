import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FriendStatus } from '../../../../../libs/shared/src/constants/enum';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'friend' })
export class FriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'status',
    nullable: false,
    enum: FriendStatus,
    type: 'enum',
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @ManyToOne(() => ProfileEntity, (profile) => profile.friendSendList, {
    eager: true,
  })
  @JoinColumn({ name: 'sender_id' })
  sender: ProfileEntity;

  @ManyToOne(() => ProfileEntity, (profile) => profile.friendReceivedList, {
    eager: true,
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: ProfileEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
