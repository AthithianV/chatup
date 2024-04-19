import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Sidebar from "./components/sidebar/sidebar";
import ChatBox from "./pages/chatBox/chatBox";
import AuthForm from "./pages/user/Form";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Sidebar />,
      children: [{ index: true, element: <ChatBox /> }],
    },
    {
      path: "/user",
      element: <AuthForm />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
