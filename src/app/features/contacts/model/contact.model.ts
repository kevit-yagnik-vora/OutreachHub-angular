export interface IContact {
  _id?: string;
  name: string;
  phoneNumber?: string;
  tags?: string[];
  workspaceId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
