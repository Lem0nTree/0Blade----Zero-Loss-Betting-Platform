import { MessagesState } from './messages-slice';
import { IMatchSlice } from './matches-slice';
import { IAccountSlice } from './account-slice';

export interface IReduxState {
  messages: MessagesState;
  account: IAccountSlice;
  match: IMatchSlice;
}
