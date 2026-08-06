const STORAGE_KEY = "carasta.merch.wishlist.v1";

export const MerchWishlist = {
  load(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  },

  save(ids: string[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  },

  has(productId: string): boolean {
    return this.load().includes(productId);
  },

  add(productId: string): string[] {
    const next = this.has(productId) ? this.load() : [...this.load(), productId];
    this.save(next);
    return next;
  },

  remove(productId: string): string[] {
    const next = this.load().filter((id) => id !== productId);
    this.save(next);
    return next;
  },

  toggle(productId: string): { ids: string[]; added: boolean } {
    if (this.has(productId)) {
      return { ids: this.remove(productId), added: false };
    }
    return { ids: this.add(productId), added: true };
  },
};
