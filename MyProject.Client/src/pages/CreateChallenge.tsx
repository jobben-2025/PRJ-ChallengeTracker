import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  CreateChallengeSchema,
  type CreateChallengeInput,
} from "../types/challenge";

import { useCreateChallenge } from "../data/challengeQueries";

export const CreateChallenge = () => {
  const navigate = useNavigate();
  const { mutateAsync: createChallenge, isPending } = useCreateChallenge();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateChallengeInput>({
    resolver: zodResolver(CreateChallengeSchema),
    defaultValues: { goalDays: 30 },
  });

  const onSubmit = async (data: CreateChallengeInput) => {
    try {
      // Her just call mutateAsync, Hook makes the rest
      await createChallenge(data);
    } catch (error) {
      console.error("Form error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
      <h2 className="text-3xl font-black text-slate-900 mb-8">
        Start new Challenge
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            Title
          </label>
          <input
            {...register("title")}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
            placeholder="z.B. 30 Tage ohne Zucker"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-2 ml-2">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
            placeholder="Was ist dein Ziel?"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-2 ml-2">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            Time Limit (Tage)
          </label>
          <input
            type="number"
            {...register("goalDays", { valueAsNumber: true })}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold"
          />
          {errors.goalDays && (
            <p className="text-red-500 text-xs mt-2 ml-2">
              {errors.goalDays.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
        >
          {isPending ? "Creating..." : "Create Challenge"}
        </button>
      </form>
    </div>
  );
};
