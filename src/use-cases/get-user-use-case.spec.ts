import { describe, expect, it } from 'vitest'
import { GetUserUseCase } from './get-user-use-case'
import { beforeEach } from 'node:test'
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
      birth_date: new Date('1993-20-10'),
      registration: 1291,
      user_type: 'TEACHER',
    })
    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    console.log(user)

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Lucas Trindade')
  })
})
