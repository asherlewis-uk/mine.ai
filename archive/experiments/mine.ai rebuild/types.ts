export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  characterId: string;
  messages: Message[];
  modelId: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  systemPrompt: string;
  tags: string[];
}

export interface Model {
  id: string;
  name: string;
  description: string;
  contextWindow?: number;
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
}

export interface SystemSettings {
  apiUrl: string;
  activeModel: string;
  temperature: number;
  globalSystemPrompt: string;
  streamResponse: boolean;
  theme: 'dark' | 'light';
  ollamaHost: string;
}

export const DEFAULT_USER: UserProfile = {
  name: 'Asher Lewis',
  role: 'Prompt Engineer',
  bio: 'I am a prompt engineer. All code generation must be complete, runnable files.',
  avatarColor: 'bg-indigo-500'
};

export const DEFAULT_SETTINGS: SystemSettings = {
  apiUrl: '/api/chat',
  ollamaHost: 'http://host.docker.internal:11434',
  activeModel: 'Gaius:latest',
  temperature: 0.7,
  globalSystemPrompt: 'You are part of the MineAI Neural Interface. Adhere to strict roleplay protocols.',
  streamResponse: true,
  theme: 'dark'
};

export const DEFAULT_CHARACTERS: Character[] = [
  { id: 'c1', name: 'Gaius', role: 'Reasoning Engine', avatar: 'G', color: 'from-blue-600 to-indigo-500', systemPrompt: 'You are Gaius, a logical reasoning engine.', tags: ['Logic'] },
  { id: 'c2', name: 'Dolfino', role: 'Speed Cognition', avatar: 'D', color: 'from-cyan-500 to-blue-400', systemPrompt: 'You are Dolfino, optimized for speed.', tags: ['Speed'] }
];

