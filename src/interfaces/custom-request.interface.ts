import { Request } from 'express';
import { TokenInterface } from './token.Interface';

export interface CustomRequest extends Request {
  user?: TokenInterface | null;
}
