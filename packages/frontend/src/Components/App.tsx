import { Route, Routes } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { TITLE } from '../constants';
import About from './Pages/About';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Layout from './Router/Layout';

const App = () => (
  <HelmetProvider>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  </HelmetProvider>
);

export default App;
