import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const MainLayout = () => {
  return (
    <Box>
      {/* You can add AppBar, Sidebar here */}
      <Outlet />
    </Box>
  );
};

export default MainLayout;
