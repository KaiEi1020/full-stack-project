import {
  BaseEntity,
  type BaseEntityProps,
} from '@/common/entities/base.entity';
import { ScreeningStatus } from '../vos/screening-status.enum';
import { SubmissionStatus } from '../vos/submission-status.enum';

export interface JobApplicationProps extends BaseEntityProps {
  jobId: string;
  resumeId?: string;
  status: SubmissionStatus;
  screeningStatus: ScreeningStatus;
  screeningStartedAt?: Date;
  screeningFinishedAt?: Date;
  screeningErrorMessage?: string;
  overallScore?: number;
  skillScore?: number;
  experienceScore?: number;
  educationScore?: number;
  aiComment?: string;
}

export class JobApplication extends BaseEntity {
  private jobId: string;
  private resumeId?: string;
  private status: SubmissionStatus;
  private screeningStatus: ScreeningStatus;
  private screeningStartedAt?: Date;
  private screeningFinishedAt?: Date;
  private screeningErrorMessage?: string;
  private overallScore?: number;
  private skillScore?: number;
  private experienceScore?: number;
  private educationScore?: number;
  private aiComment?: string;

  constructor(props: JobApplicationProps) {
    super(props);
    this.jobId = props.jobId;
    this.resumeId = props.resumeId;
    this.status = props.status;
    this.screeningStatus = props.screeningStatus;
    this.screeningStartedAt = props.screeningStartedAt;
    this.screeningFinishedAt = props.screeningFinishedAt;
    this.screeningErrorMessage = props.screeningErrorMessage;
    this.overallScore = props.overallScore;
    this.skillScore = props.skillScore;
    this.experienceScore = props.experienceScore;
    this.educationScore = props.educationScore;
    this.aiComment = props.aiComment;
  }

  static create(input: JobApplicationProps) {
    return new JobApplication({
      ...input,
      status: input.status ?? SubmissionStatus.PENDING,
      screeningStatus: input.screeningStatus ?? ScreeningStatus.UPLOADING,
    });
  }

  //   public update(props: JobApplicationProps) {
  //     Object.assign(this, props);
  //   }

  public delete(): void {
    super.markDeleted();
  }

  getJobId(): string {
    return this.jobId;
  }
  getResumeId(): string | undefined {
    return this.resumeId;
  }
  getStatus(): SubmissionStatus {
    return this.status;
  }
  getScreeningStatus(): ScreeningStatus {
    return this.screeningStatus;
  }
  getScreeningStartedAt(): Date | undefined {
    return this.screeningStartedAt;
  }
  getScreeningFinishedAt(): Date | undefined {
    return this.screeningFinishedAt;
  }
  getScreeningErrorMessage(): string | undefined {
    return this.screeningErrorMessage;
  }
  getOverallScore(): number | undefined {
    return this.overallScore;
  }
  getSkillScore(): number | undefined {
    return this.skillScore;
  }
  getExperienceScore(): number | undefined {
    return this.experienceScore;
  }
  getEducationScore(): number | undefined {
    return this.educationScore;
  }
  getAiComment(): string | undefined {
    return this.aiComment;
  }
}
