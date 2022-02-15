export interface returnResponse {
  statuscode: number;
  data: {
    message: string;
    data?: any;
    info?: any;
  };
}
