export interface ShowDirectory {
  relativePath: string;
  parent: string;
}

export interface UserData {
  show: {
    lastWatched: string;
    lastDateWatched: Date;
    percentLoaded: number;
  };
}

export interface ShowSubtitleData {
  path: string;
  label: string;
}

type APIStatus = "success" | "error" | "loading";
export interface APIResponse {
  status: APIStatus;
  code: number;
  body: string;
}
