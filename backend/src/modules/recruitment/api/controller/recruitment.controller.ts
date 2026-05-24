import {
  BadRequestException,
  Body,
  //   Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RecruitmentService } from '../../application/service/recruitment.service';
import { JobApplicationUploadService } from '../../application/service/job-application-upload.service';
import { CreateJobDto } from '../dto/create-job.dto';

// @Controller('api/recruitment/jobs')
export class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly jobApplicationUploadService: JobApplicationUploadService,
  ) {}

  private parseStringArray(value?: string): string[] {
    if (!value) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      throw new BadRequestException('技能字段格式不正确');
    }
  }

  @Get()
  listJobs() {
    return this.recruitmentService.listJobs();
  }

  @Get(':jobId')
  getJob(@Param('jobId') jobId: string) {
    return this.recruitmentService.getJob(jobId);
  }

  @Post()
  createJob(@Body() body: CreateJobDto) {
    return this.recruitmentService.createJob({
      id: body.id,
      title: body.title,
      description: body.description,
      requiredSkills: body.requiredSkills,
      preferredSkills: body.preferredSkills,
    });
  }

  @Get(':jobId/rankings')
  listRankings(@Param('jobId') jobId: string) {
    return this.recruitmentService.listJobRankings(jobId);
  }

  @Post(':jobId/submissions/upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadToJob(
    @Param('jobId') jobId: string,
    @UploadedFiles()
    files: Array<{
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    }>,
    @Body()
    body: {
      jdText?: string;
      requiredSkills?: string;
      preferredSkills?: string;
    },
  ) {
    if (!files?.length) {
      throw new BadRequestException('请上传 PDF 文件');
    }
    if (files.length > 5) {
      throw new BadRequestException('单次最多上传 5 份简历');
    }
    if (files.some((file) => file.mimetype !== 'application/pdf')) {
      throw new BadRequestException('仅支持 PDF 格式');
    }
    const requiredSkills = this.parseStringArray(body.requiredSkills);
    const preferredSkills = this.parseStringArray(body.preferredSkills);

    return await Promise.all(
      files.map((file) =>
        this.jobApplicationUploadService.uploadToJob(
          jobId,
          file,
          body.jdText,
          requiredSkills,
          preferredSkills,
        ),
      ),
    );
  }
}
