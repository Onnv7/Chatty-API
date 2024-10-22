import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ConversationService } from './conversation.service';
import { Namespace, Server, Socket } from 'socket.io';
import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  SendNewMessageData,
  SendReactionData,
} from '../../../../../libs/shared/src/types/kafka/notification';
import {
  HeartbeatRequest,
  InitPhoneCallRequest,
  JoinUserTrackingRoomRequest,
  RegisterSocketClientRequest,
  ShareCalleePeerIdRequest,
} from './payload/conversation.request';

import { instrument } from '@socket.io/admin-ui';
import { ActiveStatus } from '../../../../../libs/shared/src/constants/enum';

@Injectable()
@WebSocketGateway(1001, {
  namespace: 'conversation',
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3000'],
    credentials: true,
  },
})
export class ConversationGateway
  implements
    OnModuleInit,
    OnGatewayDisconnect,
    OnGatewayInit,
    OnGatewayConnection
{
  constructor(
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
  ) {}
  afterInit() {
    instrument(this.io.server, {
      auth: false,
      namespaceName: 'conversation',
      mode: 'development',
    });
  }
  handleConnection(client: any, ...args: any[]) {}

  async handleDisconnect(client: any) {
    console.log(`client ${client.id} is offline `);
    const userId = await this.conversationService.clientOffline(client.id);
    this.io.in(`user-tracking:${userId}`).emit('active-status-friend', {
      senderId: Number(userId),
      active: ActiveStatus.OFFLINE,
    });
  }

  onModuleInit() {}

  @WebSocketServer()
  io: Namespace;

  async sendNewMessageToClient(data: SendNewMessageData) {
    const { socketIdList } = await this.conversationService.getRealtimeIdList(
      data.receiverId,
    );
    socketIdList.forEach((socketId) => {
      this.io.to(socketId).emit('receive-message', {
        senderId: data.senderId,
        conversationId: data.conversationId,
        content: data.content,
        createdAt: data.createdAt,
      });
    });
  }

  async sendNewReactionToClient(data: SendReactionData) {
    const { socketIdList } = await this.conversationService.getRealtimeIdList(
      data.receiverId,
    );
    socketIdList.forEach((socketId) => {
      this.io.to(socketId).emit('receive-reaction', {
        senderId: data.senderId,
        conversationId: data.conversationId,
        reactionList: data.reactionList,
        reactedCount: data.reactedCount,
        messageId: data.messageId,
      });
    });
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('register')
  async onRegisterSocketClient(
    @MessageBody() body: RegisterSocketClientRequest,
    @ConnectedSocket() client: Socket,
  ) {
    await this.conversationService.registerClientOnline(body, client.id);
    this.io.in(`user-tracking:${body.userId}`).emit('active-status-friend', {
      senderId: body.userId,
      activeStatus: ActiveStatus.ONLINE,
    });
  }

  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('heartbeat')
  async onHeartbeat(
    @MessageBody() body: HeartbeatRequest,
    @ConnectedSocket() client: Socket,
  ) {
    await this.conversationService.handleHeartbeat(body.userId, client.id);
  }

  @SubscribeMessage('join-room-friend-tracking')
  async addUserTrackingRoom(
    @MessageBody() data: JoinUserTrackingRoomRequest,
    @ConnectedSocket() client: Socket,
  ) {
    if (client) {
      for (const friendId of data.friendIdList) {
        console.log(client.id, 'join', `user-tracking:${friendId}`);
        client.join(`user-tracking:${friendId}`);
      }
    }
  }

  @SubscribeMessage('init-phone-call')
  async initPhoneCall(
    @MessageBody() data: InitPhoneCallRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const conversationInfo = await this.conversationService.getConversation(
      data.conversationId,
    );
    const callerId = data.caller.id;

    conversationInfo.memberList.forEach(async (member) => {
      if (member.id !== callerId) {
        const { socketIdList } =
          await this.conversationService.getRealtimeIdList(member.id);
        console.log('🚀 ~ initPhoneCall ~ socketIdList:', data, socketIdList);
        socketIdList.forEach((socketId) => {
          this.io.to(socketId).emit('receive-phone-call', {
            conversation: {
              id: data.conversationId,
              imageUrl: data.caller.avatarUrl,
              name: data.caller.fullName,
              socketId: client.id,
              peerId: data.caller.peerId,
            },
          });
        });
      }
    });
  }
  @SubscribeMessage('callee-share-peer-id')
  async shareCalleePeerId(
    @MessageBody() data: ShareCalleePeerIdRequest,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('share', data);
    this.io
      .to(data.callerSocketId)
      .emit('receive-callee-peer-id', data.calleePeerId);
  }
}
