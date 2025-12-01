import React from 'react';

interface SmartPEIProps {
  view: string;
}

const SmartPEI: React.FC<SmartPEIProps> = ({ view }) => {
  return (
    <div>
      {view}
    </div>
  );
};

export default SmartPEI;
