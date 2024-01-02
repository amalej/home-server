function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function getUserId() {
  let userId = localStorage.getItem("userId");
  if (userId === null) {
    userId = `${makeId(4)}-${makeId(4)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
}

export function resetActiveMovie(movieName: string) {
  localStorage.setItem("activeMovie", movieName);
  localStorage.setItem("activevMovieTime", "0");
}

export function setActiveMovieTime(seconds: number) {
  localStorage.setItem("activevMovieTime", seconds.toString());
}

export function getActiveMovieData() {
  const movieName = localStorage.getItem("activeMovie");
  const activevMovieTime = parseInt(
    localStorage.getItem("activevMovieTime") || "0"
  );
  return {
    name: movieName,
    time: activevMovieTime,
  };
}
