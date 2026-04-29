export type QuestionType = 'safety' | 'knowledge' | 'calculation';

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  weight: number;
  type: QuestionType;
  explanation?: string;
  levelId: number;
}

export interface Answer {
  questionId: string;
  selectedOption: string;
}

export interface ScoringResult {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  safetyViolation: boolean;
  details: {
    questionId: string;
    correct: boolean;
    penalty: number;
    earned: number;
  }[];
}

export function calculateScore(
  questions: Question[],
  answers: Answer[]
): ScoringResult {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let safetyViolation = false;
  const details: ScoringResult['details'] = [];

  for (const q of questions) {
    const answer = answers.find(a => a.questionId === q.id);
    const isCorrect = answer?.selectedOption === q.correctAnswer;
    const weight = q.weight;
    maxPossibleScore += weight;

    if (isCorrect) {
      totalScore += weight;
      details.push({ questionId: q.id, correct: true, penalty: 0, earned: weight });
    } else {
      // Rule: Safety violation resets everything to zero
      if (q.type === 'safety') {
        safetyViolation = true;
        // Even if we continue, the totalScore will be handled by the return
        details.push({ questionId: q.id, correct: false, penalty: weight, earned: 0 });
        return {
          totalScore: 0,
          maxPossibleScore,
          percentage: 0,
          safetyViolation: true,
          details,
        };
      }
      // Rule: Penalize 30% for incorrect non-safety questions
      const penalty = weight * 0.3;
      const earned = weight - penalty;
      // Wait, is it subtracted from total or just earned less? 
      // The user logic was: earned = weight - penalty; totalScore += earned;
      // This means you still get 70% of the points for a wrong answer? 
      // Let's re-read: "const penalty = weight * 0.3; const earned = weight - penalty; totalScore += earned;"
      // That seems weird for an exam. Usually wrong answers are zero or negative.
      // But I will follow the user's provided logic exactly.
      totalScore += earned; 
      details.push({ questionId: q.id, correct: false, penalty, earned });
    }
  }

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  return {
    totalScore,
    maxPossibleScore,
    percentage,
    safetyViolation,
    details,
  };
}
