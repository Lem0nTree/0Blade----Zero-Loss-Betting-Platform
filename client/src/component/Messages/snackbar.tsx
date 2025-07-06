import React, { useState, forwardRef, useCallback } from 'react';
import classnames from 'classnames';

import { makeStyles } from '@mui/styles';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import { Theme } from '@mui/system';
import { Color } from '@mui/material';

import { useSnackbar, SnackbarContent } from 'notistack';
import { Message } from '../../store/slices/messages-slice';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles((theme: Theme) => ({
  // root: {
  //   [theme.breakpoints.up('sm')]: {
  //     minWidth: '344px !important',
  //   },
  //   maxWidth: 500,
  // },
  // card: {
  //   width: '100%',
  // },
  // error: {
  //   backgroundColor: '#d32f2f',
  // },
  // info: {
  //   backgroundColor: '#2979ff',
  // },
  // warning: {
  //   backgroundColor: '#ffa000',
  // },
  // success: {
  //   backgroundColor: '#43a047',
  // },
  // typography: {
  //   color: '#FFFFFF',
  //   fontFamily: 'Montserrat SemiBold',
  // },
  // actionRoot: {
  //   padding: '8px 8px 8px 16px',
  //   justifyContent: 'space-between',
  //   color: '#FFFFFF',
  // },
  // icons: {
  //   marginLeft: 'auto',
  // },
  // expand: {
  //   padding: '8px 8px',
  //   transform: 'rotate(0deg)',
  //   // transition: theme.transitions.create('transform', {
  //   //   duration: theme.transitions.duration.shortest,
  //   // }),
  //   color: '#FFFFFF',
  // },
  // expandOpen: {
  //   transform: 'rotate(180deg)',
  // },
  // collapse: {
  //   padding: 16,
  // },
  // checkIcon: {
  //   fontSize: 20,
  //   color: '#b3b3b3',
  //   paddingRight: 4,
  // },
  // checkIconCopy: {
  //   color: '#43a047',
  // },
  // button: {
  //   padding: 0,
  //   textTransform: 'none',
  // },
  // errorWrap: {
  //   marginTop: 10,
  // },
  // errorText: {
  //   whiteSpace: 'pre-wrap',
  //   maxHeight: 300,
  //   overflow: 'auto',
  //   background: 'rgba(0,0,0,0.1)',
  //   padding: 5,
  //   borderRadius: 5,
  // },
}));

const SnackMessage = forwardRef<
  HTMLDivElement,
  { id: string | number; message: Message }
>((props, ref) => {
  // const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(props.id);
  }, [props.id, closeSnackbar]);

  const getIcon = (severity: any) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color='inherit' />;
      case 'info':
        return <InfoIcon color='inherit' />;
      case 'success':
        return <SuccessIcon color='inherit' />;
      case 'warning':
        return <WarningIcon color='inherit' />;
      default:
        return <div />;
    }
  };

  return (
    <SnackbarContent ref={ref} className='as_root'>
      <Card className={'as_card as' + props.message.severity}>
        <CardActions className='asactionRoot'>
          {getIcon(props.message.severity)}
          <Typography variant='subtitle2' className='as_pp'>
            {props.message.text}
          </Typography>
          <div className='asicons'>
            {props.message.error && (
              <IconButton
                aria-label='Show more'
                className='asexpand'
                onClick={handleExpandClick}
              >
                <ExpandMoreIcon color='inherit' />
              </IconButton>
            )}
            <IconButton className='asexpand' onClick={handleDismiss}>
              <CloseIcon color='inherit' />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <Paper className='ascollapse'>
            <CopyToClipboard
              text={JSON.stringify(props.message.error)}
              onCopy={() => setIsCopy(true)}
            >
              <Button size='small' className='asbutton'>
                <CheckCircleIcon className='ascheckIcon' />
                Copy to clipboard
              </Button>
            </CopyToClipboard>
            <div className='aserrorWrap'>
              <Typography>Error message: </Typography>
              <Typography className='aserrorText'>
                {JSON.stringify(props.message.error, null, 2)}
              </Typography>
            </div>
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  );
});

export default SnackMessage;
