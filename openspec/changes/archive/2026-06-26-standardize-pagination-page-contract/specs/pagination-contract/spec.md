## ADDED Requirements

### Requirement: 分页接口必须使用统一请求参数
系统 MUST 为所有分页接口提供统一的请求参数结构 `{ pageNo: number; pageSize: number }`，并对参数进行一致性校验。

#### Scenario: 调用分页接口时提交合法分页参数
- **WHEN** 客户端请求任一分页接口并传入合法的 `pageNo` 与 `pageSize`
- **THEN** 系统必须按统一分页协议解析请求，而不能要求模块私有的分页字段名

#### Scenario: 调用分页接口时缺失固定分页字段
- **WHEN** 客户端请求分页接口但未提供 `pageNo` 或 `pageSize`
- **THEN** 系统必须返回明确的参数错误，而不能默默回退到模块自定义默认字段

### Requirement: 分页接口必须返回统一结果结构
系统 MUST 为所有分页接口返回统一的结果结构 `{ total: number; list: any[]; hasNext: boolean }`，并保证字段语义在不同模块中保持一致。

#### Scenario: 分页查询存在结果
- **WHEN** 客户端请求分页接口且存在查询结果
- **THEN** 系统必须返回总数 `total`、当前页数据 `list` 和下一页标记 `hasNext`

#### Scenario: 分页查询无结果
- **WHEN** 客户端请求分页接口但没有任何匹配数据
- **THEN** 系统必须返回 `total` 为 `0`、`list` 为空数组且 `hasNext` 为 `false`

### Requirement: 分页能力必须可被后续接口复用
系统 MUST 将分页请求模型、分页返回模型与底层分页查询模式设计为通用能力，使后续接口可以在不重新定义分页协议的前提下接入分页。

#### Scenario: 新增分页接口复用通用能力
- **WHEN** 开发者为新的业务列表接口接入分页
- **THEN** 该接口必须可以直接复用统一分页模型与查询模式，而不是重新定义一套分页入参和返回结构
