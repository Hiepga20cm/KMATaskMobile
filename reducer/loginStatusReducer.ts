import { Reducer } from "redux";
import { actionTypes, SetStatusLoginAction, } from "../actions/types";


export interface StatusLoginState {
    status: boolean
}

const initState = {
    status: false
};

export const statusLoginReducer: Reducer<StatusLoginState, SetStatusLoginAction> = (
    state = initState,
    action
) => {
    switch (action.type) {
        case actionTypes.setStatus:
            return {
                ...state,
                status : action.payload.status
            };
        default:
            return state;
    }
};
