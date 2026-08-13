export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  skip: number;
  total: number;
  pages: number;
}

export const getPaginationParams = (
  { page, limit }: PaginationParams,
  { defaultLimit = 25, maxLimit = 100 } = {}
) => {
  const parsedPage = Math.max(parseInt(String(page)) || 1, 1);
  const pageSize = Math.min(parseInt(String(limit)) || defaultLimit, maxLimit);
  const skip = (parsedPage - 1) * pageSize;

  return { page: parsedPage, pageSize, skip };
};

export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  skip: number,
  total: number
): PaginationMeta => ({
  page,
  pageSize,
  skip,
  total,
  pages: Math.ceil(total / pageSize),
});
