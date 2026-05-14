export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

export interface Citation {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
}

export interface MessageBlock {
  type:
    | 'markdown'
    | 'table'
    | 'kpi'
    | 'timeline'
    | 'citations'
    | 'insight'
    | 'chart'
    | 'code'
    | 'actions';
  data: unknown;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  blocks?: MessageBlock[];
  status: MessageStatus;
  citations?: Citation[];
  createdAt: string;
  sequenceId?: number;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  industry?: IndustryKey;
  sessionId?: string;
  externalSessionKey?: string;
  sequenceId: number;
  messages: Message[];
  status: 'idle' | 'loading' | 'streaming' | 'error';
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export type IndustryKey =
  | 'banking'
  | 'insurance'
  | 'retail'
  | 'telecom'
  | 'healthcare'
  | 'manufacturing';

export interface IndustryTemplate {
  key: IndustryKey;
  label: string;
  tagline: string;
  prompts: string[];
}
