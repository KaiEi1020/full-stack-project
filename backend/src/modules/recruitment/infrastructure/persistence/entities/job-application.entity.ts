import { Entity, Property, Enum } from '@mikro-orm/decorators/legacy';
import { SubmissionStatus } from '../../../domain/vos/submission-status.enum';
import { ScreeningStatus } from '../../../domain/vos/screening-status.enum';
import { BaseEntity } from '../../../../../common/entities/base.entity';

@Entity({ tableName: 'applications' })
export class JobApplicationEntity extends BaseEntity {
  @Property()
  jobId: string = '';

  @Property()
  resumeId: string = '';

  @Enum({ items: () => SubmissionStatus, default: SubmissionStatus.PENDING })
  status: SubmissionStatus = SubmissionStatus.PENDING;

  @Enum({ items: () => ScreeningStatus, default: ScreeningStatus.PENDING })
  screeningStatus: ScreeningStatus = ScreeningStatus.PENDING;

  @Property({ nullable: true })
  screeningStage: string | null = null;

  @Property({ nullable: true })
  screeningErrorMessage: string | null = null;

  @Property({ nullable: true })
  screeningStartedAt: Date | null = null;

  @Property({ nullable: true })
  screeningFinishedAt: Date | null = null;

  @Property({ type: 'integer', nullable: true })
  overallScore: number | null = null;

  @Property({ type: 'integer', nullable: true })
  skillScore: number | null = null;

  @Property({ type: 'integer', nullable: true })
  experienceScore: number | null = null;

  @Property({ type: 'integer', nullable: true })
  educationScore: number | null = null;

  @Property({ nullable: true })
  aiComment: string | null = null;

  @Property({ nullable: true })
  scoreHistoryJson: string | null = null;

  @Property({ nullable: true })
  eventHistoryJson: string | null = null;
}
