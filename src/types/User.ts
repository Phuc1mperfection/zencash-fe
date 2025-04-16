// types/User.ts

export interface User {
    fullname: string;
    username: string;
    email: string;
    currency?: string;
    language?: string;
    avatar?: string;
    accessToken?: string;
    // Add more fields if your user object has them
  }
