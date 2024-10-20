import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled, alpha, useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import { MdOutlineDashboard } from "react-icons/md";
import { RiMessage2Line } from "react-icons/ri";
import { SiOpenbadges } from "react-icons/si";
// import { BsMenuButtonWideFill } from "react-icons/bs";
import { BsCreditCard2Front } from "react-icons/bs";
import { RiLayoutGrid2Fill } from "react-icons/ri";
// import { BiShuffle } from "react-icons/bi";
// import { TfiSettings } from "react-icons/tfi";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NavLink, Route, Routes } from 'react-router-dom';

import CardsSection from './CardsSection';
import Logo from '../../assets/Logo.png';
import UserLogout from '../assesmentThree/components/UserLogout';
import Data from '../assesmentOne/Data';
import DashboardAnalytics from '../dashboard/components/DashboardAnalytics';
import MainChatPage from '../chat/MainChatPage';
import Notifications from './components/Notifications';
import FullScreen from './components/FullScreen';
import UserProfile from './components/UserProfile';
import CurrentDate from './components/CurrentDate';
import AddImportantNotes from '../notes/AddImportantNotes';
import { IconButton } from '@mui/material';

const drawerWidth = 190;

const drawerModules = [
    {
        id: 1,
        title: 'Dashboard',
        icon: <MdOutlineDashboard size={21} />,
        path: '/'
    },
    // {
    //     id: 2,
    //     title: 'Group Chat',
    //     icon: <RiMessage2Line size={20} />,
    //     path: '/chat'
    // },
    {
        id: 2,
        title: 'Details',
        icon: <SiOpenbadges size={20} />,
        path: '/data'
    },
    // {
    //     id: 4,
    //     title: 'Buttons',
    //     icon: <BsMenuButtonWideFill size={18} />,
    //     path: '/'
    // },
    {
        id: 3,
        title: 'Products',
        icon: <BsCreditCard2Front size={20} />,
        path: '/cardcollection'
    },
    {
        id: 4,
        title: 'Notes',
        icon: <RiLayoutGrid2Fill size={20} />,
        path: '/notes'
    },
    // {
    //     id: 7,
    //     title: 'Pagination',
    //     icon: <BiShuffle size={20} />,
    // },
    // {
    //     id: 8,
    //     title: 'Popover',
    //     icon: <AdbIcon size={20} />,
    // },
    // {
    //     id: 9,
    //     title: 'Tooltips',
    //     icon: <TfiSettings size={20} />,
    // },
];

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '25ch',
            },
        },
    },
}));

const ResponsiveAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
        flexDirection: 'column',
    },
}));

function AssesmentThree() {
    const theme = useTheme();
    const [selectedItemId, setSelectedItemId] = useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <ResponsiveAppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ width: '100%', display: "flex", alignItems: 'center', justifyContent: "space-between", paddingLeft: 1 }}>
                            <div className='flex items-center w-full'>
                                <div className='flex items-center'>
                                    <img
                                        src={Logo}
                                        className='h-6 mr-2'
                                        alt='logo'
                                    />
                                    <h1 className='font-bold text-[25px]'>
                                        Shopify
                                    </h1>
                                    <span className='font-extralight text-[15px] -mt-4 ml-1'>
                                        PRO.
                                    </span>
                                </div>
                                <div className='lg:ml-16 md:ml-9 sm:hidden md:block below-650:hidden lg:block'>
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                            placeholder="Search…"
                                            inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
                                </div>
                            </div>
                            <div className='flex items-center justify-end'>
                                <FullScreen />
                                <Notifications />
                                <CurrentDate />
                                <UserProfile />
                                <UserLogout />
                            </div>
                        </Typography>
                    </Toolbar>
                </ResponsiveAppBar>
                <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                        width: { xs: '35%', sm: drawerWidth },
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: { xs: '35%', sm: drawerWidth }, boxSizing: 'border-box' },
                        backgroundColor: "#fff"
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {drawerModules.map((text, index) => (
                                <NavLink to={text.path} key={index}>
                                    <ListItem
                                        disablePadding
                                        className={`mt-2 ${text.id === selectedItemId ? '' : ''}`}
                                        onClick={() => setSelectedItemId(text.id)}
                                    >
                                        <ListItemButton>
                                            <ListItemIcon className={`-mr-6 ml-2 ${text.id === selectedItemId ? 'scale-[1.1] text-black' : ''}`}>
                                                {text.icon}
                                            </ListItemIcon>
                                            <h1 className={`font-medium w-full text-[15px] ${text.id === selectedItemId ? 'scale-[1.1] text-black font-semibold transition-all ' : 'text-gray-500'}`}>
                                                {text.title}
                                            </h1>
                                        </ListItemButton>
                                    </ListItem>
                                </NavLink>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#faf5f5", height: "100vh" }}>
                    <Toolbar />
                    <Typography>
                        <Routes>
                            <Route path='/' element={<DashboardAnalytics />} />
                            <Route path='/cardcollection' element={<CardsSection />} />
                            <Route path='/data' element={<Data />} />
                            {/* <Route path='/chat' element={<MainChatPage />} /> */}
                            <Route path='/notes' element={<AddImportantNotes />} />
                        </Routes>
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default AssesmentThree;