import React from 'react';
import './HorizontalScroll.css';

interface HorizontalScrollProps {
  children: React.ReactNode;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children }) => {
  // Duplicate children to create a seamless loop
  const duplicatedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child as React.ReactElement, { key: `original-${index}` })
  );
  const clonedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child as React.ReactElement, { key: `clone-${index}` })
  );

  return (
    <div className="horizontal-scroll-container">
      <div className="horizontal-scroll-content">
        {duplicatedChildren}
        {clonedChildren}
      </div>
    </div>
  );
};

export default HorizontalScroll;
