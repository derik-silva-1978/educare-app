
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CourseEnrollment: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = {
    title: 'Desenvolvimento Infantil: 0-2 Anos',
    price: 'R$ 199,00',
    originalPrice: 'R$ 299,00'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Inscrição</h1>
        <p className="text-gray-600">Complete sua inscrição no curso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Informações de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome completo" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card">Número do Cartão</Label>
              <Input id="card" placeholder="1234 5678 9012 3456" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Validade</Label>
                <Input id="expiry" placeholder="MM/AA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={() => {
                  // Simulate successful enrollment
                  navigate('/educare-app/aprendizado/dashboard');
                }}
              >
                Finalizar Inscrição
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">{course.title}</h3>
              <p className="text-gray-600 text-sm">Curso completo com certificado</p>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Preço original:</span>
                <span className="line-through text-gray-500">{course.originalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span className="text-green-600">-R$ 100,00</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">{course.price}</span>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Garantias Incluídas
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Garantia de 30 dias</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Acesso vitalício</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Certificado de conclusão</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseEnrollment;
