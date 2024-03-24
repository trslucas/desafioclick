import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { UpdateUserUseCase } from './update-user-use-case'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should be able to update a user data', async () => {
    const firstUser = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    const { user } = await sut.execute({
      userId: firstUser.id,
      email: 'lucas@thummi.global',
      user_type: 'STUDENT',
    })

    expect(user.email).toEqual('lucas@thummi.global')
    expect(user.user_type).toEqual('STUDENT')
    expect(user.name).toEqual('Lucas Trindade')
  })
})
