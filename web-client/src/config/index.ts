export const serverEndpoint =
  `${window.location.href.match(/(http:\/\/)(.*?)(?=:)/)![0]}:5000` ||
  "http://localhost:5000";
