import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

const AuthLayout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
