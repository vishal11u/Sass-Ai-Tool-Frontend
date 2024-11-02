import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import DashboardAnalytics from "../dashboard/components/DashboardAnalytics";
import CardsSection from "./CardsSection";
import Data from "../assesmentOne/Data";
import AddImportantNotes from "../notes/AddImportantNotes";

import { MdOutlineDashboard } from "react-icons/md";
import { SiOpenbadges } from "react-icons/si";
import { BsCreditCard2Front } from "react-icons/bs";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";

import FullScreen from "./components/FullScreen";
import Notifications from "./components/Notifications";
import CurrentDate from "./components/CurrentDate";
import UserProfile from "./components/UserProfile";
import UserLogout from "./components/UserLogout";
import { ListItem, ListItemText, Tooltip } from "@mui/material";
import LogoSideBar from "../../assets/LogoDrawer.png";
import LogoNavabr from "../../assets/LogoNavbar.png";

const drawerWidth = 220;

const drawerModules = [
  {
    id: 1,
    title: "Dashboard",
    icon: <MdOutlineDashboard color="#424242" size={25} />,
    path: "/",
  },
  {
    id: 2,
    title: "User Details",
    icon: <SiOpenbadges color="#424242" size={25} />,
    path: "/userdetails",
  },
  {
    id: 3,
    title: "AI Tools",
    icon: <BsCreditCard2Front color="#424242" size={25} />,
    path: "/aitools",
  },
  {
    id: 4,
    title: "Contacts",
    icon: <RiLayoutGrid2Fill color="#424242" size={25} />,
    path: "/contacts",
  },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
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
    <Box sx={{ display: "flex" }}>
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
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 1,
            }}
          >
            <div className="flex items-center w-full">
              <Typography>
                {open ? null : (
                  <div className="flex items-center">
                    <img className="h-16" src={LogoSideBar} alt="logo" />
                  </div>
                )}
              </Typography>
            </div>
            <div className="flex items-center justify-end gap-x-5">
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
        <DrawerHeader
          sx={{ border: "0px solid black", backgroundColor: "073763" }}
        >
          <div className="flex items-center text-white">
            {!open ? null : (
              <div className="flex items-center">
                <img className="h-16" src={LogoSideBar} alt="logo" />
              </div>
            )}
          </div>
          <IconButton onClick={handleDrawerClose}>
            <IoChevronBackCircleSharp color="Black" />
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
              <Tooltip placement="right" arrow title={open ? null : text.title}>
                <ListItem
                  disablePadding
                  className={`mt-1 ${text.id === selectedItemId ? "" : ""}`}
                  onClick={() => setSelectedItemId(text.id)}
                >
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
                        color: selectedItemId === text.id ? "white" : "#424242",
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
                </ListItem>
              </Tooltip>
            </NavLink>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography>
          <Routes>
            <Route path="/" element={<DashboardAnalytics />} />
            <Route path="/userdetails" element={<CardsSection />} />
            <Route path="/aitools" element={<Data />} />
            <Route path="/contacts" element={<AddImportantNotes />} />
          </Routes>
        </Typography>
      </Box>
    </Box>
  );
}
