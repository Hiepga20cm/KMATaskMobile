import { actionTypes } from "./types";

export const setConfig = (status:boolean) => {
  return {
    type: actionTypes.setStatus,
    payload: {
      status
    },
  };
};
