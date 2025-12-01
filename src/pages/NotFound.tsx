
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto rounded-full bg-red-100 p-3 mb-4 w-16 h-16 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Página não encontrada</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-4">
          <p className="text-muted-foreground mb-2">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
          <p className="text-sm text-muted-foreground">
            URL: {location.pathname}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleGoHome}
          >
            <Home className="h-4 w-4" />
            Página Inicial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
