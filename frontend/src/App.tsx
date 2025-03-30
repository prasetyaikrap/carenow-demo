import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./features/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./libs/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
