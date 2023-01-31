import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CompanyNFT from "./utils/CompanyNFT";
import { MyNFT } from "./utils/MyNFT";
import Nav from "./utils/Nav";
import NftForm from "./utils/NftForm";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<NftForm />} />
          <Route path="/myNftId" element={<MyNFT />} />
          <Route path="/companyNFT" element={ <CompanyNFT/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
