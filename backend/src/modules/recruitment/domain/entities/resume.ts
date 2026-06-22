import {
  BaseEntity,
  type BaseEntityProps,
} from '@/common/entities/base.entity';

export class Resume extends BaseEntity {
  private name: string | null = null;
  private phone: string | null = null;

  @Property({ nullable: true })
  email: string | null = null;

  @Property({ nullable: true })
  city: string | null = null;

  @Property({ nullable: true })
  resumeSummary: string | null = null;

  @Property({ nullable: true })
  highlightedStrengths: string | null = null;

  @Property({ nullable: true })
  highlightedWeaknesses: string | null = null;

  @Property({ nullable: true })
  originalName: string | null = null;

  @Property({ nullable: true })
  storagePath: string | null = null;

  @Property({ nullable: true })
  mimeType: string | null = null;

  @Property({ type: 'integer', nullable: true })
  sizeBytes: number | null = null;

  @Property({ type: 'integer', nullable: true })
  pageCount: number | null = null;

  @Property({ nullable: true })
  rawText: string | null = null;

  @Property({ nullable: true })
  cleanedText: string | null = null;

  @Enum({ items: () => ParseStatus, default: ParseStatus.PENDING })
  parseStatus: ParseStatus = ParseStatus.PENDING;

  @Property({ nullable: true })
  parseErrorMessage: string | null = null;

  @Property({ nullable: true })
  parsedAt: Date | null = null;

  @Property({ nullable: true })
  basicInfoJson: string | null = null;

  @Property({ nullable: true })
  educationJson: string | null = null;

  @Property({ nullable: true })
  workExperienceJson: string | null = null;

  @Property({ nullable: true })
  skillsJson: string | null = null;

  @Property({ nullable: true })
  projectJson: string | null = null;

  @Property({ nullable: true })
  rawModelOutput: string | null = null;

  @Property({ nullable: true })
  correctedJson: string | null = null;

  @Property({ nullable: true })
  extractedAt: Date | null = null;
}
