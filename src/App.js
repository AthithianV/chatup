import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Sidebar from "./components/sidebar/sidebar";
import ChatBox from "./pages/chatBox/chatBox";
import AuthForm from "./pages/user/Form";
import ErrorPage from "./pages/Errorpage/errorPage";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Hero from "./pages/Hero/Hero";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      errorElement: <ErrorPage />,
      element: <Sidebar />,
      children: [
        { index: true, element: <Hero /> },
        { path: "/:conversation", element: <ChatBox /> },
      ],
    },
    {
      path: "/user",
      element: <AuthForm />,
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
