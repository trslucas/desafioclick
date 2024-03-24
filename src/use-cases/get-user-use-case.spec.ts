import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserUseCase } from './get-user-use-case'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: GetUserUseCase

describe('Get User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserUseCase(usersRepository)
  })

  it('should be able to get a user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1291,
      user_type: 'TEACHER',
    })
    // Executa o caso de uso para obter o perfil do usuário
    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user).toBeDefined()

    // Verifica se o id é uma string se estiver definido

    console.log(user)
    expect(user.name).toEqual('Lucas Trindade')
  })
})
