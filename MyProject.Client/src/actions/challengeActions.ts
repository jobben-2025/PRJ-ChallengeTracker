import axios from "axios";
import { ChallengeVisibility, type Challenge } from "../types/challenge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const api = axios.create({
  baseURL: "http://localhost:5039",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const joinChallenge = async (id: number): Promise<void> => {
  await api.post(`/challenges/${id}/join`, {});
};

// --- API functions ---

export const createChallenge = async (
  data: Partial<Challenge>,
): Promise<Challenge> => {
  const response = await api.post<Challenge>("/challenges", data);
  return response.data;
};

export const updateChallenge = async (
  id: string,
  updates: Partial<Challenge>,
): Promise<Challenge> => {
  const response = await api.patch<Challenge>(`/challenges/${id}`, updates);
  return response.data;
};

export const deleteChallenge = async (id: number): Promise<void> => {
  await api.delete(`/challenges/${id}`);
};

export const useChallenges = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: getJoinedChallenges, // oder getDiscoverChallenges
  });
};

export const getJoinedChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get<Challenge[]>("/challenges");
  return response.data;
};

export const getDiscoverChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get<Challenge[]>("/challenges/joined", {
    params: { visibility: ChallengeVisibility.Public },
  });
  return response.data;
  //return response.data;
};

export const leaveChallenge = async (id: string): Promise<void> => {
  await api.delete(`/challenges/${id}`);
};

export const useChallengeActions = () => {
  const queryClient = useQueryClient();

  // WICHTIG: Invaldiert ALLES, was mit 'challenges' zu tun hat
  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: ["challenges"],
      exact: false, // Das sorgt dafür, dass auch ['challenges', 'joined'] etc. erwischt werden
    });
  };

  const createMutation = useMutation({
    mutationFn: createChallenge,
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Challenge>;
    }) => updateChallenge(id, updates),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChallenge,
    onSuccess: invalidateAll,
  });

  const joinMutation = useMutation({
    mutationFn: joinChallenge,
    onSuccess: invalidateAll,
  });

  const leaveMutation = useMutation({
    mutationFn: leaveChallenge,
    onSuccess: invalidateAll,
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
    join: joinMutation.mutate,
    leave: leaveMutation.mutate,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      joinMutation.isPending ||
      leaveMutation.isPending,
  };
};
