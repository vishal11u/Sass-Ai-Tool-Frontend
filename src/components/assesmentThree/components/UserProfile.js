import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { IconButton, Tooltip } from "@mui/material";

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}));

export default function UserProfile() {
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return "Good Morning";
        } else if (currentHour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    return (
        <div className="px-4 hidden md:flex space-x-3 items-center border-r">
            <Stack direction="row" spacing={2}>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                >
                    <Tooltip title="Profile Image" arrow>
                        <IconButton sx={{ p: 0, border: '3px solid white' }}>
                            <Avatar
                                sx={{ height: 35, width: 35 }}
                                alt="Remy Sharp"
                                src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1721288731~exp=1721292331~hmac=2e6372797876ec9fb595e3f1e4fb49c8f71283d57589432006603d734a440d16&w=996"
                            />
                        </IconButton>
                    </Tooltip>
                </StyledBadge>
            </Stack>
            <div className="text-[13px]">
                <h1>{getGreeting()}</h1>
                <p>Super Admin</p>
            </div>
        </div>
    );
}
