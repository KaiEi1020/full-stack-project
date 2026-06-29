import { Migration } from '@mikro-orm/migrations';

export class Migration20260629104933 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" varchar(255) not null, "nickname" varchar(50) not null, "avatar_url" varchar(255) null, "email" varchar(100) null, "status" smallint not null default 1, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, primary key ("id"));`);

    this.addSql(`create table "user_auths" ("id" varchar(255) not null, "user_id" varchar(36) not null, "identity_type" text not null, "identifier" varchar(100) not null, "credential" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, primary key ("id"));`);

    this.addSql(`alter table "user_auths" add constraint "user_auths_identity_type_check" check ("identity_type" in ('password', 'github', 'wechat', 'gitee'));`);

    this.addSql(`alter table "jobs" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "jobs" alter column "id" type varchar(255) using ("id"::varchar(255));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "jobs" alter column "id" type uuid using ("id"::text::uuid);`);
  }

}
