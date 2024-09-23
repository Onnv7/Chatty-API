import { Injectable } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';

export class CreateAccountCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}
