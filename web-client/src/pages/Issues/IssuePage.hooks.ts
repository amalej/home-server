import { useEffect, useState } from "react";
import { serverEndpoint } from "../../config";

type IssueReportType = "bug" | "feature-request" | "feedback";

export interface IssueReport {
  id: string;
  type: IssueReportType;
  description: string;
}

export function useGetIssues() {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  useEffect(() => {
    async function getIssues() {
      const res = await fetch(`${serverEndpoint}/api/v1/issues`);
      const text = await res.text();
      const obj = JSON.parse(text);
      setIssues(Object.values(obj));
    }

    getIssues();
  }, []);

  return issues;
}
