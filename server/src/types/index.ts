export interface ShowParentDirectory {
  [key: string]: string;
}

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

type IssueReportType = "bug" | "feature-request" | "feedback";

export interface IssueReport {
  id: string;
  type: IssueReportType;
  description: string;
}
