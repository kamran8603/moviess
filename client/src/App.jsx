import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import PWAManager from './components/PWAManager'

function App() {
  return (
    <>
      <PWAManager />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
