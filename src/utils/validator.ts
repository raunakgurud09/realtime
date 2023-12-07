import { NextFunction, Response, Request } from "express";

export const validate =
  (schema: any): any =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };
