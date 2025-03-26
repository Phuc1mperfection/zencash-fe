import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430]">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;