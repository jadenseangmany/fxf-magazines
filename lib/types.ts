export type MagazineStatus = "published" | "coming-soon";

export type Magazine = {
  slug: string;
  month: string;
  year: number;
  status: MagazineStatus;
  pdf?: string;
  cover?: string;
  pages?: string[];
  blurb?: string;
  question?: string;
};

export type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  parentId: string | null;
};
