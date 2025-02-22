import { Route, Routes } from "react-router-dom";
import LoginForm from "./Components/Login";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<>this is chadn</>} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </>
  );
};
