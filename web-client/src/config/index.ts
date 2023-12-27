export const expressEndpoint =
  `${window.location.href.match(/(http:\/\/)(.*?)(?=:)/)![0]}:5000` ||
  "http://localhost:5000";
