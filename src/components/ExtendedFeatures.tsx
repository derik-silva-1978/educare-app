
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  features: FeatureProps[];
  columns: number;
  iconStyle: string;
}

const ExtendedFeatures: React.FC<FeaturesProps> = ({ features, columns, iconStyle }) => {
  // Determine the grid columns based on the columns prop
  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Map icon string name to Lucide icon or custom component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clipboard-list':
        return <Check className="h-5 w-5" />;
      case 'check-square':
        return <Check className="h-5 w-5" />;
      case 'file-text':
        return <Check className="h-5 w-5" />;
      case 'trending-up':
        return <Check className="h-5 w-5" />;
      case 'users':
        return <Check className="h-5 w-5" />;
      case 'zap':
        return <Check className="h-5 w-5" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  return (
    <div className={`grid ${getGridColumns()} gap-6 mt-8`}>
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4">
            {iconStyle === 'background' ? (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {getIcon(feature.icon)}
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center text-primary">
                {getIcon(feature.icon)}
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ExtendedFeatures;
