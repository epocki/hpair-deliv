import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import firebase from "firebase/compat/app";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./App.css";
import BasicTable from "./components/BasicTable";
import EntryModal from "./components/EntryModal";
import { db, SignInScreen } from "./utils/firebase";
import { emptyEntry } from "./utils/mutations";
import Enthusiasm from "./components/Enthusiasm";
import ContactMessage from "./components/ContactMessage";
import ProgressTracker from "./components/ProgressTracker";

// MUI styling constants
const drawerWidth = 240;

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
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7.5),
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#700c0c",
    },
    secondary: {
      main: "#b20343",
    },
  }
});

// App.js is the homepage and handles top-level functions like user auth.

export default function App() {
  // User authentication functionality. Would not recommend changing.

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [currentUser, setcurrentUser] = useState(null); // Local user info

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
        if (!!user) {
          setcurrentUser(user);
        }
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // Navbar drawer functionality

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Data fetching from DB. Would not recommend changing.
  // Reference video for snapshot functionality https://www.youtube.com/watch?v=ig91zc-ERSE

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // We are returning snapshot to useEffect. Upon unmount, useEffect will run
    // its return function, snapshot, which provides a callback to unsubscribe
    // from the listener

    // ! Database query filters entries for current user. DO NOT CHANGE, editing this query may cause it to fail.
    const q = currentUser?.uid
      ? query(collection(db, "entries"), where("userid", "==", currentUser.uid))
      : collection(db, "entries");

    onSnapshot(q, (snapshot) => {
      // Using JS spread operator to convert all of doc.data object properties
      // into a list of properties, and adding our own property with id.
      // this is done because doc id is not in doc.data()
      setEntries(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, [currentUser]);

  // Main content of homescreen. This is displayed conditionally from user auth status

  function mainContent() {
    if (isSignedIn) {
      if (page === "contact")
        return <ContactMessage entries={entries}/>
      if (page === "progress")
        return <ProgressTracker entries={entries}/> //input js page
      else
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={3}>
                <EntryModal entry={emptyEntry} type="add" user={currentUser} />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <BasicTable entries={entries} />
            </Grid>
          </Grid>
        );
    } else return <SignInScreen></SignInScreen>;
  }

  const MenuBar = () => {
    return (
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Outreach Contacts - {{
              "dashboard": "Dashboard",
              "contact": "Message Generator",
              "progress": "Progress Tracker"
            }[page]}
          </Typography>
          <Typography
            component="h1"
            variant="body1"
            color="inherit"
            noWrap
            sx={{
              marginRight: "20px",
              display: isSignedIn ? "inline" : "none",
            }}
          >
            Signed in as {firebase.auth().currentUser?.displayName}
          </Typography>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            sx={{
              marginTop: "5px",
              marginBottom: "5px",
              display: isSignedIn ? "inline" : "none",
            }}
            onClick={() => firebase.auth().signOut()}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    );
  };

  const [page, setPage] = useState("dashboard");

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MenuBar />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton selected={page === "dashboard"} onClick={() => setPage("dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton selected={page === "contact"} onClick={() => setPage("contact")}>
              <ListItemIcon>
                <ContactMailIcon />
              </ListItemIcon>
              <ListItemText primary="Message Generator" />
            </ListItemButton>
             <ListItemButton selected={page === "progress"} onClick={() => setPage("progress")}>
              <ListItemIcon>
                <AutoModeIcon />
              </ListItemIcon>
              <ListItemText primary="Progress Tracker" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {mainContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
