export class QuizOptionForChild {
    id!: string;
    optionText!: string;
    quizId!: string;
}

export class QuizForChild {
    id!: string;
    question!: string;
    explanation!: string | null;
    orderNumber!: number;
    points!: number;
    lessonId!: string;
    options!: QuizOptionForChild[];
}