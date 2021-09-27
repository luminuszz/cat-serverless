import { APIGatewayProxyEvent } from 'aws-lambda';

export abstract class LambadaHandler<T = any> {
  abstract main(event: APIGatewayProxyEvent): Promise<T>;
}
