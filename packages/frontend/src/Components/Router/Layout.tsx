import { Outlet } from 'react-router-dom';
import { useNetwork } from 'wagmi';

import { CHAIN_ID } from '../../constants';
import Footer from '../Presentational/Footer';
import SlideBar from '../Presentational/Nav/SlideBar';

const Layout = () => {
  const { activeChain } = useNetwork({ chainId: CHAIN_ID });
  const chainId = activeChain?.id;
  return (
    <div className='App'>
      <SlideBar />
      <Outlet />
      <Footer chainId={chainId} />
    </div>
  );
}

export default Layout;
