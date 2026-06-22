import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  type CreateJobCommand,
  type JobView,
  type UpdateJobCommand,
  JobService,
} from '../../application/service/job.service';
import type { PageRequestDto } from '@/common/pagination/page-request.dto';
import type { PageResponse } from '@/common/pagination/page-response';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('job')
@Controller('api/recruitment/jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiOperation({ summary: '创建职位' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: '创建成功', type: CreateJobDto })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  createJob(@Body() body: CreateJobDto) {
    const command: CreateJobCommand = body;
    return this.jobService.create(command);
  }

  @Get()
  @ApiOperation({ summary: '获取职位分页列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  jobPage(@Query() query: PageRequestDto): Promise<PageResponse<JobView>> {
    return this.jobService.jobPage(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取职位详情' })
  @ApiParam({ name: 'id', description: '职位 ID', type: String })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '职位不存在' })
  getJob(@Param('id') id: string) {
    return this.jobService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新职位' })
  @ApiParam({ name: 'id', description: '职位 ID', type: String })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '职位不存在' })
  updateJob(@Param('id') id: string, @Body() body: UpdateJobDto) {
    const command: UpdateJobCommand = body;
    return this.jobService.update(id, command);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除职位' })
  @ApiParam({ name: 'id', description: '职位 ID', type: String })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '职位不存在' })
  deleteJob(@Param('id') id: string) {
    return this.jobService.delete(id);
  }
}
