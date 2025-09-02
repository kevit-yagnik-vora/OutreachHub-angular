export interface Contact {
  _id?: string;
  name: string;
  phoneNumber: string;
  tags: string[];
  workspaceId?: string;
  createdBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
