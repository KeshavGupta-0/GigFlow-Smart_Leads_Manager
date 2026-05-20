export const ApiResponse = <T>(statusCode: number, message: string, data?: T) => {
  return {
    success: statusCode < 400,
    statusCode,
    message,
    data,
  };
};
