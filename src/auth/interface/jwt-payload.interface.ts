import { UserRole } from "src/enum/ole.enum";


export interface JwtPayload {
    email: string;
    role: UserRole;
  }
  

