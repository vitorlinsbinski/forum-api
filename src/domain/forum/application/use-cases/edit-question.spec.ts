import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { EditQuestion } from './edit-question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestion;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestion(inMemoryQuestionsRepository);
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1')
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      questionId: newQuestion.id.toValue(),
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
    });
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author-1') },
      new UniqueEntityId('question-1')
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        title: 'Pergunta teste',
        content: 'Conteúdo teste',
        questionId: newQuestion.id.toValue(),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
