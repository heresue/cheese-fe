import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  retryProblemSet,
  saveProblemAnswer,
  skipProblemQuestion,
  submitProblemAnswer,
  type SaveProblemAnswer,
} from '@/api/problem.api';
import { mapProblemQuestion, mapProblemSetDetail } from '@/app/(app)/problem/_utils/mapProblemApi';

import { problemQueryKeys } from './problemQueryKeys';

type ProblemMutationVariables = {
  userId: string;
  problemSetId: string;
};

type ProblemAnswerMutationVariables = ProblemMutationVariables & {
  questionId: string;
  answer: SaveProblemAnswer;
};

function useUpdateProblemCaches() {
  const queryClient = useQueryClient();

  return {
    updateQuestion(
      variables: ProblemAnswerMutationVariables,
      data: ReturnType<typeof mapProblemQuestion>,
    ) {
      queryClient.setQueryData(
        problemQueryKeys.question(variables.userId, variables.problemSetId, variables.questionId),
        data,
      );
      void queryClient.invalidateQueries({
        queryKey: problemQueryKeys.detail(variables.userId, variables.problemSetId),
      });
      void queryClient.invalidateQueries({
        queryKey: problemQueryKeys.sets(variables.userId),
      });
    },
  };
}

export function useSaveProblemAnswerMutation() {
  const { updateQuestion } = useUpdateProblemCaches();

  return useMutation({
    mutationFn: async (variables: ProblemAnswerMutationVariables) =>
      mapProblemQuestion(await saveProblemAnswer(variables)),
    onSuccess: (data, variables) => {
      updateQuestion(variables, data);
    },
  });
}

export function useSubmitProblemAnswerMutation() {
  const queryClient = useQueryClient();
  const { updateQuestion } = useUpdateProblemCaches();

  return useMutation({
    mutationFn: async (variables: ProblemAnswerMutationVariables) =>
      mapProblemQuestion(await submitProblemAnswer(variables)),
    onSuccess: (data, variables) => {
      updateQuestion(variables, data);
      void queryClient.invalidateQueries({
        queryKey: problemQueryKeys.result(variables.userId, variables.problemSetId),
      });
    },
  });
}

export function useSkipProblemQuestionMutation() {
  const queryClient = useQueryClient();
  const { updateQuestion } = useUpdateProblemCaches();

  return useMutation({
    mutationFn: async (variables: ProblemAnswerMutationVariables) =>
      mapProblemQuestion(await skipProblemQuestion(variables)),
    onSuccess: (data, variables) => {
      updateQuestion(variables, data);
      void queryClient.invalidateQueries({
        queryKey: problemQueryKeys.result(variables.userId, variables.problemSetId),
      });
    },
  });
}

export function useRetryProblemSetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: ProblemMutationVariables) =>
      mapProblemSetDetail(await retryProblemSet(variables)),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        problemQueryKeys.detail(variables.userId, variables.problemSetId),
        data,
      );
      queryClient.removeQueries({
        queryKey: problemQueryKeys.questions(variables.userId, variables.problemSetId),
      });
      queryClient.removeQueries({
        queryKey: problemQueryKeys.result(variables.userId, variables.problemSetId),
      });
      void queryClient.invalidateQueries({
        queryKey: problemQueryKeys.sets(variables.userId),
      });
    },
  });
}
