import { OmitType } from "@nestjs/mapped-types";
import { SignUpVendorDTO } from "./signup-vendor.dto";

export class SignInVendorDTO extends OmitType(SignUpVendorDTO , ["name" , "phone"]) {}