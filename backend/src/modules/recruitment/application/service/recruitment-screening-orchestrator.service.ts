import { Injectable } from '@nestjs/common';
import { BigModelService } from '@/core/bigmodel/bigmodel.service';
import {
  CandidateEvent,
  SseEventsService,
} from '../../../../core/sse/sse-events.service';
import { PdfParserService } from '../../../../core/pdf/pdf-parser.service';
import { RecruitmentService } from './recruitment.service';

// @Injectable()
export class RecruitmentScreeningOrchestratorService {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly pdfParserService: PdfParserService,
    private readonly bigModelService: BigModelService,
    private readonly sseEventsService: SseEventsService,
  ) {}

  async run(resumeId: string, applicationId: string, fileBuffer: Buffer) {
    await this.recruitmentService.markParsingStarted(applicationId, resumeId);
    await this.recordEvent(applicationId, resumeId, 'started', 'parsing', {
      message: '开始解析简历',
    });

    try {
      const parsed = await this.pdfParserService.parse(fileBuffer);
      await this.recruitmentService.saveParsedResume(
        applicationId,
        resumeId,
        parsed,
      );
      await this.recordEvent(applicationId, resumeId, 'section', 'parsing', {
        pageCount: parsed.pageCount,
      });

      await this.recordEvent(applicationId, resumeId, 'started', 'extracting', {
        message: '开始提取结构化信息',
      });

      const extracted: {
        basicInfo: Record<string, string | null>;
        education: unknown[];
        workExperience: unknown[];
        skills: unknown[];
        projects: unknown[];
        raw: string;
      } = await this.bigModelService.extractCandidateProfile(
        parsed.cleanedText,
      );
      await this.recruitmentService.saveExtractedProfile(
        applicationId,
        resumeId,
        {
          cleanedText: parsed.cleanedText,
          basicInfo: extracted.basicInfo,
          education: extracted.education,
          workExperience: extracted.workExperience,
          skills: extracted.skills,
          projects: extracted.projects,
          raw: extracted.raw,
        },
      );
      await this.recordEvent(applicationId, resumeId, 'section', 'extracting', {
        basicInfo: extracted.basicInfo,
        skills: extracted.skills,
      });

      await this.recordEvent(applicationId, resumeId, 'started', 'scoring', {
        message: '开始岗位评分',
      });
      await this.recruitmentService.saveApplicationScore(
        applicationId,
        resumeId,
      );
      const application =
        await this.recruitmentService.getApplicationOrThrow(applicationId);
      const latestScore = this.parseLatestScore(application.scoreHistoryJson);
      await this.recordEvent(applicationId, resumeId, 'completed', 'scoring', {
        overallScore: latestScore?.overallScore ?? null,
        aiComment: latestScore?.aiComment ?? null,
      });
      await this.recordEvent(
        applicationId,
        resumeId,
        'completed',
        'completed',
        {
          status: 'SUCCEEDED',
        },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误';
      await this.recruitmentService.markScreeningFailed(
        applicationId,
        resumeId,
        message,
      );
      await this.recordEvent(applicationId, resumeId, 'failed', 'failed', {
        message,
      });
    }
  }

  private async recordEvent(
    applicationId: string,
    resumeId: string,
    type: string,
    stage: string,
    payload: Record<string, unknown>,
  ) {
    const event = (await this.recruitmentService.appendApplicationEvent(
      applicationId,
      resumeId,
      type,
      stage,
      payload,
    )) as CandidateEvent;
    this.sseEventsService.emit(applicationId, event);
  }

  private parseLatestScore(scoreHistoryJson: string | null) {
    if (!scoreHistoryJson) {
      return null;
    }
    try {
      const parsed = JSON.parse(scoreHistoryJson) as Array<{
        overallScore?: number;
        aiComment?: string;
      }>;
      return parsed[0] ?? null;
    } catch {
      return null;
    }
  }
}
