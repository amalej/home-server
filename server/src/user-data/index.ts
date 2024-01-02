import { UserData } from "../types";

let userDataMap: {
  [key: string]: UserData;
} = {};

export function setUserWatchingShowData(
  userId: string,
  show: string,
  percentLoaded: number
) {
  const currentDate = new Date();
  if (userDataMap[userId]) {
    userDataMap[userId] = {
      ...userDataMap[userId],
      show: {
        lastWatched: show,
        lastDateWatched: currentDate,
        percentLoaded,
      },
    };
  } else {
    userDataMap[userId] = {
      show: {
        lastWatched: show,
        lastDateWatched: currentDate,
        percentLoaded,
      },
    };
  }
}

export function getUserDataMap() {
  return userDataMap;
}

export function deleteUserData(userId: string) {
  delete userDataMap[userId];
}
