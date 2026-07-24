import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import Products from "./pages/Products";

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Products />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}