import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Training {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  audience: string;
  modulesCount: number;
  pricing: {
    price: number;
    discountPrice: number | null;
    isFree: boolean;
  } | null;
  createdAt: string;
}

interface TrainingDetails {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  audience: string;
  isEnrolled: boolean;
  pricing: {
    price: number;
    discountPrice: number | null;
    isFree: boolean;
    stripePriceId: string | null;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    percent: number;
  } | null;
  modules: TrainingModule[];
}

interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  durationMinutes: number | null;
  isPreview: boolean;
  lessons: TrainingLesson[];
}

interface TrainingLesson {
  id: string;
  title: string;
  contentType: string;
  durationMinutes: number | null;
  isPreview: boolean;
  canAccess: boolean;
  progress: {
    percent: number;
    completed: boolean;
  } | null;
  video: {
    thumbnailUrl: string | null;
    durationSeconds: number | null;
  } | null;
}

interface CreateTrainingData {
  title: string;
  description: string;
  thumbnailUrl?: string;
  audience?: string;
  pricing?: {
    price: number;
    discountPrice?: number;
    isFree: boolean;
  };
  modules?: {
    title: string;
    description?: string;
    durationMinutes?: number;
    isPreview?: boolean;
    lessons?: {
      title: string;
      contentType?: string;
      videoId?: string;
      durationMinutes?: number;
      isPreview?: boolean;
    }[];
  }[];
}

export function useTrainings(audience = "all", page = 1, limit = 10) {
  return useQuery<{ data: Training[]; pagination: { total: number; page: number; totalPages: number } }>({
    queryKey: ["trainings", audience, page, limit],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${API_URL}/api/trainings?audience=${audience}&page=${page}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Erro ao buscar treinamentos");
      const json = await res.json();
      return json;
    },
  });
}

export function useTrainingDetails(trainingId: string) {
  return useQuery<TrainingDetails>({
    queryKey: ["training", trainingId],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/trainings/${trainingId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erro ao buscar detalhes do treinamento");
      const json = await res.json();
      return json.data;
    },
    enabled: !!trainingId,
  });
}

export function useUserEnrollments() {
  return useQuery<{ id: string; trainingId: string; title: string; thumbnailUrl: string | null; enrolledAt: string; progress: { completedLessons: number; percent: number } }[]>({
    queryKey: ["user-enrollments"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Não autenticado");
      
      const res = await fetch(`${API_URL}/api/trainings/user/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar matrículas");
      const json = await res.json();
      return json.data;
    },
  });
}

export function useEnrollInTraining() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (trainingId: string) => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Não autenticado");
      
      const res = await fetch(`${API_URL}/api/trainings/${trainingId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const error = await res.json();
        if (error.requiresPayment) {
          throw { message: "Pagamento necessário", requiresPayment: true, stripePriceId: error.stripePriceId };
        }
        throw new Error(error.error || "Erro ao matricular");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["training"] });
    },
  });
}

export function useCreateTraining() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTrainingData) => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Não autenticado");
      
      const res = await fetch(`${API_URL}/api/trainings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao criar treinamento");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
    },
  });
}

export function useUpdateTraining() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateTrainingData> & { status?: string }) => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Não autenticado");
      
      const res = await fetch(`${API_URL}/api/trainings/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao atualizar treinamento");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
      queryClient.invalidateQueries({ queryKey: ["training"] });
    },
  });
}

export function useDeleteTraining() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Não autenticado");
      
      const res = await fetch(`${API_URL}/api/trainings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao excluir treinamento");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainings"] });
    },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async ({ trainingId, successUrl, cancelUrl }: { trainingId: string; successUrl?: string; cancelUrl?: string }) => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Não autenticado");
      
      const res = await fetch(`${API_URL}/api/trainings/${trainingId}/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ successUrl, cancelUrl }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao criar sessão de checkout");
      }
      
      return res.json();
    },
  });
}
