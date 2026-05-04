import { Option } from '../../options/entities/option.entity'; 

export class Quiz {
    id!: string;
    question!: string;
    explanation!: string | null;
    orderNumber!: number;
    points!: number;
    lessonId!: string;
    options!: Option[]
}
