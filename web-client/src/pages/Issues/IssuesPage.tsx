import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useGetIssues } from "./IssuePage.hooks";
import { serverEndpoint } from "../../config";
import ipCss from "./IssuesPage.module.css";
import CloseIcon from "@mui/icons-material/Close";

function IssuesPage() {
  const [issueType, setIssueType] = useState("bug");
  const issues = useGetIssues();
  const [issueDescription, setIssueDescription] = useState<string>("");

  async function submitReport() {
    const res = await fetch(`${serverEndpoint}/api/v1/issues`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: issueType,
        description: issueDescription,
      }),
    });

    if (res.status === 200) {
      window.location.reload();
    }
  }

  async function closeIssue(issueId: string) {
    const res = await fetch(`${serverEndpoint}/api/v1/issues`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: issueId,
      }),
    });
    if (res.status === 200) {
      window.location.reload();
    }
  }

  function renderIssueFilingSection() {
    return (
      <>
        <Grid item xs={12}>
          <TextField
            label="Issue description"
            multiline
            minRows={4}
            maxRows={10}
            variant="filled"
            inputProps={{ style: { color: "white" } }}
            sx={{
              width: "100%",
              backgroundColor: "#12121288",
            }}
            InputLabelProps={{
              sx: {
                // set the color of the label when not shrinked
                color: "white",
              },
            }}
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sx={{ height: "1.5em" }}></Grid>
        <Grid item xs={6}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel sx={{ color: "white" }}>Issue type</InputLabel>
            <Select
              style={{ color: "white", background: "#12121288" }}
              value={issueType}
              label="Issue type"
              variant="filled"
              onChange={(e) => setIssueType(e.target.value)}
            >
              <MenuItem value={"bug"}>Bug</MenuItem>
              <MenuItem value={"feature-request"}>Feature request</MenuItem>
              <MenuItem value={"feedback"}>Feedback</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          sx={{ width: "100%" }}
          xs={6}
          display="flex"
          justifyContent="flex-end"
        >
          <Grid item alignContent="center">
            <Button
              variant="contained"
              sx={{ height: "90%" }}
              onClick={submitReport}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <Box>
      <Grid container sx={{ padding: "2em" }}>
        <Grid container item xs={12}>
          {renderIssueFilingSection()}
        </Grid>
        <Grid container item xs={12} sx={{ height: "2em" }}></Grid>
        <Grid
          container
          item
          sx={{ height: "2em" }}
          className={ipCss["issue-header"]}
        >
          <Grid item xs={12}>
            <Divider
              orientation="horizontal"
              flexItem
              className={ipCss["issue-divider"]}
            />
          </Grid>
          <Grid item xs={12}>
            Issues
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ height: "1em" }}></Grid>
        <Grid item xs={12}>
          {issues.map((issue) => (
            <Grid key={issue.id} item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "#12121288",
                  color: "white",
                  padding: "0.75em",
                }}
              >
                <Box>
                  <Grid container>
                    <Grid item xs>
                      <Chip
                        label={issue.type}
                        variant="outlined"
                        sx={{ color: "white" }}
                      />
                    </Grid>
                    <Grid container item xs justifyContent="flex-end">
                      <CloseIcon onClick={() => closeIssue(issue.id)} />
                    </Grid>
                  </Grid>
                </Box>
                <Grid container item xs={12} sx={{ height: "0.75em" }}></Grid>
                <Box>
                  <div>{issue.description}</div>
                </Box>
              </Card>
              <Grid container item xs={12} sx={{ height: "1em" }}></Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default IssuesPage;
