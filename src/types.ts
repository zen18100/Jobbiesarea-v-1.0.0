export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  icon: string;
  iconClass: string;
  description: string;
  topics: string[];
}
