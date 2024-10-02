// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: proto/chat.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "chat";

export interface ErrorResponse {
  errorMessage: string;
  errorCode: number;
  subErrorMessage?: string | undefined;
  subErrorCode?: number | undefined;
}

export interface Empty {
}

export interface MessageData {
  content: string;
  createdAt: string;
  id: string;
}

export interface MessageChainData {
  messageChain: MessageData[];
  senderId: number;
}

export interface GetMessageData {
  messageList: MessageChainData[];
  totalPage: number;
}

export interface GetMessageResponse {
  data?: GetMessageData | undefined;
  error?: ErrorResponse | undefined;
  success: boolean;
}

export interface GetMessageRequest {
  conversationId: string;
  page: number;
  size: number;
}

export interface SendMessageRequest {
  content: string;
  senderId: number;
  conversationId: string;
}

export interface SendMessageData {
  id: string;
}

export interface SendMessageResponse {
  data?: SendMessageData | undefined;
  error?: ErrorResponse | undefined;
  success: boolean;
}

export interface ConversationMemberData {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface ConversationInfoData {
  memberList: ConversationMemberData[];
}

export interface GetConversationResponse {
  data?: ConversationInfoData | undefined;
  error?: ErrorResponse | undefined;
  success: boolean;
}

export interface GetConversationRequest {
  conversationId: string;
}

export interface GetConversationListRequest {
  profileId: number;
  page: number;
  size: number;
}

export interface ConversationData {
  name: string;
  imageUrl: string;
  lastMessage: string;
  lastSendAt: string;
  senderId: number;
  id: string;
  activeStatus: string;
  lastActiveAt: string;
  friendId?: number | undefined;
}

export interface GetConversationListData {
  conversationList: ConversationData[];
  totalPage: number;
}

export interface GetConversationListResponse {
  data?: GetConversationListData | undefined;
  error?: ErrorResponse | undefined;
  success: boolean;
}

export interface CreateConversationRequest {
  memberIdList: number[];
  creatorId: number;
}

export interface CreateConversationData {
  conversationId: string;
}

export interface CreateConversationResponse {
  data?: CreateConversationData | undefined;
  error?: ErrorResponse | undefined;
  success: boolean;
}

export const CHAT_PACKAGE_NAME = "chat";

export interface MessageServiceClient {
  sendMessage(request: SendMessageRequest): Observable<SendMessageResponse>;

  getMessagePage(request: GetMessageRequest): Observable<GetMessageResponse>;
}

export interface MessageServiceController {
  sendMessage(
    request: SendMessageRequest,
  ): Promise<SendMessageResponse> | Observable<SendMessageResponse> | SendMessageResponse;

  getMessagePage(
    request: GetMessageRequest,
  ): Promise<GetMessageResponse> | Observable<GetMessageResponse> | GetMessageResponse;
}

export function MessageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendMessage", "getMessagePage"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MessageService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MessageService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MESSAGE_SERVICE_NAME = "MessageService";

export interface ConversationServiceClient {
  createConversation(request: CreateConversationRequest): Observable<CreateConversationResponse>;

  getConversationPage(request: GetConversationListRequest): Observable<GetConversationListResponse>;

  getConversation(request: GetConversationRequest): Observable<GetConversationResponse>;
}

export interface ConversationServiceController {
  createConversation(
    request: CreateConversationRequest,
  ): Promise<CreateConversationResponse> | Observable<CreateConversationResponse> | CreateConversationResponse;

  getConversationPage(
    request: GetConversationListRequest,
  ): Promise<GetConversationListResponse> | Observable<GetConversationListResponse> | GetConversationListResponse;

  getConversation(
    request: GetConversationRequest,
  ): Promise<GetConversationResponse> | Observable<GetConversationResponse> | GetConversationResponse;
}

export function ConversationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createConversation", "getConversationPage", "getConversation"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ConversationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ConversationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CONVERSATION_SERVICE_NAME = "ConversationService";
