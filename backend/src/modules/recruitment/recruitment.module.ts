import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JobSchema } from './infrastructure/persistence/schemas/job.schema';
import { JOB_REPOSITORY } from './domain/repository/job.repository';
import { MikroOrmJobRepository } from './infrastructure/persistence/repositories/mikroorm-job.repository';
import { JobController } from './api/controller/job.controller';
import { JobService } from './application/service/job.service';

@Module({
  imports: [MikroOrmModule.forFeature([JobSchema])],
  controllers: [JobController],
  providers: [
    JobService,
    { provide: JOB_REPOSITORY, useClass: MikroOrmJobRepository },
  ],
  // {
  //   provide: JOB_APPLICATION_REPOSITORY,
  //   useExisting: MikroOrmJobApplicationRepository,
  // },
  // exports: [RecruitmentService, JobApplicationUploadService],
})
export class RecruitmentModule {}
