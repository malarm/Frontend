export type QueryState = {
  query: Record<string, string> & {
    req?: string;
    email?: string;
    redirectOnAuth?: string;
  };
};
