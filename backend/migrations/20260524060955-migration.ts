import { Migration } from '@mikro-orm/migrations';

export class Migration20260524060955 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "jobs" ("id" uuid not null, "title" varchar(255) not null, "description" text not null, "status" text not null default 'DRAFT', "required_skills" text not null, "preferred_skills" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, primary key ("id"));`);
    this.addSql(`alter table "jobs" add constraint "jobs_status_check" check ("status" in ('DRAFT', 'ACTIVE', 'CLOSED'));`);
  }

}
