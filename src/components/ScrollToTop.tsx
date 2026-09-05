import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sends the window back to the top on navigation. A hash router does not
 * reload, so following a link from halfway down the projects list otherwise
 * lands you halfway down the next page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
