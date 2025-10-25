import clsx from 'clsx';
import type { ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case 'solved':
      return 'text-green-600';
    case 'hints':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getStatusDotColor = (outcome: string) => {
  switch (outcome) {
    case 'solved':
      return 'bg-green-500';
    case 'hints':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};