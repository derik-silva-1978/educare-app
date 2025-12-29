import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import httpClient from '@/services/api/httpClient';

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        
        if (audioBlob.size < 1000) {
          toast({
            title: 'Gravação muito curta',
            description: 'Por favor, fale por mais tempo.',
            variant: 'destructive'
          });
          return;
        }

        await transcribeAudio(audioBlob, mimeType);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      
      toast({
        title: 'Gravando...',
        description: 'Fale sua pergunta. Clique no botão novamente para parar.',
      });
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        title: 'Erro de acesso ao microfone',
        description: 'Por favor, permita o acesso ao microfone nas configurações do navegador.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribeAudio = async (audioBlob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      const extension = mimeType.includes('webm') ? 'webm' : 'mp4';
      formData.append('audio', audioBlob, `recording.${extension}`);

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/rag/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('educare_access_token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.text) {
        onTranscription(data.text);
        toast({
          title: 'Transcrição concluída',
          description: 'Sua pergunta foi transcrita com sucesso.',
        });
      } else {
        throw new Error(data.error || 'Erro na transcrição');
      }
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: 'Erro na transcrição',
        description: 'Não foi possível transcrever o áudio. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      type="button"
      variant={isRecording ? 'destructive' : 'outline'}
      size="icon"
      onClick={handleClick}
      disabled={disabled || isTranscribing}
      className={`relative ${isRecording ? 'animate-pulse' : ''}`}
      aria-label={isRecording ? 'Parar gravação' : 'Gravar áudio'}
    >
      {isTranscribing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isRecording ? (
        <Square className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      {isRecording && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
      )}
    </Button>
  );
};

export default AudioRecorder;
