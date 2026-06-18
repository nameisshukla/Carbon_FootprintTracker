import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      
      <Navbar />
      
      <main className="main-content">
        {children}
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
};

export default Layout;
