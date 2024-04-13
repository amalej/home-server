import { Router } from "express";
import {
  addNewIssue,
  deleteIssue,
  generateRandomUUID,
  getIssues,
} from "../../../utils";
import { IssueReport } from "../../../types";

const issues = Router();

issues.get("/", async (req, res) => {
  const issues = await getIssues();
  return res.json(issues);
});

issues.post("/", async (req, res) => {
  const issueReport = {
    id: generateRandomUUID(25),
    ...req.body,
  } as IssueReport;
  await addNewIssue(issueReport);
  return res.send("Ok");
});

issues.delete("/", async (req, res) => {
  const issueId = req.body.id;
  await deleteIssue(issueId);
  return res.send("delete");
});

export default issues;
