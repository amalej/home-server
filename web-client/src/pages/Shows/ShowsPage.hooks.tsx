import { useState, useEffect } from "react";
import { getShows as getShowsAPI } from "../../api/shows.api";
import { APIResponse } from "../../types";

export function useGetShows() {
  const [shows, setShows] = useState<APIResponse>({
    status: "loading",
    code: 0,
    body: "",
  });
  async function handleResponse() {
    const res = await getShowsAPI();
    setShows(res);
  }

  useEffect(() => {
    handleResponse();
  }, []);

  return shows;
}
