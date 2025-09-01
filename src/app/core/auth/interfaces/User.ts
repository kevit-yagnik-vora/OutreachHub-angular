export interface IWorkspaceRole {
  workspaceId: string;
  role: 'Editor' | 'Viewer';
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isAdmin?: boolean;
  workspaces: IWorkspaceRole[];
  createdAt: string;
  updatedAt: string;
}
