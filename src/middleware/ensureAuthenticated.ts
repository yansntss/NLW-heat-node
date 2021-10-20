import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}


export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid"
    });
  }

  //Bearer 5465alks86asd46as8d4s68a4d
  // [0] Bearer
  // [1] 5465alks86asd46as8d4s68a4d


  const [, token] = authToken.split(" ")

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
    


    request.user_id = sub

    return next();

  } catch (err) {
    return response.status(401).json({ errorCode: "token.expired" })
  }

}
