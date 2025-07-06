import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3Context } from '../../hooks';
import { DEFAULD_NETWORK } from '../../constants';
import { Box, Button } from '@mui/material';
import { accountEllipsis } from '../../helpers';

function ConnectMenu() {
  const {
    connect,
    disconnect,
    connected,
    web3,
    providerChainID,
    checkWrongNetwork,
    address,
  } = useWeb3Context();
  const dispatch = useDispatch();
  const [isConnected, setConnected] = useState(connected);

  let buttonText = 'Connect Wallet';
  let clickFunc: any = connect;
  let buttonStyle = {};

  if (isConnected) {
    buttonText = 'Disconnect';
    clickFunc = disconnect;
  }

  if (isConnected && providerChainID !== DEFAULD_NETWORK) {
    buttonText = 'Wrong network';
    buttonStyle = { backgroundColor: 'rgb(255, 67, 67)' };
    clickFunc = () => {
      checkWrongNetwork();
    };
  }

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <>
      <Button className='def_btn_gray' onClick={clickFunc}>
        <span>{buttonText}</span>
        <Box component='img' src='/img/wallet_ic.svg' />
      </Button>
      {/* <Button className="wllt_btn" style={buttonStyle} onClick={clickFunc}>
            <img src="/img/wallet.svg" alt="" />
            {buttonText}
            
        </Button> */}
    </>
  );
}

export default ConnectMenu;
