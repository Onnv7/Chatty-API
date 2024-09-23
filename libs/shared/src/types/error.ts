export class AppError extends Error {
  constructor(errorData: ErrorData) {
    super(errorData.errorMessage);
    this.errorData = errorData;
  }

  errorData: ErrorData;
}

export class ErrorData {
  errorCode: number;
  errorMessage: string;
  subErrorCode?: number;
  subErrorMessage?: string;
}

export class DevError {
  message: string;
}
