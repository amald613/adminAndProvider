export interface AddUserOptions {
  name: string;
  email: string;
  password: string;
  role: string;
  company?: string;
  cancel?: boolean;
}

export interface UserData {
  id?: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  createdAt?: Date;
}

export interface TestUser extends UserData {
  isTestData: boolean;
  cleanup: boolean;
}