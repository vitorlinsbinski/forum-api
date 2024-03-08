import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { DeleteAnswer } from './delete-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswer;

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswer(inMemoryAnswersRepository);
  });

  it('should be able to delete an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1')
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({ authorId: 'author-1', answerId: 'answer-1' });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1')
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await expect(() =>
      sut.execute({ authorId: 'author-2', answerId: 'answer-1' })
    ).rejects.toBeInstanceOf(Error);
  });
});
