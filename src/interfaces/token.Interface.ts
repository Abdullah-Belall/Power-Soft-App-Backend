import { rolesEnum } from 'src/enum/roles.enum';

export interface TokenInterface {
  id: string;
  user_name: string;
  role: rolesEnum;
}
