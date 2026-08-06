import type { MerchProduct, PaginatedResponse } from "@carasta/types";
import { MOCK_MERCH } from "../seed/merch";

function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const merchService = {
  async getProducts(params: {
    category?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<PaginatedResponse<MerchProduct>> {
    await delay();
    const { category, page = 1, pageSize = 12 } = params;
    let data = category ? MOCK_MERCH.filter((p) => p.category === category) : MOCK_MERCH;
    const total = data.length;
    const start = (page - 1) * pageSize;
    return { data: data.slice(start, start + pageSize), total, page, pageSize, hasNextPage: start + pageSize < total };
  },

  async getProduct(id: string): Promise<MerchProduct | null> {
    await delay(80);
    return MOCK_MERCH.find((p) => p.id === id) ?? null;
  },

  async getFeatured(limit = 4): Promise<MerchProduct[]> {
    await delay(80);
    return MOCK_MERCH.sort((a, b) => b.rating - a.rating).slice(0, limit);
  },
};
