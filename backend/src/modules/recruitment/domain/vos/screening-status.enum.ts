export enum ScreeningStatus {
  UPLOADING = 'UPLOADING', // 文件上传中
  UPLOADED = 'UPLOADED', // 上传完成，等待解析
  PARSING = 'PARSING', // 解析中
  CONFLICT = 'CONFLICT', // 重复，等待用户处理
  SCORING = 'SCORING', // 评分中
  SUCCEEDED = 'SUCCEEDED', // 完成
  FAILED = 'FAILED', // 失败
}
