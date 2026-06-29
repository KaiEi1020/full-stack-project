import {
  BaseEntity,
  type BaseEntityProps,
} from '../../../../common/entities/base.entity';
import { UserStatus } from '../vos/user-status.enum';

export interface UserProps extends BaseEntityProps {
  nickname: string;
  avatarUrl?: string;
  email?: string;
  status: UserStatus;
}

export interface CreateUserProps {
  nickname: string;
  avatarUrl?: string;
  email?: string;
}

export interface UpdateUserProps {
  nickname?: string;
  avatarUrl?: string;
  email?: string;
  status?: UserStatus;
}

export class User extends BaseEntity {
  private nickname: string;
  private avatarUrl?: string;
  private email?: string;
  private status: UserStatus;

  constructor(props: UserProps) {
    super(props);
    this.nickname = props.nickname;
    this.avatarUrl = props.avatarUrl;
    this.email = props.email;
    this.status = props.status;
  }

  static create(input: CreateUserProps): User {
    return new User({
      ...input,
      status: UserStatus.ACTIVE,
    });
  }

  public update(input: UpdateUserProps): void {
    if (input.nickname !== undefined) {
      this.nickname = input.nickname;
    }
    if (input.avatarUrl !== undefined) {
      this.avatarUrl = input.avatarUrl;
    }
    if (input.email !== undefined) {
      this.email = input.email;
    }
    if (input.status !== undefined) {
      this.status = input.status;
    }
    this.touch();
  }

  public delete(): void {
    super.markDeleted();
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  public getEmail(): string | undefined {
    return this.email;
  }

  public getStatus(): UserStatus {
    return this.status;
  }
}
