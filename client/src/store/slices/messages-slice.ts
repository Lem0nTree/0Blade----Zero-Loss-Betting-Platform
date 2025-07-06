import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';

export type Message = IMessage & {
  severity: any;
};

export interface MessagesState {
  message: Message | null;
}

interface IMessage {
  text: string;
  error?: any;
}

// Adds a message to the store
const createMessage = function (state: MessagesState, severity: any, text: IMessage) {
  const message: Message = {
    severity,
    ...text,
  };
  state.message = message;
};
const initialState: MessagesState = {
  message: null,
};
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Creates an error message
    error(state, action: PayloadAction<IMessage>) {
      createMessage(state, 'error', action.payload);
    },
    // Creates an information message
    info(state, action: PayloadAction<IMessage>) {
      createMessage(state, 'info', action.payload);
    },
    warning(state, action: PayloadAction<IMessage>) {
      createMessage(state, 'warning', action.payload);
    },
    success(state, action: PayloadAction<IMessage>) {
      createMessage(state, 'success', action.payload);
    },
    // Closes a message
    close(state) {
      state.message = null;
    },
  },
});

export const { error, info, close, warning, success } = messagesSlice.actions;

export default messagesSlice.reducer;

export function useNotistack() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showMessage = (severity: string, persist: boolean) => {
    return (msg: string, err?: any) => {
      const message: Message = {
        text: msg,
        severity,
        error: err,
      };
      enqueueSnackbar(JSON.stringify(message));
      if (!persist) {
        setTimeout(() => {
          closeSnackbar();
        }, 4000);
      }
    };
  };

  return {
    error: (msg: string, persist?: boolean, err?: any) => showMessage('error', persist)(msg, err),
    info: (msg: string, persist?: boolean, err?: any) => showMessage('info', persist)(msg, err),
    close: () => closeSnackbar(),
    warning: (msg: string, persist?: boolean, err?: any) => showMessage('warning', persist)(msg, err),
    success: (msg: string, persist?: boolean, err?: any) => showMessage('success', persist)(msg, err),
  };
}

export function useFormattedNotistake() {
  const { close, error, info, success, warning } = useNotistack();

  return {
    close,
    error,
    info,
    success,
    warning,
    formattedError: (msg: string, persist?: boolean, err?: any) => error(`Error while ${msg}`, persist, err),
    formattedInfo: (msg: string, persist?: boolean, err?: any) => info(`${msg}...`, persist, err),
    formattedSuccess: (msg: string, persist?: boolean, err?: any) => success(`${msg} successful`, persist, err),
  };
}

export function useAsyncFnWithNotistake() {
  const notistack = useFormattedNotistake();

  const withNotistake = async (msg: string, fn: () => Promise<void>) => {
    try {
      notistack.formattedInfo(msg, true);
      await fn();
      notistack.close();
      notistack.formattedSuccess(msg);
    } catch (e) {
      console.log(e);
      notistack.close();
      notistack.formattedError(msg, true, e.message);
    }
  };

  return withNotistake;
}
