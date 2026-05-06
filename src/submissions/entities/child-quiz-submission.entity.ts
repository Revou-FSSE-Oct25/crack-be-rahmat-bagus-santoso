export class ChildQuizSubmission {
    id!: string;
    isCorrect!: boolean;
    earnedPoints!: number;
    submittedAt!: Date;
    childId!: string;
    quizId!: string;
    selectedOptionId!: string;
}
