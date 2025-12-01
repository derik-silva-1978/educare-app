
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DocumentationResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkUrl: string;
  tags?: string[];
}

export const DocumentationResourceCard: React.FC<DocumentationResourceCardProps> = ({
  title,
  description,
  icon,
  linkText,
  linkUrl,
  tags = [],
}) => {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md border-blue-100">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
          onClick={() => window.location.href = linkUrl}
        >
          <span>{linkText}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
