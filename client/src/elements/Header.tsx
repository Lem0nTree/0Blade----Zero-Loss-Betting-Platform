import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Sidebar from './Sidebar';
import Banner from './Banner';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const headersData = [
  {
    label: 'Dashboard',
    href: '/',
  },
  // {
  //   label: 'Match',
  //   href: '/match',
  // },
  {
    label: 'Active Bets',
    href: '/active-bets',
  },
  {
    label: 'Bets History',
    href: '/history-bets',
  },
  {
    label: 'FAQ',
    href: '/faq',
  },
];
const headersDataTwo = [
  {
    label: 'Pool',
    href: '  https://www.sushi.com/katana/swap',
  },
  {
    label: 'Farm',
    href: 'https://katana.yearn.space/',
  },
  {
    label: 'Lending',
    href: 'https://morpho.org/',
  },
];

const useStyles = makeStyles(() => ({
  logo: {
    fontFamily: 'Work Sans, sans-serif',
    fontWeight: 600,
    color: '#FFFEFE',
    textAlign: 'left',
  },
  menuButton: {
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 700,
    size: '18px',
    marginLeft: '38px',
  },

  drawerContainer: {
    padding: '20px 30px',
  },
}));

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEltwo, setAnchorEltwo] = React.useState<null | HTMLElement>(null);
  const opentwo = Boolean(anchorEltwo);
  const handleClicktwo = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEltwo(event.currentTarget);
  };
  const handleClosetwo = () => {
    setAnchorEltwo(null);
  };

  const [anchorElthree, setAnchorElthree] = React.useState<null | HTMLElement>(null);
  const openthree = Boolean(anchorElthree);
  const handleClickthree = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElthree(event.currentTarget);
  };
  const handleClosethree = () => {
    setAnchorElthree(null);
  };

  const { menuButton } = useStyles();

  const [state, setState] = useState({
    mobileView: false,
  });

  const { mobileView } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1199
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return (
      <Toolbar className="toolbar">
        <a href="/" style={{ textDecoration: 'none' }}>
          {femmecubatorLogo}
        </a>
        <div className="insdmn">
          {getMenuButtons()}
          {getDrawerChoicesTwo()}
        </div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    return (
      <Toolbar>
        <a href="/" style={{ textDecoration: 'none' }}>
          {femmecubatorLogo}
        </a>
      </Toolbar>
    );
  };

  const getDrawerChoicesTwo = () => {
    return headersDataTwo.map(({ label, href }) => {
      return (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mbllnks"
        >
          {label}
        </a>
      );
    });
  };

  const femmecubatorLogo = <Box component="img" className="logoheader" src="/img/0blade.png" />;

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Button
          key={label}
          color="inherit"
          className={menuButton}
          href={href}
        >
          {label}
        </Button>
      );
    });
  };
  
  const [chain, setChain] = React.useState(129399);

  useEffect(() => {
    setTheme(chain);
  }, [chain]);

  const handleChange = (event: SelectChangeEvent) => {
    setChain(+event.target.value);
  };

  const setTheme = (value: number) => {
    Chains.forEach((item) => {
      document.body.classList.remove(item.theme);
    });
    const current = Chains.find((item) => item.id === value);
    if (current) {
      document.body.classList.add(current.theme);
    }
  };
  
  const splitLocation = window.location.pathname.split('/');

  return (
    <>
      <Box className="botum_manu_box">
        <div className="bet_btn_p">
          <Box
            className={
              splitLocation[1] === '' || splitLocation[1] === 'active-bets' || splitLocation[1] === 'history-bets'
                ? 'manu_img_paert_aj active'
                : 'manu_img_paert_aj'
            }
          >
            <img src="/img/bet_img_aj.svg" alt="" />
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              Bet
            </Button>
          </Box>

          <Menu
            className="btn_manu"
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="/">Dashboard</a>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="/active-bets">Active Bets</a>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="/history-bets">Bets History</a>
                </li>
              </ul>
            </Box>
          </Menu>
          <Box className={splitLocation[1] === 'farm' || splitLocation[1] === 'pool' ? 'manu_img_paert_aj active' : 'manu_img_paert_aj'}>
            <img src="/img/farm_img_aj.svg" alt="" />
            <Button
              id="basic-button"
              aria-controls={opentwo ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={opentwo ? 'true' : undefined}
              onClick={handleClicktwo}
            >
              Farm
            </Button>
          </Box>
          <Menu
            className="btn_manu"
            id="basic-menu"
            anchorEl={anchorEltwo}
            open={opentwo}
            onClose={handleClosetwo}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="/farm">LP Stake</a>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="/pool">Pool</a>
                </li>
              </ul>
            </Box>
          </Menu>
          <Box className={splitLocation[1] === 'faq' ? 'manu_img_paert_aj active' : 'manu_img_paert_aj'}>
            <a href="/faq" className="faq_l img_set_parnt_aj">
              <img src="/img/faq_ima_aj.svg" alt="" />
              Faq
            </a>
          </Box>
          <Box className="manu_img_paert_aj">
            <Button
              id="basic-button"
              aria-controls={openthree ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openthree ? 'true' : undefined}
              onClick={handleClickthree}
              className="faq_botn_only"
            >
              {/* <span className='spn_dots'>...</span>  */}
              <img src="/img/dot_img_aj.svg" alt="" />
              <Typography>More</Typography>
            </Button>
          </Box>
          <Menu
            className="btn_manu"
            id="basic-menu"
            anchorEl={anchorElthree}
            open={openthree}
            onClose={handleClosethree}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="https://randomdeveloper.gitbook.io/docs.gamblefi.io/cronosports/cronosports-zero-loss-betting">Documentation</a>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <a href="/">Twitter</a>
                </li>
              </ul>
            </Box>
          </Menu>
        </div>
      </Box>
      <div className="header">
        <AppBar>
          <Box className="yllw_bnnr">
            <b>This is a Pre Release of the Betting Platform, which is subject to change.</b>
            &nbsp;
          </Box>
          {mobileView ? displayMobile() : displayDesktop()}
          <Box className="right_header">
            {/* def_btn_v2 */}
            <Box className="head_select">
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={chain.toString()}
                  displayEmpty
                  label="chain"
                  inputProps={{ 'aria-label': 'Without label' }}
                  className="def_btn_v2"
                  id="demo-simple-select-helper"
                  MenuProps={{ className: 'Header_sl_drpdn' }}
                  onChange={handleChange}
                >
                  {Chains.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="hdrdvdr" />
            <Button className="def_btn_gray">
              <span>Connect Wallet</span>
              <Box component="img" src="/img/wallet_ic.svg" />
            </Button>
          </Box>
        </AppBar>
      </div>
      <Sidebar />
      <Banner />
    </>
  );
}

const Chains = [
  {
    id: 129399,
    name: (
      <>
        Tatara&nbsp;<span>ETH</span>
      </>
    ),
    theme: 'binance',
  },
  {
    id: 129399,
    name: (
      <>
        Tatara&nbsp;<span>ETH</span>
      </>
    ),
    theme: 'binance',
  },
  {
    id: 747474,
    name: (
      <>
        Katana&nbsp;<span>ETH</span>
      </>
    ),
    theme: 'binance',
  },
];
