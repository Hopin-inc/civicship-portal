export type ChangelogEntry = {
  date: string;
  title: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface UpdatePageProps {
  title?: string;
  description?: string;
  entries?: ChangelogEntry[];
  className?: string;
}
