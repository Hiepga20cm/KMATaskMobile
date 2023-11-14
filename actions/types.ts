export enum actionTypes {
    setStatus
}
export interface Status {
   status : boolean
}
interface SetStatus {
    type : actionTypes.setStatus;
    payload: {
      status : boolean
    }
}
export type SetStatusLoginAction = 
    | SetStatus;