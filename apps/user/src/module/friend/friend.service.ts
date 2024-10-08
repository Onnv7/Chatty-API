import { Injectable } from '@nestjs/common';
import { FriendRepository } from '../../database/repository/friend.repository';
import {
  FriendCardData,
  GetFriendProfileData,
  GetFriendProfileRequest,
  GetPendingInvitationListData,
  GetPendingInvitationListRequest,
  GetPendingInvitationListResponse,
  ProcessInvitationRequest,
  SearchFriendData,
  SearchFriendRequest,
  SearchFriendResponse,
  SendInvitationRequest,
} from '../../../../../libs/shared/src/types/user';
import { AppError, ErrorResponseData } from '../../../../../libs/shared/src';
import {
  ActorType,
  FriendStatus,
  Gender,
  InvitationAction,
  Relationship,
} from '../../../../../libs/shared/src/constants/enum';
import { ProfileRepository } from '../../database/repository/profile.repository';
import { FriendEntity } from '../../database/entity/friend.entity';
import { FindManyOptions, Like } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { ProfileEntity } from '../../database/entity/profile.entity';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async sendFriendInvitation(body: SendInvitationRequest): Promise<void> {
    let friendShip = await this.friendRepository.findOneBy({
      sender: { id: body.senderId },
      receiver: { id: body.receiverId },
    });

    if (friendShip) {
      //   throw new AppError(ErrorResponseData.FRIEND_EXISTED);
      await this.friendRepository.remove(friendShip);
      return;
    }

    friendShip = this.friendRepository.create({
      sender: { id: body.senderId },
      receiver: { id: body.receiverId },
    });

    await this.friendRepository.save(friendShip);
  }

  async processFriendInvitation(body: ProcessInvitationRequest): Promise<void> {
    const invitation = await this.friendRepository.findOneBy({
      id: body.invitationId,
    });
    if (!invitation) {
      throw new AppError(ErrorResponseData.FRIEND_NOT_FOUND);
    }
    const action = body.action as InvitationAction;
    if (action === InvitationAction.ACCEPT) {
      invitation.status = FriendStatus.ACCEPTED;
      await this.friendRepository.save(invitation);
    } else {
      await this.friendRepository.remove(invitation);
    }
  }
  async getPendingInvitationList(
    body: GetPendingInvitationListRequest,
  ): Promise<GetPendingInvitationListData> {
    const isReceiver = (body.actor as ActorType) === ActorType.RECEIVER;
    const options: FindManyOptions<FriendEntity> = {
      where: {
        ...(isReceiver
          ? { receiver: { id: body.userId } }
          : { sender: { id: body.userId } }),
        status: FriendStatus.PENDING, // Tìm theo receiver id
      },
      order: {
        createdAt: 'ASC', // Sắp xếp theo createdAt
      },
    };

    const page = await paginate<FriendEntity>(
      this.friendRepository,
      { page: body.page, limit: body.size },
      options,
    );

    return {
      totalPage: page.meta.totalPages,
      invitationList: page.items.map((invitation) => {
        let profile = invitation.receiver;
        if (isReceiver) {
          profile = invitation.sender;
        }

        return {
          invitationId: invitation.id,
          profileId: profile.id,
          avatarUrl: profile.avatarUrl,
          fullName: profile.firstName + ' ' + profile.lastName,
          gender: profile.gender,
        };
      }),
    };
  }

  async searchFriend(body: SearchFriendRequest): Promise<SearchFriendData> {
    const searchFields = ['firstName', 'lastName', 'email'];
    const options: FindManyOptions<ProfileEntity> = {
      where: searchFields
        .map((field) => {
          const condition: any = {};
          condition[field] = Like(`%${body.key}%`);
          if (body.gender) {
            condition.gender = body.gender as Gender;
          }
          return Object.keys(condition).length > 0 ? condition : null;
        })
        .filter(Boolean),
    };
    const page = await paginate<ProfileEntity>(
      this.profileRepository,
      { page: body.page, limit: body.size },
      options,
    );
    const friendList: FriendCardData[] = await Promise.all(
      page.items.map(async (friend) => {
        const relationship = await this.friendRepository.findOne({
          where: [
            {
              sender: { id: body.userId },
              receiver: { id: friend.id },
            },
            {
              sender: { id: friend.id },
              receiver: { id: body.userId },
            },
          ],
        });
        return {
          profileId: friend.id,
          avatarUrl: friend.avatarUrl,
          fullName: friend.firstName + ' ' + friend.lastName,
          gender: friend.gender,
          relationship: !relationship
            ? Relationship.NONE
            : relationship.status === FriendStatus.ACCEPTED
              ? Relationship.FRIEND
              : relationship.sender.id === body.userId
                ? Relationship.SEND
                : Relationship.PENDING,
          invitationId: relationship?.id,
        };
      }),
    );

    return {
      totalPage: page.meta.totalPages,
      friendList: friendList,
    };
  }
  async getFriendProfile(
    body: GetFriendProfileRequest,
  ): Promise<GetFriendProfileData> {
    const profileEntity = await this.profileRepository.findOneBy({
      id: body.friendId,
    });
    if (!profileEntity) {
      throw new AppError(ErrorResponseData.USER_NOT_FOUND);
    }
    return {
      fullName: profileEntity.firstName + ' ' + profileEntity.lastName,
      avatarUrl: profileEntity.avatarUrl,
    };
  }
}
