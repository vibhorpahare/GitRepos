export interface IRepoList {
  id: number;
  full_name: string;
  name: string;
  stargazers_count: number;
  description: string;
  language: string;
  owner: {
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}
