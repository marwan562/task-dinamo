import { OmitType } from "@nestjs/mapped-types";
import { SignUpUserDTO } from "./singup-user.dto";

export class SignInUserDTO extends OmitType(SignUpUserDTO , ["username"]) {}