
import MainRoutes from "./Routes/MainRoutes";

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/homepage" element={<HomePage />} />
    //     <Route path="/register" element={<RegisterPage />} />
    //     <Route
    //       path="/"
    //       element={
    //         <ProtectedRoute>
    //           <HomePage />
    //         </ProtectedRoute>
    //       }
    //     />
    //   </Routes>
    // </BrowserRouter>
    <MainRoutes />
  );
}

export default App;
