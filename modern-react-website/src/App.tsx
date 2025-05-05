// src/App.tsx
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}

export default App;