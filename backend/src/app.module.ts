import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { BigModelModule } from './core/bigmodel/bigmodel.module';
import { DatabaseModule } from './core/database/database.module';
// import { PdfModule } from './core/pdf/pdf.module';
// import { StorageModule } from './core/storage/storage.module';
// import { SseModule } from './core/sse/sse.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
// import { RecruitmentScreeningModule } from './modules/recruitment/infrastructure/external/recruitment-screening.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    RecruitmentModule,
    // StorageModule,
    // SseModule,
    // PdfModule,
    // BigModelModule,
    // RecruitmentScreeningModule,
    // RecruitmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
