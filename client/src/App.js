import { Routes, Route } from "react-router";
import Main from "./pages/Main";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route exact path="/room/:id" element={<Room />} />
      <Route exact path="/" element={<Main />} />
      <Route element={<NotFound />} />
    </Routes>
  );
}

export default App;
