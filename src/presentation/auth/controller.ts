import { Request, Response } from "express";
import {
  AuthRepository,
  CustomError,
  LoginUser,
  LoginUserDto,
  SignupUser,
  SignupUserDto,
} from "../../domain";
import { UserModel } from "../../data/mongodb";

export class AuthController {
  
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error); // Winston

    return res.status(500).json({ error: "Internal Server Error" });
  };

  signupUser = (req: Request, res: Response) => {
    // Validate the route
    const [error, signupUserDto] = SignupUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new SignupUser(this.authRepository)
      .execute(signupUserDto!)
      .then( (data) => res.json(data) )
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then( (data) => res.json(data) )
      .catch((error) => this.handleError(error, res));
  };

  getUser = (req: Request, res: Response) => {
    UserModel.find()
      .then((users) => {
        res.json({ user: req.body.user });
      })
      .catch(() => res.status(500).json("Internal Server Error"));
  };

}