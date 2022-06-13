import {
  AppBar,
  Toolbar,
  Grid,
  Typography,
  useMediaQuery,
  Container,
  Theme,
  Breakpoint,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { APP_SHORT_NAME } from '../../../constants';
import Connect from '../../Connect/Connect';
import AppIcon from '../../Icons/AppIcon';
import HideOnScroll from './HideOnScroll';
import Offset from './Offset';

const SlideBar = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile' as Breakpoint));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile' as Breakpoint));
  const mobileBreakpoint = isMobile || isTinyMobile;

  return (
    <>
      <HideOnScroll>
        <AppBar position='sticky'>
          <Container maxWidth='xl'>
            <Toolbar disableGutters={mobileBreakpoint}>
              <Grid
                container
                alignItems='center'
                justifyContent='space-between'
              >
                <Grid
                  item
                  display='flex'
                  mt={1}
                  xs={4}
                >
                  <Typography
                    display='inline-flex'
                    color='text.primary'
                    variant='h6'
                    sx={{ alignItems: 'center' }}
                  >
                    <RouterLink to='/'>
                      <AppIcon />
                    </RouterLink>
                    <Typography pl={1}>
                      { APP_SHORT_NAME }
                    </Typography>
                  </Typography>
                </Grid>
                <Grid
                  item
                  display='flex'
                  justifyContent='flex-end'
                  xs={6}
                >
                  <Connect />
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Offset />
    </>
  );
};

export default SlideBar;
