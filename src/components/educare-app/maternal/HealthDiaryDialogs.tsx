import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Activity, Moon, Apple, Heart, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAddDailyHealth, useAddMentalHealth, useAddAppointment } from '@/hooks/educare-app/useMotherHealth';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

const energyEmojis = ['😫', '😐', '😊', '😄', '🤩'];
const nauseaLabels: Record<number, string> = { 0: 'Nenhuma', 1: 'Leve', 2: 'Moderada', 3: 'Média', 4: 'Forte', 5: 'Severa' };
const sleepQualityLabels: Record<number, string> = { 1: 'Péssimo', 2: 'Ruim', 3: 'Regular', 4: 'Bom', 5: 'Ótimo' };

export const DailyHealthDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const addDailyHealth = useAddDailyHealth();

  const [date, setDate] = useState(getToday());
  const [weight, setWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [temperature, setTemperature] = useState('');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [nauseaLevel, setNauseaLevel] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDate(getToday());
      setWeight('');
      setSystolic('');
      setDiastolic('');
      setGlucose('');
      setTemperature('');
      setEnergyLevel(3);
      setNauseaLevel(0);
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      await addDailyHealth.mutateAsync({
        date,
        weight: weight ? parseFloat(weight) : undefined,
        bloodPressureSystolic: systolic ? parseInt(systolic) : undefined,
        bloodPressureDiastolic: diastolic ? parseInt(diastolic) : undefined,
        bloodGlucose: glucose ? parseFloat(glucose) : undefined,
        temperature: temperature ? parseFloat(temperature) : undefined,
        energyLevel,
        nauseaLevel,
        notes: notes || undefined,
      });
      toast({ title: 'Registro salvo!', description: 'Seus dados de saúde foram registrados com sucesso.' });
      onClose();
    } catch {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar os dados. Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border-rose-200">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Activity className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <DialogTitle>Registrar Saúde Diária</DialogTitle>
              <DialogDescription>Registre seus sinais vitais e sintomas</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-rose-200" />
          </div>

          <div className="space-y-2">
            <Label>Peso (kg)</Label>
            <Input type="number" step="0.1" placeholder="Ex: 65.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="border-rose-200" />
          </div>

          <div className="space-y-2">
            <Label>Pressão Arterial</Label>
            <div className="flex gap-2 items-center">
              <Input type="number" placeholder="Sistólica" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="border-rose-200" />
              <span className="text-muted-foreground">/</span>
              <Input type="number" placeholder="Diastólica" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="border-rose-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Glicemia (mg/dL)</Label>
              <Input type="number" step="0.1" placeholder="Ex: 90" value={glucose} onChange={(e) => setGlucose(e.target.value)} className="border-rose-200" />
            </div>
            <div className="space-y-2">
              <Label>Temperatura (°C)</Label>
              <Input type="number" step="0.1" placeholder="Ex: 36.5" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="border-rose-200" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Nível de Energia</Label>
              <span className="text-lg">{energyEmojis[energyLevel - 1]}</span>
            </div>
            <Slider
              value={[energyLevel]}
              onValueChange={(v) => setEnergyLevel(v[0])}
              min={1}
              max={5}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😫 Exausta</span>
              <span>🤩 Ótima</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Nível de Náusea</Label>
              <span className="text-sm font-medium text-rose-600">{nauseaLabels[nauseaLevel]}</span>
            </div>
            <Slider
              value={[nauseaLevel]}
              onValueChange={(v) => setNauseaLevel(v[0])}
              min={0}
              max={5}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Nenhuma</span>
              <span>Severa</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Alguma observação sobre como você se sente hoje?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-rose-200"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={addDailyHealth.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addDailyHealth.isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {addDailyHealth.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SleepLogDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const addDailyHealth = useAddDailyHealth();
  const addMentalHealth = useAddMentalHealth();

  const [date, setDate] = useState(getToday());
  const [sleepHours, setSleepHours] = useState('7');
  const [sleepQuality, setSleepQuality] = useState(3);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDate(getToday());
      setSleepHours('7');
      setSleepQuality(3);
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all([
        addDailyHealth.mutateAsync({
          date,
          sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
          notes: notes ? `[Sono] ${notes}` : undefined,
        }),
        addMentalHealth.mutateAsync({
          date,
          sleepQuality,
        }),
      ]);
      toast({ title: 'Sono registrado!', description: 'Seus dados de sono foram salvos com sucesso.' });
      onClose();
    } catch {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar os dados. Tente novamente.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hoursNum = parseFloat(sleepHours) || 0;
  const sleepPercentage = Math.min((hoursNum / 12) * 100, 100);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border-rose-200">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Moon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle>Registrar Sono</DialogTitle>
              <DialogDescription>Como foi seu descanso?</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-rose-200" />
          </div>

          <div className="space-y-2">
            <Label>Horas de Sono</Label>
            <Input
              type="number"
              step="0.5"
              min="0"
              max="12"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="border-rose-200"
            />
            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all"
                style={{ width: `${sleepPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>4h</span>
              <span>8h</span>
              <span>12h</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Qualidade do Sono</Label>
              <span className="text-sm font-medium text-indigo-600">{sleepQualityLabels[sleepQuality]}</span>
            </div>
            <Slider
              value={[sleepQuality]}
              onValueChange={(v) => setSleepQuality(v[0])}
              min={1}
              max={5}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Péssimo</span>
              <span>Ótimo</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Alguma observação sobre seu sono? (Ex: acordou durante a noite, teve pesadelos...)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-rose-200"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const MealLogDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const addDailyHealth = useAddDailyHealth();

  const [date, setDate] = useState(getToday());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDate(getToday());
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      await addDailyHealth.mutateAsync({
        date,
        notes: `[Alimentação] ${notes}`,
      });
      toast({ title: 'Anotação salva!', description: 'Suas observações sobre alimentação foram registradas.' });
      onClose();
    } catch {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar os dados. Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border-rose-200">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Apple className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>Registrar Alimentação</DialogTitle>
              <DialogDescription>Anote sobre sua alimentação</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Em Desenvolvimento
          </Badge>
          <p className="text-sm text-muted-foreground">
            O registro detalhado de refeições está sendo desenvolvido. Por enquanto, você pode anotar observações sobre sua alimentação.
          </p>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-rose-200" />
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Descreva como foi sua alimentação hoje..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-rose-200"
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={addDailyHealth.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addDailyHealth.isPending || !notes.trim()}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {addDailyHealth.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const moodOptions = [
  { score: 1, emoji: '😢', label: 'Difícil' },
  { score: 2, emoji: '😕', label: 'Regular' },
  { score: 3, emoji: '😐', label: 'Ok' },
  { score: 4, emoji: '😊', label: 'Bom' },
  { score: 5, emoji: '😄', label: 'Ótimo' },
];

export const MoodLogDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const addMentalHealth = useAddMentalHealth();

  const [date, setDate] = useState(getToday());
  const [moodScore, setMoodScore] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState(1);
  const [stressLevel, setStressLevel] = useState(1);
  const [supportFeeling, setSupportFeeling] = useState(3);
  const [positiveMoments, setPositiveMoments] = useState('');
  const [concerns, setConcerns] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDate(getToday());
      setMoodScore(3);
      setAnxietyLevel(1);
      setStressLevel(1);
      setSupportFeeling(3);
      setPositiveMoments('');
      setConcerns('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      await addMentalHealth.mutateAsync({
        date,
        moodScore,
        anxietyLevel,
        stressLevel,
        supportFeeling,
        positiveMoments: positiveMoments || undefined,
        concerns: concerns || undefined,
      });
      toast({ title: 'Humor registrado!', description: 'Seu registro emocional foi salvo com sucesso.' });
      onClose();
    } catch {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar os dados. Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border-rose-200">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-50 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <DialogTitle>Registrar Humor</DialogTitle>
              <DialogDescription>Como você está se sentindo hoje?</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-rose-200" />
          </div>

          <div className="space-y-2">
            <Label>Como está seu humor?</Label>
            <div className="flex gap-2 justify-center">
              {moodOptions.map((option) => (
                <button
                  key={option.score}
                  type="button"
                  onClick={() => setMoodScore(option.score)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                    moodScore === option.score
                      ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300 shadow-md'
                      : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50/50'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs mt-1 font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ansiedade</Label>
              <span className="text-sm font-medium text-pink-600">
                {anxietyLevel <= 1 ? 'Calma' : anxietyLevel <= 2 ? 'Leve' : anxietyLevel <= 3 ? 'Moderada' : anxietyLevel <= 4 ? 'Alta' : 'Muito Ansiosa'}
              </span>
            </div>
            <Slider value={[anxietyLevel]} onValueChange={(v) => setAnxietyLevel(v[0])} min={1} max={5} step={1} className="py-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calma</span>
              <span>Muito Ansiosa</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Estresse</Label>
              <span className="text-sm font-medium text-pink-600">
                {stressLevel <= 1 ? 'Relaxada' : stressLevel <= 2 ? 'Leve' : stressLevel <= 3 ? 'Moderado' : stressLevel <= 4 ? 'Alto' : 'Muito Estressada'}
              </span>
            </div>
            <Slider value={[stressLevel]} onValueChange={(v) => setStressLevel(v[0])} min={1} max={5} step={1} className="py-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Relaxada</span>
              <span>Muito Estressada</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Apoio</Label>
              <span className="text-sm font-medium text-pink-600">
                {supportFeeling <= 1 ? 'Sozinha' : supportFeeling <= 2 ? 'Pouco Apoiada' : supportFeeling <= 3 ? 'Apoiada' : supportFeeling <= 4 ? 'Bem Apoiada' : 'Muito Apoiada'}
              </span>
            </div>
            <Slider value={[supportFeeling]} onValueChange={(v) => setSupportFeeling(v[0])} min={1} max={5} step={1} className="py-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sozinha</span>
              <span>Muito Apoiada</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Momentos positivos</Label>
            <Textarea
              placeholder="O que de bom aconteceu hoje?"
              value={positiveMoments}
              onChange={(e) => setPositiveMoments(e.target.value)}
              className="border-rose-200"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Preocupações</Label>
            <Textarea
              placeholder="Algo te preocupa?"
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              className="border-rose-200"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={addMentalHealth.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addMentalHealth.isPending}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {addMentalHealth.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const NewAppointmentDialog: React.FC<DialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const addAppointment = useAddAppointment();

  const [appointmentType, setAppointmentType] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAppointmentType('');
      setDoctorName('');
      setAppointmentDate('');
      setLocation('');
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!appointmentType || !appointmentDate) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha o tipo de consulta e a data.', variant: 'destructive' });
      return;
    }
    try {
      await addAppointment.mutateAsync({
        appointmentType,
        doctorName: doctorName || undefined,
        appointmentDate: new Date(appointmentDate).toISOString(),
        location: location || undefined,
        status: 'scheduled',
        notes: notes || undefined,
      });
      toast({ title: 'Consulta agendada!', description: 'Sua consulta foi registrada com sucesso.' });
      onClose();
    } catch {
      toast({ title: 'Erro ao agendar', description: 'Não foi possível agendar a consulta. Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md border-rose-200">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Calendar className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
              <DialogDescription>Registre sua próxima consulta médica</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Tipo de Consulta *</Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger className="border-rose-200">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pré-natal">Pré-natal</SelectItem>
                <SelectItem value="Ultrassom">Ultrassom</SelectItem>
                <SelectItem value="Exames">Exames</SelectItem>
                <SelectItem value="Retorno">Retorno</SelectItem>
                <SelectItem value="Especialista">Especialista</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome do Médico</Label>
            <Input
              placeholder="Dr(a). ..."
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="border-rose-200"
            />
          </div>

          <div className="space-y-2">
            <Label>Data e Hora *</Label>
            <Input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="border-rose-200"
            />
          </div>

          <div className="space-y-2">
            <Label>Local</Label>
            <Input
              placeholder="Clínica, hospital ou endereço"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-rose-200"
            />
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Algo a lembrar para a consulta?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-rose-200"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={addAppointment.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addAppointment.isPending || !appointmentType || !appointmentDate}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {addAppointment.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
