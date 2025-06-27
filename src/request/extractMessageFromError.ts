/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type AxiosError = any;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
type AxiosResponse<T> = any;
type ErrorMessage = string;

/**
 * Extracts message from axios error
 *
 * @param err Axios error
 * @returns Extracted error message from axios error
 */
export default function extractMessageFromError(err: AxiosError): ErrorMessage {
  let errMsg: string;
  const error: AxiosError = err as AxiosError;

  const isServerError = !!error.response;
  const serverUnavailable = !!error.request;

  if (isServerError) {
    errMsg = (error.response as AxiosResponse<{ error: string }>).data.error;
  } else if (serverUnavailable) {
    errMsg = 'Server not available';
  } else {
    errMsg = error.message;
  }

  return errMsg;
}
