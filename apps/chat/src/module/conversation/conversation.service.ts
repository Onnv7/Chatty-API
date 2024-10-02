import { Inject, Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../database/repository/convervation.repository';
import {
  ConversationInfoData,
  CreateConversationData,
  CreateConversationRequest,
  GetConversationListData,
  GetConversationListRequest,
  GetConversationRequest,
} from '../../../../../libs/shared/src/types/chat';
import { Conversation } from '../../database/schema/conversation.schema';
import {
  AppError,
  ErrorResponseData,
  KAFKA_ADD_USER_TRACKING_ROOM_TOPIC,
  NOTIFICATION_SERVICE_CLIENT_KAFKA,
  PROFILE_SERVICE,
} from '../../../../../libs/shared/src';
import { ProfileServiceClient } from '../../../../../libs/shared/src/types/user';
import { lastValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { JoinUserTrackingRoomData } from '../../../../../libs/shared/src/types/kafka/notification';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    @Inject(PROFILE_SERVICE)
    private readonly profileServiceClient: ProfileServiceClient,
    @Inject(NOTIFICATION_SERVICE_CLIENT_KAFKA)
    private readonly notificationClient: ClientKafka,
  ) {}

  async getConversationPage(
    body: GetConversationListRequest,
  ): Promise<GetConversationListData> {
    const conversationPage =
      await this.conversationRepository.getConversationPageByUserId(
        body.profileId,
        body.page,
        body.size,
      );
    const friendIdList = [];
    const conversationList = await Promise.all(
      conversationPage.conversationList.map(async (conversation) => {
        const receiverId = conversation.memberIdList.find(
          (id) => id !== body.profileId,
        );
        const { success, data, error } = await lastValueFrom(
          this.profileServiceClient.getProfileById({ id: receiverId }),
        );
        if (!success) throw new AppError(error);
        friendIdList.push(receiverId);
        return {
          id: conversation.id,
          lastSendAt: conversation.updatedAt.toISOString(),
          name: data.firstName + ' ' + data.lastName,
          imageUrl: data.avatarUrl,
          lastMessage: conversation.lastMessage,
          senderId: conversation.senderId,
          activeStatus: data.activeStatus,
          lastActiveAt: data.lastActiveAt,
          friendId: receiverId,
        };
      }),
    );
    // this.notificationClient.emit<any, AddUserTrackingRoomData>(
    //   KAFKA_ADD_USER_TRACKING_ROOM_TOPIC,
    //   { friendIdList: friendIdList, socketId: body.socketId },
    // );
    return {
      totalPage: conversationPage.totalPage,
      conversationList: conversationList,
    };
  }

  async createConversation(
    body: CreateConversationRequest,
  ): Promise<CreateConversationData> {
    const conversation = await this.conversationRepository.getByMemberIdList(
      body.memberIdList,
    );
    if (conversation) {
      throw new AppError(ErrorResponseData.CONVERSATION_EXISTED);
    }
    const conversationDoc: Partial<Conversation> = {
      memberIdList: body.memberIdList.sort((a, b) => b - a),
      senderId: null,
    };
    const data = await this.conversationRepository.create(conversationDoc);
    return { conversationId: data.id };
  }

  async getConversation(
    body: GetConversationRequest,
  ): Promise<ConversationInfoData> {
    const conversation = await this.conversationRepository.getById(
      body.conversationId,
    );
    if (!conversation) {
      throw new AppError(ErrorResponseData.CONVERSATION_NOT_FOUND);
    }
    const memberList = await Promise.all(
      conversation.memberIdList.map(async (profileId) => {
        const { data, error, success } = await lastValueFrom(
          this.profileServiceClient.getProfileById({
            id: profileId,
          }),
        );
        if (!success) {
          throw new AppError(ErrorResponseData.USER_NOT_FOUND);
        }
        return {
          id: profileId,
          name: data.firstName + data.lastName,
          avatarUrl: data.avatarUrl,
        };
      }),
    );
    return {
      memberList: memberList,
    };
  }
}
