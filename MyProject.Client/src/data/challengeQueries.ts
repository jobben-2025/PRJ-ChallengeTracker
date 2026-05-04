import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { Challenge, CreateChallengeInput } from "../types/challenge";
import {
  getJoinedChallenges,
  getDiscoverChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "../actions/challengeActions";

// --- QUERY HOOKS (Daten laden) ---

// Wird von History & Detail genutzt
export const useChallenges = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: getJoinedChallenges,
  });
};

/* export const useJoinedChallenges = () => {
  return useQuery({
    queryKey: ["challenges", "joined"],
    queryFn: getJoinedChallenges,
  });
}; */

export const useJoinedChallenges = () => {
  return useQuery({
    queryKey: ["joinedChallenges"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5039/challenges/joined");
      if (!response.ok) throw new Error("Netzwerk-Fehler");
      return response.json();
    },
  });
};

export const useDiscoverChallenges = () => {
  return useQuery({
    queryKey: ["challenges", "discover"],
    queryFn: getDiscoverChallenges,
  });
};

// --- MUTATION HOOKS (Daten ändern) ---

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("Challenge erfolgreich erstellt!");
      navigate(`/challenges/${data.id}`);
    },
    onError: () => {
      toast.error("Fehler beim Erstellen der Challenge");
    },
  });
};

export const useLogProgress = (challengeId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      newTotal,
      goal,
      currentProgress,
    }: {
      newTotal: number;
      goal: number;
      currentProgress: number;
    }) =>
      updateChallenge(challengeId.toString(), {
        newTotal: newTotal, // Passend zum C# DTO "NewTotal"
        //goal: goal,
        isFinished: currentProgress + newTotal >= goal,
      }),
    onSuccess: (updatedChallenge) => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },

    onError: (error) => {
      console.error("Update Fehler:", error);
      toast.error("Fehler beim Speichern des Fortschritts.");
    },
  });
};

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("Challenge gelöscht");
      //navigate("/");
    },
    onError: () => {
      toast.error("Fehler beim Löschen");
    },
  });
};
