import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import DashboardAnalytics from '../dashboard/components/DashboardAnalytics';
import CardsSection from './CardsSection';
import Data from '../assesmentOne/Data';
import AddImportantNotes from '../notes/AddImportantNotes';

import { MdOutlineDashboard } from "react-icons/md";
import { SiOpenbadges } from "react-icons/si";
import { BsCreditCard2Front } from "react-icons/bs";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import FullScreen from './components/FullScreen';
import Notifications from './components/Notifications';
import CurrentDate from './components/CurrentDate';
import UserProfile from './components/UserProfile';
import UserLogout from './components/UserLogout';
import { ListItemText } from '@mui/material';


const drawerWidth = 190;

const drawerModules = [
    {
        id: 1,
        title: 'Dashboard',
        icon: <MdOutlineDashboard color='#424242' size={25} />,
        path: '/'
    },
    {
        id: 2,
        title: 'Details',
        icon: <SiOpenbadges color='#424242' size={25} />,
        path: '/data'
    },
    {
        id: 3,
        title: 'Products',
        icon: <BsCreditCard2Front color='#424242' size={25} />,
        path: '/cardcollection'
    },
    {
        id: 4,
        title: 'Notes',
        icon: <RiLayoutGrid2Fill color='#424242' size={25} />,
        path: '/notes'
    },
];

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

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

export default function MiniDrawer() {
    const [open, setOpen] = React.useState(false);
    const [selectedItemId, setSelectedItemId] = React.useState(1);
    const location = useLocation();

    React.useEffect(() => {
        const storedId = localStorage.getItem("selectedMenuId");
        if (storedId) {
            setSelectedItemId(Number(storedId));
        } else {
            setSelectedItemId(drawerModules[0].id);
        }
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        if (window.innerWidth < 768) {
            window.location.reload();
        }
    };

    const handleItemClick = (id, path) => {
        setSelectedItemId(id);
        localStorage.setItem("selectedMenuId", id);
    };

    React.useEffect(() => {
        const currentPath = location.pathname;
        const found = drawerModules.find((item) =>
            item.path === currentPath ? currentPath : null
        );
        if (found) {
            setSelectedItemId(found.id);
        } else {
            setSelectedItemId(null);
        }
    }, [location.pathname]);


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ width: '100%', display: "flex", alignItems: 'center', justifyContent: "space-between", paddingLeft: 1 }}>
                        <div className='flex items-center w-full'>
                            <Typography>
                                {open ? null : (
                                    <div className='flex items-center'>
                                        <h1 className='font-bold text-[25px]'>
                                            Sass Ai
                                        </h1>
                                        <span className='font-extralight text-[13px] -mt-4 ml-1'>
                                            PRO.
                                        </span>
                                    </div>
                                )}
                            </Typography>
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
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <div className='flex items-center mr-1'>
                        <h1 className='font-bold text-[21px]'>
                            Sass Ai
                        </h1>
                        <span className='font-extralight text-[12px] -mt-4 ml-1'>
                            PRO.
                        </span>
                    </div>
                    <IconButton onClick={handleDrawerClose}>
                        <IoChevronBackCircleSharp color='' />
                    </IconButton>
                </DrawerHeader>

                <List>
                    {drawerModules.map((text, index) => (
                        <NavLink
                            key={index}
                            to={text.path}
                            style={{
                                textDecoration: "none",
                                display: "block",
                                backgroundColor:
                                    selectedItemId === text.id ? "#073763" : "inherit",
                            }}
                            onClick={() => handleItemClick(text.id, text.path)}
                        >
                            {/* <ListItem
                                disablePadding
                                className={`mt-1 ${text.id === selectedItemId ? '' : ''}`}
                                onClick={() => setSelectedItemId(text.id)}
                            > */}
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2,
                                    color: selectedItemId === text.id ? "white" : "inherit",
                                    backgroundColor:
                                        selectedItemId === text.id ? "#073763" : "inherit",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 1 : "auto",
                                        justifyContent: "center",
                                        color: selectedItemId === text.id ? "" : "white",
                                    }}
                                >
                                    {text.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={text.title}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        color: selectedItemId === text.id ? "white" : "#073763",
                                        "& .css-10hburv-MuiTypography-root": {
                                            fontSize: "14px",
                                            fontWeight: 500,
                                        },
                                    }}
                                />
                            </ListItemButton>
                            {/* </ListItem> */}
                        </NavLink>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography>
                    <Routes>
                        <Route path='/' element={<DashboardAnalytics />} />
                        <Route path='/cardcollection' element={<CardsSection />} />
                        <Route path='/data' element={<Data />} />
                        <Route path='/notes' element={<AddImportantNotes />} />
                    </Routes>
                </Typography>
            </Box>
        </Box>
    );
}
