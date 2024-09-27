import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Sidebar from "./components/PrimaryBar/sidebar/sidebar";
import ChatBox from "./pages/chatBox/chatBox";
import User from "./pages/user/User";
import ErrorPage from "./pages/Errorpage/errorPage";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Hero from "./pages/Hero/Hero";
import AuthOption from "./components/user/Landing/landing";
import LoginForm from "./components/user/LoginForm/LoginForm";
import RegisterForm from "./components/user/Register/register";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      errorElement: <ErrorPage />,
      element: <Sidebar />,
      children: [
        { index: true, element: <Hero /> },
        { path: "/:conversationId", element: <ChatBox /> },
      ],
    },
    {
      path: "/user",
      errorElement: <ErrorPage />,
      element: <User />,
      children: [
        { index: true, element: <AuthOption /> },
        { path: "login", element: <LoginForm /> },
        { path: "register", element: <RegisterForm /> }
      ],
    },
  ]);

  return (
    <ErrorBoundary>
      <div className="App">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
