import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, Link, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Sidebar from './Sidebar';
import Banner from './Banner';
import ConnectMenu from '../component/connect-button';
import { accountEllipsis } from '../helpers';
import { useWeb3Context } from '../hooks';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { NavLink } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import { useLocation } from 'react-router-dom';

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

  const { logo, menuButton, drawerContainer } = useStyles();

  const { address, chainID } = useWeb3Context();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

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
        <Link
          {...{
            component: RouterLink,
            to: '/',
            color: 'inherit',
            style: { textDecoration: 'none' },
          }}
        >
          {femmecubatorLogo}
        </Link>
        <div className="insdmn">
          {getMenuButtons()}
          {getDrawerChoicesTwo()}
        </div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        {/* <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
          }}
          className="menu_btn"
        >
          <Box component="img" src="/img/brgr_ic.svg" className="desk_img" />
          <Box component="img" src="/img/close_ic.svg" className="mobile_img" />
        </IconButton> */}

        {/* <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
          className="as_drwr"
        >
          <div className={drawerContainer}>
            {getDrawerChoices()}
            {getDrawerChoicesTwo()}
          </div>
        </Drawer> */}

        <Link
          {...{
            component: RouterLink,
            to: '/',
            color: 'inherit',
            style: { textDecoration: 'none' },
          }}
        >
          {femmecubatorLogo}
        </Link>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Link
          {...{
            component: RouterLink,
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: label,
          }}
        >
          <MenuItem>{label}</MenuItem>
        </Link>
      );
    });
  };
  const getDrawerChoicesTwo = () => {
    return headersDataTwo.map(({ label, href }) => {
      return (
        <a
          {...{
            href: href,
            key: label,
          }}
          target="_blank"
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
          {...{
            key: label,
            color: 'inherit',
            to: href,
            component: NavLink,
            className: menuButton,
          }}
        >
          {label}
        </Button>
      );
    });
  };
  const [chain, setChain] = React.useState(chainID);

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
    document.body.classList.add(current.theme);
  };
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');

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
                  <NavLink to="/">Dashboard</NavLink>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <NavLink to="/active-bets">Active Bets</NavLink>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <NavLink to="/history-bets">Bets History</NavLink>
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
                  <NavLink to="/farm">LP Stake</NavLink>
                </li>
              </ul>
            </Box>
            <Box className="ul_li_box">
              <ul>
                <li>
                  <NavLink to="/pool">Pool</NavLink>
                </li>
              </ul>
            </Box>
          </Menu>
          <Box className={splitLocation[1] === 'faq' ? 'manu_img_paert_aj active' : 'manu_img_paert_aj'}>
            <NavLink to="/faq" className="faq_l img_set_parnt_aj">
              <img src="/img/faq_ima_aj.svg" alt="" />
              Faq
            </NavLink>
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
                  <NavLink to="/">Twitter</NavLink>
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
            <ConnectMenu />
            {/* <Button className="def_btn_gray">
                <span>Connect Wallet</span>
                <Box component="img" src="/img/wallet_ic.svg" />
            </Button> */}
            {address && (
              <Button className="def_btn">
                <span>{accountEllipsis(address)}</span>
                <Box component="img" src="/img/logout_ic.svg" />
              </Button>
            )}
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
