import { Body, Param, Patch } from '@nestjs/common';
import { RecruitmentService } from '../../application/service/recruitment.service';

// @Controller('api/recruitment/resumes')
export class ResumesController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Patch(':resumeId/correction')
  saveResumeCorrection(
    @Param('resumeId') resumeId: string,
    @Body() body: { correctedJson: string },
  ) {
    return this.recruitmentService.saveResumeCorrection(
      resumeId,
      body.correctedJson,
    );
  }
}
