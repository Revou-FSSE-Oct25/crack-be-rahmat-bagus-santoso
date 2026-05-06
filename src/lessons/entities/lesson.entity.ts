import { Quiz } from "../../quizzes/entities/quiz.entity";

export class Lesson {
    id!: string;
    title!: string;
    content!: string;
    orderNumber!: number;
    moduleId!: string;
    quizzes?: Quiz[]
}
