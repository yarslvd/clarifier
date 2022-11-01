import React from "react";
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/system';

// IMPORTING MATERIALS
import { Button, IconButton, Menu, MenuItem, Toolbar, InputBase, Avatar,
        List, ListItem, ListItemButton, ListItemText, SwipeableDrawer, Divider,
        ListItemIcon, Typography, Container, AppBar, Box, Link } from "@mui/material";

// IMPORTING ICONS
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import TopicIcon from '@mui/icons-material/Topic';
import HomeIcon from '@mui/icons-material/Home';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PersonIcon from '@mui/icons-material/Person';

import '../../App.scss';
import styles from './Header.module.scss';
import { selectIsAuth } from "../../redux/slices/authSlice";
import { useSelector } from 'react-redux';
import axios from '../../redux/axios';

const pages = ['Home', 'Ask', 'Topics'];

//CUSTOM ELEMENTS
const StyledAppBar = styled(AppBar)({
    color: '#000',
    display: 'block',
    backgroundColor: 'transparent',
    marginTop: '20px'
});

const StyledContainer = styled(Container)({
    maxWidth: '1552px'
})

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: '14px',
    backgroundColor: "#EFEFEF",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    height: '38px',
    width: '300px',
    [theme.breakpoints.down("lg")]: {
        width: "200px"
    },
    [theme.breakpoints.down("sm")]: {
        width: '300px',
        minWidth: "150px"
    },
    [theme.breakpoints.down(380)]: {
        width: '200px',
        minWidth: "150px"
    },
 }));
  
const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    right: 0,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.3, 6, 1, 1.4),
        color: '#1D3557',
        width: '250px',
        [theme.breakpoints.down("lg")]: {
            width: "150px"
        },
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            minWidth: "100px"
        },
        [theme.breakpoints.down(380)]: {
            minWidth: "150px"
        },
    }
}));

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [state, setState] = React.useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    
    const auth = useSelector(selectIsAuth);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const list = (anchor) => (
        <Box
          sx={{ width: '300px' }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
            {auth && (
                <List style={{padding: '40px 20px'}}>
                    <ListItem disablePadding>
                        <Avatar alt="Demy Sharp" src="/static/images/avatar/1.jpg" style={{ marginRight: '10px'}} />
                        <ListItemText primary={'Yaroslav Doroshenko'} className='menuName' disableTypography />
                    </ListItem>
                    <ListItem style={{ display: 'inline', padding: '5px', marginLeft: '40px' }}>
                        <ListItemText primary={'Admin'} className='menuItems' disableTypography />
                    </ListItem>
                    <ListItem style={{ display: 'inline', padding: '5px' }}>
                        <ListItemText primary={'Rating: 145'} className='menuItems' disableTypography />
                    </ListItem>
                </List>
            )}
        <Divider />
          <List>
            {pages.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                    <ListItemIcon style={{ justifyContent: 'center'}}>
                        {index === 0 ? <HomeIcon /> : null}
                        {index === 1 ? <QuestionAnswerIcon /> : null}
                        {index === 2 ? <TopicIcon /> : null}
                    </ListItemIcon>
                    <ListItemText primary={text} className='drawerLinks' disableTypography />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          {!auth && (
            <Box sx={{ display: 'flex', ml: '20px', gap: '10px', margin: '20px 30px' }}>
                <Button href="/login" variant="outlined" className='menuLogin'>Log In</Button>
                <Button href='/signup' variant="contained" className='menuSignup'>Sign Up</Button>
            </Box>
          )}
        </Box>
    );

    const handleLogOut = () => {
        console.log('log out');
        axios.post('/api/auth/logout');
        window.location.reload();
    }

    return (
        <StyledAppBar position="static" elevation={0}>
            <StyledContainer maxWidth='xl'>
                <Toolbar disableGutters className={styles.div_wrapper}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            fontFamily: 'Kharkiv Tone',
                            color: '#1D3557',
                            textDecoration: 'none',
                            fontSize: '24px',
                            minWidth: '123px'
                        }}
                    >
                        clarifier
                    </Typography>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                        <Search sx={{ justifyContent: 'flex-end' }}>
                            <SearchIconWrapper>
                                <SearchIcon style={{ color: "#1D3557", height: '18px' }} />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search..."
                                inputProps={{ "aria-label": "search" }}
                                style={{fontWeight: 300, fontSize: '12px'}}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button sx={styles.nav_links} href='/questions'>Home</Button>
                            <Button sx={styles.nav_links} href='/new-question'>Ask</Button>
                            <Button sx={styles.nav_links} href='/notes'>Notes</Button>

                        </Box>
                        {!auth && (
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: '20px', gap: '10px' }}>
                                <Button href='/login' variant="outlined" className='login_btn'>Log In</Button>
                                <Button href='/signup' variant="contained" className='signup_btn'>Sign Up</Button>
                            </Box>
                        )}
                        {auth && (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleMenu}
                                >
                                    <Avatar alt={userInfo ? userInfo.login : null} src={userInfo ? `http://localhost:8000/${userInfo.profile_img}` : null} />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    className={styles.avatar_menu}
                                >
                                    <span className={styles.role}><PersonIcon></PersonIcon> {auth && userInfo ? userInfo.role : null}</span>
                                    <MenuItem><Link href='/profile' className={styles.avatar_link}>Profile</Link></MenuItem>
                                    <MenuItem><Link onClick={handleLogOut} className={styles.avatar_link}>Log Out</Link></MenuItem>
                                </Menu>
                            </div>
                        )}
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <React.Fragment>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={toggleDrawer('right', true)}
                                    color="inherit"
                                >
                                    <MenuIcon style={{ color: '#1D3557' }}/>
                                </IconButton>
                                <SwipeableDrawer
                                    anchor='right'
                                    open={state['right']}
                                    onClose={toggleDrawer('right', false)}
                                    onOpen={toggleDrawer('right', true)}
                                >
                                    {list('right')}
                                </SwipeableDrawer>
                            </React.Fragment>
                        </Box>
                    </div>
                </Toolbar>
            </StyledContainer>
        </StyledAppBar>
    )
}

export default Header;