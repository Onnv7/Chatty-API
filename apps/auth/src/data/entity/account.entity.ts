import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', nullable: false })
  username: string;

  @Column({ name: 'is_verified', nullable: false, default: false })
  isVerified: boolean;

  @Column({ name: 'password', nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // ===================================
  @Column({ name: 'profile_id', nullable: false, unique: false })
  profileId: number;
}
