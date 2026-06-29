import {
  BaseEntity,
  type BaseEntityProps,
} from '../../../../common/entities/base.entity';
import { IdentityType } from '../vos/identity-type.enum';

export interface UserAuthProps extends BaseEntityProps {
  userId: string;
  identityType: IdentityType;
  identifier: string;
  credential?: string;
}

export interface CreateUserAuthProps {
  userId: string;
  identityType: IdentityType;
  identifier: string;
  credential?: string;
}

export class UserAuth extends BaseEntity {
  private userId: string;
  private identityType: IdentityType;
  private identifier: string;
  private credential?: string;

  constructor(props: UserAuthProps) {
    super(props);
    this.userId = props.userId;
    this.identityType = props.identityType;
    this.identifier = props.identifier;
    this.credential = props.credential;
  }

  static create(input: CreateUserAuthProps): UserAuth {
    return new UserAuth({
      ...input,
    });
  }

  public getUserId(): string {
    return this.userId;
  }

  public getIdentityType(): IdentityType {
    return this.identityType;
  }

  public getIdentifier(): string {
    return this.identifier;
  }

  public getCredential(): string | undefined {
    return this.credential;
  }
}
