export type TemplateType = 'Text' | 'Text-Image';

export interface MessageContent {
  _id?: string; // present in GET responses
  text: string;
  imageUrl?: string;
}

export interface WorkspaceMini {
  _id: string;
  name: string;
  createdBy?: string;
  description?: string;
}

export interface MessageTemplate {
  _id: string;
  name: string;
  type: TemplateType;
  message: MessageContent;
  workspace?: WorkspaceMini;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
