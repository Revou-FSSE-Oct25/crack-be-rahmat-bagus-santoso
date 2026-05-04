import { Lesson } from "../../lessons/entities/lesson.entity";

export class Module {
    id!: string;
    title!: string;
    description!: string | null;
    icon!: string | null;
    createdAt!: Date;
    lessons?: Lesson[]
}
