import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PageWrapper = ({ children }) => {
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (ref.current) {
      ref.current.style.animation = 'none';
      void ref.current.offsetHeight;
      ref.current.style.animation = '';
    }
  }, [pathname]);

  return (
    <div ref={ref} className="page-enter" style={{ minHeight: 'calc(100vh - var(--navbar-h))' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
