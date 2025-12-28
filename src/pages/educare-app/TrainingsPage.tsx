import { useState } from "react";
import { useTrainings, useTrainingDetails, useEnrollInTraining, useCreateCheckout } from "@/hooks/useTrainings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Play, Lock, CheckCircle, BookOpen, Clock, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

function TrainingCard({ training, onClick }: { training: { id: string; title: string; description: string; thumbnailUrl: string | null; modulesCount: number; pricing: { price: number; isFree: boolean } | null }; onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {training.thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={training.thumbnailUrl}
            alt={training.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{training.title}</CardTitle>
        <CardDescription className="line-clamp-2">{training.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="flex gap-2">
          <Badge variant="secondary">
            <BookOpen className="h-3 w-3 mr-1" />
            {training.modulesCount} módulos
          </Badge>
        </div>
        <Badge variant={training.pricing?.isFree ? "default" : "secondary"}>
          {training.pricing?.isFree ? "Gratuito" : `R$ ${training.pricing?.price?.toFixed(2)}`}
        </Badge>
      </CardFooter>
    </Card>
  );
}

function TrainingDetailModal({ trainingId, onClose }: { trainingId: string; onClose: () => void }) {
  const { data: training, isLoading } = useTrainingDetails(trainingId);
  const enrollMutation = useEnrollInTraining();
  const checkoutMutation = useCreateCheckout();
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(trainingId);
      toast.success("Matrícula realizada com sucesso!");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "requiresPayment" in err) {
        handleCheckout();
      } else {
        toast.error(err instanceof Error ? err.message : "Erro ao matricular");
      }
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await checkoutMutation.mutateAsync({ trainingId });
      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao iniciar checkout");
    }
  };

  const handleLessonClick = (lessonId: string, canAccess: boolean) => {
    if (!canAccess) {
      toast.error("Você precisa se matricular para acessar esta aula");
      return;
    }
    navigate(`/educare-app/trainings/${trainingId}/lessons/${lessonId}`);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!training) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {training.thumbnailUrl && (
          <div className="w-full md:w-1/3 aspect-video overflow-hidden rounded-lg">
            <img
              src={training.thumbnailUrl}
              alt={training.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{training.title}</h2>
            <p className="text-muted-foreground mt-2">{training.description}</p>
          </div>
          
          {training.isEnrolled && training.progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do curso</span>
                <span>{training.progress.percent}%</span>
              </div>
              <Progress value={training.progress.percent} />
              <p className="text-xs text-muted-foreground">
                {training.progress.completedLessons} de {training.progress.totalLessons} aulas concluídas
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {training.isEnrolled ? (
              <Badge variant="default" className="py-1 px-3">
                <CheckCircle className="h-4 w-4 mr-1" />
                Matriculado
              </Badge>
            ) : training.pricing.isFree ? (
              <Button onClick={handleEnroll} disabled={enrollMutation.isPending}>
                {enrollMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <GraduationCap className="h-4 w-4 mr-2" />
                Matricular-se Gratuitamente
              </Button>
            ) : (
              <Button onClick={handleCheckout} disabled={checkoutMutation.isPending}>
                {checkoutMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Comprar por R$ {training.pricing.price?.toFixed(2)}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Conteúdo do Curso</h3>
        <Accordion type="single" collapsible className="w-full">
          {training.modules.map((module) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-medium">{module.title}</span>
                  {module.durationMinutes && (
                    <Badge variant="outline" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {module.durationMinutes} min
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {module.description && (
                  <p className="text-muted-foreground text-sm mb-3">{module.description}</p>
                )}
                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        lesson.canAccess ? "hover:bg-muted cursor-pointer" : "bg-muted/50"
                      }`}
                      onClick={() => handleLessonClick(lesson.id, lesson.canAccess)}
                    >
                      <div className="flex items-center gap-3">
                        {lesson.progress?.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : lesson.canAccess ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className={!lesson.canAccess ? "text-muted-foreground" : ""}>
                          {lesson.title}
                        </span>
                        {lesson.isPreview && (
                          <Badge variant="outline" className="text-xs">Preview</Badge>
                        )}
                      </div>
                      {lesson.durationMinutes && (
                        <span className="text-sm text-muted-foreground">
                          {lesson.durationMinutes} min
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default function TrainingsPage() {
  const [page, setPage] = useState(1);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const { data, isLoading, error } = useTrainings("all", page, 12);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <p className="text-destructive">Erro ao carregar treinamentos: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Treinamentos</h1>
        <p className="text-muted-foreground">
          Explore nossos cursos e treinamentos para desenvolver novas habilidades
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.data.map((training) => (
          <TrainingCard
            key={training.id}
            training={training}
            onClick={() => setSelectedTraining(training.id)}
          />
        ))}
      </div>

      {data?.data.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum treinamento disponível</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Em breve teremos novos cursos para você
            </p>
          </CardContent>
        </Card>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {page} de {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      <Dialog open={!!selectedTraining} onOpenChange={(open) => !open && setSelectedTraining(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Treinamento</DialogTitle>
          </DialogHeader>
          {selectedTraining && (
            <TrainingDetailModal
              trainingId={selectedTraining}
              onClose={() => setSelectedTraining(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
