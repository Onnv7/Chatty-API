import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../../../../../libs/shared/src/constants/enum';
import { FriendEntity } from './friend.entity';

@Entity({ name: 'profile' })
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'avatar_url',
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-NGEQDekk2BwsllLjk4tcIM_BPIzXECdsg&s',
  })
  avatarUrl: string;

  @Column({ name: 'firstName', nullable: false })
  firstName: string;

  @Column({ name: 'lastName', nullable: false })
  lastName: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({
    name: 'gender',
    nullable: false,
    enum: Gender,
    type: 'enum',
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({ name: 'birth_date', type: 'date', nullable: false })
  birthDate: Date;

  @Column({ name: 'introduction', default: '' })
  introduction: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // ==============================================
  @OneToMany(() => FriendEntity, (friend) => friend.sender)
  friendSendList: FriendEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.sender)
  friendReceivedList: FriendEntity[];
}
