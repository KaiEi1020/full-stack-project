export interface PageResponse<T> {
  total: number;
  list: T[];
  hasNext: boolean;
}

export interface PageQuery {
  pageNo: number;
  pageSize: number;
}

export interface PageResult<T> {
  total: number;
  list: T[];
}

export function toPageResponse<T>(
  result: PageResult<T>,
  query: PageQuery,
): PageResponse<T> {
  return {
    total: result.total,
    list: result.list,
    hasNext: query.pageNo * query.pageSize < result.total,
  };
}
