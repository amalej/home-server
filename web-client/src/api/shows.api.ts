import { serverEndpoint } from "../config";
import { APIResponse } from "../types";

export async function getShows(): Promise<APIResponse> {
  const endpoint = `${serverEndpoint}/api/v1/shows`;
  const res = await fetch(endpoint);
  const resTextContent = await res.text();
  if (res.status === 200) {
    return {
      status: "success",
      code: res.status,
      body: resTextContent,
    };
  } else {
    return {
      status: "error",
      code: res.status,
      body: resTextContent,
    };
  }
}

export async function getShowDetails(
  showPath: string,
  parent: string
): Promise<APIResponse> {
  const endpoint = `${serverEndpoint}/api/v1/shows/${showPath}?&parent=${parent}`;
  const res = await fetch(endpoint);
  const resTextContent = await res.text();
  if (res.status === 200) {
    return {
      status: "success",
      code: res.status,
      body: resTextContent,
    };
  } else {
    return {
      status: "error",
      code: res.status,
      body: resTextContent,
    };
  }
}
