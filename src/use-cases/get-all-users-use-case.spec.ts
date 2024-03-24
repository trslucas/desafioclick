import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { GetAllUsersUseCase } from './get-all-users-use-case'

let usersRepository: InMemoryUsersRepository
let sut: GetAllUsersUseCase

describe('Get User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetAllUsersUseCase(usersRepository)
  })

  it('should be able to get a all users profile', async () => {
    await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1291,
      user_type: 'TEACHER',
    })

    await usersRepository.create({
      name: 'Raphael Oliveira',
      email: 'raphaeloliveira@outlook.com',
      birth_date: new Date('1993-08-04'),
      registration: 39847,
      user_type: 'TEACHER',
    })

    const { users } = await sut.execute()

    expect(users).toHaveLength(2)
  })
})
