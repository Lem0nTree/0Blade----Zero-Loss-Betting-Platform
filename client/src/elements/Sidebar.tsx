import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  const splitLocation = pathname.split('/');
  ////

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('drwer-open', isOpen);
  }, [isOpen]);
  return (
    <>
      <Box className='assidebar'>
        <Button className='sidebar_hndl' onClick={() => setIsOpen(!isOpen)}>
          <Box component='img' src='/img/brgr_ic.svg' className='desk_img' />
          <Box component='img' src='/img/close_ic.svg' className='mobile_img' />
        </Button>
        <ul className='sdbr_list'>
          <li>
            <Link to='/' className={splitLocation[1] === '' ? 'active' : ''}>
              <Box component='img' src='/img/menu/sdbr_ic_01.svg' />
              <span>Popular</span>
            </Link>
          </li>
          <li>
            <Link
              to='/0'
              className={splitLocation[1] === '0' ? 'active' : 'mn_it_02'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_02.svg' />
              <span>Soccer</span>
            </Link>
          </li>
          <li>
            <Link
              to='/1'
              className={splitLocation[1] === '1' ? 'active' : 'mn_it_03'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_05.svg' />
              <span>UFC</span>
            </Link>
          </li>
          <li>
            <Link
              to='/2'
              className={splitLocation[1] === '2' ? 'active' : 'mn_it_04'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_04.svg' />
              <span>Volley</span>
            </Link>
          </li>
          <li>
            <Link
              to='/3'
              className={splitLocation[1] === '3' ? 'active' : 'mn_it_05'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_03.svg' />
              <span>Tennis</span>
            </Link>
          </li>
          <li>
            <Link
              to='/4'
              className={splitLocation[1] === '4' ? 'active' : 'mn_it_06'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_06.svg' />
              <span>Chess</span>
            </Link>
          </li>
          <li>
            <Link
              to='/5'
              className={splitLocation[1] === '5' ? 'active' : 'mn_it_07'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_07.svg' />
              <span>Water Polo</span>
            </Link>
          </li>
          <li>
            <Link
              to='/6'
              className={splitLocation[1] === '6' ? 'active' : 'mn_it_08'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_08.svg' />
              <span>Esports</span>
            </Link>
          </li>
          <li>
            <Link
              to='/7'
              className={splitLocation[1] === '7' ? 'active' : 'mn_it_09'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_09.svg' />
              <span>Cycling</span>
            </Link>
          </li>
          <li>
            <Link
              to='/8'
              className={splitLocation[1] === '8' ? 'active' : 'mn_it_10'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_010.svg' />
              <span>Golf</span>
            </Link>
          </li>
          <li>
            <Link
              to='/9'
              className={splitLocation[1] === '9' ? 'active' : 'mn_it_11'}
            >
              <Box component='img' src='/img/menu/sdbr_ic_011.svg' />
              <span>Poker</span>
            </Link>
          </li>
        </ul>
      </Box>
    </>
  );
}
