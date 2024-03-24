import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register-use-case'

import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register a user', async () => {
    const { user } = await sut.execute({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
