export type TemplateType = 'Text' | 'Text-Image';

export interface IMessageContent {
  _id?: string; // present in GET responses
  text: string;
  imageUrl?: string;
}

export interface IWorkspaceMini {
  _id: string;
  name: string;
  createdBy?: string;
  description?: string;
}

export interface IMessageTemplate {
  _id: string;
  name: string;
  type: TemplateType;
  message: IMessageContent;
  workspace?: IWorkspaceMini;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
