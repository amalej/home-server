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
