import { Button, CircularProgress } from '@mui/material';
import { PropsWithChildren, useState } from 'react';

interface NotistakeLoaderButtonProps {
  onClick?: () => Promise<void> | void;
  msg?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export default function NotistakeLoaderButton(props: PropsWithChildren<NotistakeLoaderButtonProps>) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!props.onClick) {
      return;
    }

    setLoading(true);
    try {
      await props.onClick();
    } catch (error) {
      console.error('Button action error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button disabled={props.disabled || loading} onClick={onClick} style={props.style} className={props.className || ''}>
      {loading ? <CircularProgress size={24} className="NotistakeLoaderButton_Loader" /> : props.children}
    </Button>
  );
}
