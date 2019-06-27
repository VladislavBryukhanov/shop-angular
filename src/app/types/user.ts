export interface User extends Credentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  birthday: number;
  contactInfo: ContactInfo;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
}
