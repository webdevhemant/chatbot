import { z } from 'zod';

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ArtifactKind = 'text' | 'code' | 'sheet' | 'image';

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  'chat-title': string;
};

// ChatMessage is typed as a generic message compatible with @ai-sdk/react's UIMessage
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
  parts?: unknown[];
  metadata?: MessageMetadata;
  createdAt?: Date;
};

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
