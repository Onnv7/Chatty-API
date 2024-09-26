import { HttpStatus } from '@nestjs/common';
import { ErrorData } from '../types';

export const ResponseMessage = {
  GET: 'Get successfully',
  UPDATE: 'Update successfully',
  DELETE: 'Delete successfully',
  CREATE: 'Create successfully',
};

export enum ErrorCode {
  NOT_FOUND = 14,
  SERVER_ERROR = 15,
  UNAUTHORIZED = 16,
  DELETE = 17,
  DATA_SEND_INVALID = 18,
  EXISTED = 19,
  FLOW_INCORRECT = 11,
  FORBIDDEN = 12,
}

export const ErrorMessage = {
  [ErrorCode.NOT_FOUND]: 'Not found',
  [ErrorCode.SERVER_ERROR]: 'Server error',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCode.FORBIDDEN]: 'Forbidden',
  [ErrorCode.DELETE]: 'Cant delete this data',
  [ErrorCode.DATA_SEND_INVALID]: 'Data sent invalid',
  [ErrorCode.EXISTED]: 'Data is existed',
  [ErrorCode.FLOW_INCORRECT]: 'Incorrect flow',
};

export const HttpCodeMessage = {
  [ErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.DELETE]: HttpStatus.BAD_REQUEST,
  [ErrorCode.DATA_SEND_INVALID]: HttpStatus.BAD_REQUEST,
  [ErrorCode.EXISTED]: HttpStatus.BAD_REQUEST,
  [ErrorCode.FLOW_INCORRECT]: HttpStatus.BAD_REQUEST,
  [ErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
};

export const ErrorResponseData = {
  // DATA_SEND_INVALID
  DATA_SEND_INVALID: {
    errorCode: ErrorCode.DATA_SEND_INVALID,
    errorMessage: ErrorMessage[ErrorCode.DATA_SEND_INVALID],
  },
  // FLOW_INCORRECT
  FLOW_INCORRECT: {
    errorCode: ErrorCode.FLOW_INCORRECT,
    errorMessage: ErrorMessage[ErrorCode.FLOW_INCORRECT],
  },
  // SERVER_ERROR
  SERVER_ERROR: {
    errorCode: ErrorCode.SERVER_ERROR,
    errorMessage: ErrorMessage[ErrorCode.SERVER_ERROR],
  },
  CLOUDINARY_ERROR: {
    errorCode: ErrorCode.SERVER_ERROR,
    errorMessage: ErrorMessage[ErrorCode.SERVER_ERROR],
    subErrorCode: 1501,
    subErrorMessage: 'Cloudinary service is error',
  } as ErrorData,
  // DELETE

  DELETE: {
    errorCode: ErrorCode.DELETE,
    errorMessage: ErrorMessage[ErrorCode.UNAUTHORIZED],
  },
  CATEGORY_DELETE: {
    errorCode: ErrorCode.DELETE,
    errorMessage: ErrorMessage[ErrorCode.DELETE],
    subErrorCode: 1701,
    subErrorMessage: 'Cant delete this category',
  } as ErrorData,

  // EXISTED
  EMAIL_EXISTED: {
    errorCode: ErrorCode.EXISTED,
    errorMessage: ErrorMessage[ErrorCode.EXISTED],
    subErrorCode: 1801,
    subErrorMessage: 'Email already exists',
  } as ErrorData,
  CONVERSATION_EXISTED: {
    errorCode: ErrorCode.EXISTED,
    errorMessage: ErrorMessage[ErrorCode.EXISTED],
    subErrorCode: 1802,
    subErrorMessage: 'Conversation already exists',
  } as ErrorData,
  FRIEND_EXISTED: {
    errorCode: ErrorCode.EXISTED,
    errorMessage: ErrorMessage[ErrorCode.EXISTED],
    subErrorCode: 1803,
    subErrorMessage: 'Friend ship already exists',
  } as ErrorData,

  // NOT_FOUND
  NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
  },
  USER_NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
    subErrorCode: 1401,
    subErrorMessage: 'User not found',
  } as ErrorData,

  CONVERSATION_NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
    subErrorCode: 1402,
    subErrorMessage: 'Conversation not found',
  } as ErrorData,

  ACCOUNT_NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
    subErrorCode: 1403,
    subErrorMessage: 'Account not found',
  } as ErrorData,

  EMAIL_NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
    subErrorCode: 1404,
    subErrorMessage: 'Email not found',
  } as ErrorData,

  FRIEND_NOT_FOUND: {
    errorCode: ErrorCode.NOT_FOUND,
    errorMessage: ErrorMessage[ErrorCode.NOT_FOUND],
    subErrorCode: 1405,
    subErrorMessage: 'Friend ship not found',
  } as ErrorData,

  // FORBIDDEN
  FORBIDDEN: {
    errorCode: ErrorCode.FORBIDDEN,
    errorMessage: ErrorMessage[ErrorCode.FORBIDDEN],
  },
  // UNAUTHORIZED
  UNAUTHORIZED: {
    errorCode: ErrorCode.UNAUTHORIZED,
    errorMessage: ErrorMessage[ErrorCode.UNAUTHORIZED],
  },

  CREDENTIAL_WRONG: {
    errorCode: ErrorCode.UNAUTHORIZED,
    errorMessage: ErrorMessage[ErrorCode.UNAUTHORIZED],
    subErrorCode: 1601,
    subErrorMessage: 'Credential is wrong',
  } as ErrorData,

  VERIFICATION_WRONG: {
    errorCode: ErrorCode.UNAUTHORIZED,
    errorMessage: ErrorMessage[ErrorCode.UNAUTHORIZED],
    subErrorCode: 1602,
    subErrorMessage: 'Account not verified',
  } as ErrorData,
};
