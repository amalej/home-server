import { serverEndpoint } from "../config";

export async function getPoster(parent: string, showPath: string) {
  const endpoint = `${serverEndpoint}/api/v1/poster?parent=${parent}&show-path=${showPath}`;
  const res = await fetch(endpoint);
  return res;
}
