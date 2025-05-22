// types/User.ts

export interface User {
    fullname: string;
    username: string;
    email: string;
    currency?: string;
    language?: string;
    avatar?: string;
    accessToken?: string;
    roles?: string[] | Record<string, string> | Set<string>;
  }
