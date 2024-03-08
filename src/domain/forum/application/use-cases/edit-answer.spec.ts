import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { EditAnswer } from './edit-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswer;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswer(inMemoryAnswersRepository);
  });

  it('should be able to edit an answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1')
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: 'author-1',
      content: 'Conteúdo teste',
      answerId: newAnswer.id.toValue(),
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conteúdo teste',
    });
  });

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('answer-1')
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        content: 'Conteúdo teste',
        answerId: newAnswer.id.toValue(),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
