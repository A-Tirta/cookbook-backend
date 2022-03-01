export interface returnResponse {
  statuscode: number;
  data: {
    message: string;
    data?: any;
    info?: any;
  };
}

export interface token {
  id: number;
}
