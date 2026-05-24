import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Inject } from '@nestjs/common';

type ApplicationView = {
  id: string;
  jobId: string;
  resumeId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
  resumeSummary: string | null;
  resumeFilePath: string | null;
  cleanedText: string | null;
  parseStatus: string;
  parseErrorMessage: string | null;
  screeningStatus: string;
  screeningStage: string | null;
  screeningErrorMessage: string | null;
  skills: string[];
  scores: Array<Record<string, unknown>>;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class RecruitmentService {
  constructor() {}

  async createJob(input: any) {
    return { id: randomUUID() };
  }

  async listJobs() {
    return [];
  }

  async getJob(jobId: string) {
    return null;
  }

  async createApplicationForUpload(input: any) {
    return { applicationId: '', jobId: '', resumeId: '' };
  }

  async listApplications() {
    return [];
  }

  async getApplicationView(applicationId: string) {
    return null;
  }

  async getApplicationOrThrow(applicationId: string) {
    return {} as any;
  }

  async getResumeOrThrow(resumeId: string) {
    return {} as any;
  }

  async markParsingStarted(applicationId: string, resumeId: string) {
    return;
  }

  async saveParsedResume(applicationId: string, resumeId: string, parsed: any) {
    return;
  }

  async saveExtractedProfile(
    applicationId: string,
    resumeId: string,
    input: any,
  ) {
    return;
  }

  async saveApplicationScore(applicationId: string, resumeId: string) {
    return;
  }

  async markScreeningFailed(
    applicationId: string,
    resumeId: string,
    message: string,
  ) {
    return;
  }

  async appendApplicationEvent(
    applicationId: string,
    resumeId: string,
    type: string,
    stage: string,
    payload: Record<string, unknown>,
  ) {
    return {} as any;
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    return null;
  }

  async saveResumeCorrection(resumeId: string, correctedJson: string) {
    return null;
  }

  async scoreApplicationManually(input: any) {
    return null;
  }

  async listJobRankings(jobId: string) {
    return [];
  }

  private parseJsonArray<T>(value: string | null): T[] {
    if (!value) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
}
