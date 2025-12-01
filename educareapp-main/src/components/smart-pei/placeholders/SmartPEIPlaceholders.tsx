
import React from 'react';

interface PlaceholderProps {
  title?: string;
  description?: string;
  [key: string]: any; // Allow for any additional props
}

export const Placeholder: React.FC<PlaceholderProps> = ({ 
  title = "Component Not Implemented", 
  description = "This component has not been implemented yet.",
  ...props 
}) => {
  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-gray-500">{description}</p>
      {Object.keys(props).length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400">Props received:</p>
          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-24">
            {JSON.stringify(props, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
