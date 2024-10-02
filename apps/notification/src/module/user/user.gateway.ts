// import {
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   WebSocketGateway,
// } from '@nestjs/websockets';
// import { UserService } from './user.service';
// import { OnModuleInit } from '@nestjs/common';

// @WebSocketGateway(1001, {
//   namespace: 'conversation',
//   cors: {
//     origin: '*',
//     credentials: true,
//   },
// })
// export class UserGateway
//   implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection
// {
//   constructor(private readonly userService: UserService) {}
//   onModuleInit() {}
//   handleDisconnect(client: any) {}
//   handleConnection(client: any, ...args: any[]) {}
// }
