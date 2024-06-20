"use client";
import React from "react";
import Sidebar from "../_Components/sidebar";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Image from "next/image";
import Logo from "@/lib/images/Logo1.png";
import { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ManageUser from "@/database/auth/ManageUser";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";

const drawerWidth = 240;
const navItems = [
  "Home",
  "Profile",
  "Admin View",
  "Outlook",
  "Teams",
  "Logout",
];

// Override AppBar styles to set background color to green
const CustomAppBar = styled(AppBar)({
  backgroundColor: "#bcd727", // Your desired green color
});

function Header() {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (item) => {
    if (item === "Profile") {
      router.push("/Profile");
    } else if (item === "Logout") {
      ManageUser.logoutUser(setLoggedIn, router);
    } else if (item === "Outlook") {
      window.location.href = "mailto:";
    } else if (item === "Teams") {
      window.location.href = "msteams://";
    } else if (item === "Admin View") {
      router.push("/DiscoverCommunities");
    } else if (item === "Home") {
      router.push("/Home");
    }
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Image src={Logo} alt="Logo" width={300} height={100} />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item}
            disablePadding
            onClick={() => handleListItemClick(item)}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <CustomAppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OPEN COMMUNITY
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={() => router.push("/Profile")}
          >
            <AccountCircle sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>
      </CustomAppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "20%",
              backgroundColor: "#ffffff", // Match the AppBar background color
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  window: PropTypes.func,
};

export default Header;
