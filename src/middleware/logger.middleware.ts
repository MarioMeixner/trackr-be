import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(`[${req.method}] ${req.url} ${req.path}`);
    // console.log('Headers:', req.headers);
    // console.log('Body:', req.body);
    // console.log('Query:', req.query);
    next();
  }
}
