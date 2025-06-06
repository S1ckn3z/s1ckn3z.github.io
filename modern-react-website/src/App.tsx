// src/App.tsx (update)
import { useState } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import WildStackerPage from './pages/WildStackerPage';
import SuperiorSkyblockPage from './pages/SuperiorSkyblockPage';
import DeluxeMenusPage from './pages/DeluxeMenusPage';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Define available pages
type Page = 'home' | 'wildstacker' | 'superiorskyblock' | 'deluxemenus';

function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  
  // Function to change the active page
  const changePage = (page: Page) => {
    setActivePage(page);
  };
  
  // Render the active page
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={changePage} />;
      case 'wildstacker':
        return <WildStackerPage />;
      case 'superiorskyblock':
        return <SuperiorSkyblockPage />;
      case 'deluxemenus':
        return <DeluxeMenusPage />;
      default:
        return <HomePage onNavigate={changePage} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={changePage}>
      {renderPage()}
    </Layout>
  );
}

export default App;