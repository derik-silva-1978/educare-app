import { useQuery } from '@tanstack/react-query';
import { getStoredAuthToken } from '@/utils/authStorage';

export interface BiometricsData {
  id: string;
  weight: number | null;
  height: number | null;
  headCircumference: number | null;
  recordedAt: string;
  source: string;
}

export interface SleepLogData {
  id: string;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number | null;
  sleepType: string;
  quality: string;
  createdAt: string;
}

export interface VaccineData {
  vaccine: string;
  weeks: number;
  dose: number | string;
  status: 'taken' | 'pending' | 'upcoming';
  takenAt?: string;
}

export interface AppointmentData {
  id: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  location: string;
  status: string;
}

export interface DevelopmentLeap {
  week: number;
  name: string;
}

export interface BabyHealthSummary {
  hasChild: boolean;
  child: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    ageInWeeks: number;
    ageInMonths: number;
    ageDisplay: string;
  } | null;
  biometrics: BiometricsData[];
  sleepLogs: SleepLogData[];
  vaccines: {
    taken: VaccineData[];
    pending: VaccineData[];
    upcoming: VaccineData[];
    nextVaccine: VaccineData | null;
  };
  appointments: AppointmentData[];
  summary: {
    latestWeight: number | null;
    latestHeight: number | null;
    lastMeasurementDate: string | null;
    avgSleepPerDay: number | null;
    pendingVaccinesCount: number;
    upcomingAppointmentsCount: number;
    currentLeap: DevelopmentLeap | null;
    nextLeap: DevelopmentLeap | null;
    nextLeapWeeksAway: number | null;
  } | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchBabyHealthSummary(childId?: string): Promise<BabyHealthSummary> {
  const token = getStoredAuthToken();
  const url = childId 
    ? `${API_BASE_URL}/api/dashboard/baby-health-summary?childId=${childId}`
    : `${API_BASE_URL}/api/dashboard/baby-health-summary`;
    
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar resumo de saúde');
  }

  return response.json();
}

export function useBabyHealthSummary(childId?: string) {
  return useQuery({
    queryKey: ['baby-health-summary', childId],
    queryFn: () => fetchBabyHealthSummary(childId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
}
