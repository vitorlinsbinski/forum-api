import { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerRequest {
  authorId: string;
  answerId: string;
}

interface DeleteAnswerResponse {}

export class DeleteAnswer {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      throw new Error('Question not found');
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed.');
    }

    await this.answersRepository.delete(answer);

    return {};
  }
}
