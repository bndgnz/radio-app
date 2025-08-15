export interface Presenter {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar?: string;
}

export interface ShowInfo {
  title: string;
  schedule: string;
  duration: string;
  about: string;
  sponsor: string;
  presenters: Presenter[];
  audioUrl?: string;
}

export type PresenterCardVariant = "mini" | "detailed";