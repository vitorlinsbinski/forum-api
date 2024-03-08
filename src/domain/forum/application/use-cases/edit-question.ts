import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
}

interface EditQuestionResponse {
  question: Question;
}

export class EditQuestion {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      throw new Error('Question not found');
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.');
    }

    question.title = title;
    question.content = content;

    await this.questionsRepository.save(question);

    return { question };
  }
}
