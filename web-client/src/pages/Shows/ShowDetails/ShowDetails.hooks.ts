import { useEffect, useState } from "react";
import { getShowDetails as getShowDetailsAPI } from "../../../api/shows.api";
import { APIResponse } from "../../../types";
import { useLocation } from "react-router-dom";

export function useGetShowDetails(showPath: string, parent: string | null) {
  const [showDetails, setShowDetails] = useState<APIResponse>({
    status: "loading",
    code: 0,
    body: "",
  });
  const location = useLocation();
  async function getShowDetails() {
    if (parent) {
      const res = await getShowDetailsAPI(showPath, parent);
      setShowDetails(res);
    }
  }
  useEffect(() => {
    setShowDetails({
      status: "loading",
      code: 0,
      body: "",
    });
    getShowDetails();
  }, [location]);

  return showDetails;
}
