import httpClient, { ApiResponse } from './httpClient';

export interface MaternalProfile {
  id: string;
  userId: string;
  name: string;
  dueDate?: string;
  lastPeriodDate?: string;
  pregnancyWeek?: number;
  highRisk: boolean;
  doctorName?: string;
  nextAppointment?: string;
  bloodType?: string;
  height?: number;
  prePregnancyWeight?: number;
  notes?: string;
  stage?: 'pregnancy' | 'postpartum' | 'planning';
  createdAt: string;
  updatedAt: string;
}

export interface MaternalDailyHealth {
  id: string;
  profileId: string;
  userId: string;
  date: string;
  weight?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodGlucose?: number;
  temperature?: number;
  sleepHours?: number;
  energyLevel?: number;
  nauseaLevel?: number;
  notes?: string;
}

export interface MaternalMentalHealth {
  id: string;
  profileId: string;
  userId: string;
  date: string;
  moodScore?: number;
  anxietyLevel?: number;
  stressLevel?: number;
  sleepQuality?: number;
  supportFeeling?: number;
  concerns?: string;
  positiveMoments?: string;
  notes?: string;
}

export interface MaternalAppointment {
  id: string;
  profileId: string;
  userId: string;
  appointmentType: string;
  doctorName?: string;
  appointmentDate: string;
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MoodSummary {
  period7d: { avgMood: number; avgAnxiety: number; avgStress: number; avgSleepQuality: number; avgSupport: number; count: number; };
  period30d: { avgMood: number; avgAnxiety: number; avgStress: number; avgSleepQuality: number; avgSupport: number; count: number; };
}

export interface DashboardSummary {
  profile: MaternalProfile;
  latestDailyHealth: MaternalDailyHealth[];
  upcomingAppointments: MaternalAppointment[];
  recentMood: MaternalMentalHealth[];
  moodSummary: MoodSummary;
}

export const getProfile = async (): Promise<ApiResponse<{ profile: MaternalProfile }>> => {
  return httpClient.get('/maternal-health/profile');
};

export const updateProfile = async (data: Partial<MaternalProfile>): Promise<ApiResponse<{ profile: MaternalProfile }>> => {
  return httpClient.put('/maternal-health/profile', data);
};

export const addDailyHealth = async (data: Partial<MaternalDailyHealth>): Promise<ApiResponse<{ record: MaternalDailyHealth }>> => {
  return httpClient.post('/maternal-health/daily-health', data);
};

export const getDailyHealth = async (startDate?: string, endDate?: string): Promise<ApiResponse<{ records: MaternalDailyHealth[] }>> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient.get(`/maternal-health/daily-health${query}`);
};

export const addMentalHealth = async (data: Partial<MaternalMentalHealth>): Promise<ApiResponse<{ record: MaternalMentalHealth }>> => {
  return httpClient.post('/maternal-health/mental-health', data);
};

export const getMentalHealth = async (startDate?: string, endDate?: string): Promise<ApiResponse<{ records: MaternalMentalHealth[] }>> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient.get(`/maternal-health/mental-health${query}`);
};

export const getMentalHealthSummary = async (): Promise<ApiResponse<MoodSummary>> => {
  return httpClient.get('/maternal-health/mental-health/summary');
};

export const addAppointment = async (data: Partial<MaternalAppointment>): Promise<ApiResponse<{ appointment: MaternalAppointment }>> => {
  return httpClient.post('/maternal-health/appointments', data);
};

export const getAppointments = async (status?: string): Promise<ApiResponse<{ appointments: MaternalAppointment[] }>> => {
  const query = status ? `?status=${status}` : '';
  return httpClient.get(`/maternal-health/appointments${query}`);
};

export const updateAppointment = async (appointmentId: string, data: Partial<MaternalAppointment>): Promise<ApiResponse<{ appointment: MaternalAppointment }>> => {
  return httpClient.put(`/maternal-health/appointments/${appointmentId}`, data);
};

export const getDashboardSummary = async (): Promise<ApiResponse<DashboardSummary>> => {
  return httpClient.get('/maternal-health/dashboard');
};
