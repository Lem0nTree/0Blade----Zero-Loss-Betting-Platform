import { Button, CircularProgress } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { useAsyncFnWithNotistake } from '../store/slices/messages-slice';

interface NotistakeLoaderButtonProps {
  onClick?: () => Promise<void>;
  msg?: string;
  style?;
  className?;
  disabled?: boolean;
}

export default function NotistakeLoaderButton(props: PropsWithChildren<NotistakeLoaderButtonProps>) {
  const [loading, setLoading] = useState(false);
  const withNotistake = useAsyncFnWithNotistake();

  const onClick = async () => {
    if (!props.onClick) {
      return;
    }

    setLoading(true);
    if (props.msg) {
      await withNotistake(props.msg, props.onClick);
    } else {
      await props.onClick();
    }
    setLoading(false);
  };

  return (
    <Button disabled={props.disabled || loading} onClick={onClick} style={props.style} className={props.className || ''}>
      {loading ? <CircularProgress size={24} className="NotistakeLoaderButton_Loader" /> : props.children}
    </Button>
  );
}
