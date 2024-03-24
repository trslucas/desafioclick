import { beforeEach, describe, expect, it } from 'vitest'

import { DeleteUserUseCase } from './delete-user-use-case'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('be should delete a user', async () => {
    await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1291,
      user_type: 'TEACHER',
    })

    await usersRepository.create({
      name: 'Mateus Oliveira',
      email: 'mateus@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 124543,
      user_type: 'TEACHER',
    })

    const user = await usersRepository.create({
      name: 'Raphael Silva',
      email: 'raphael@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 543534,
      user_type: 'STUDENT',
    })

    await sut.execute({ userId: user.id })

    const deletedUser = await usersRepository.findById(user.id)

    expect(deletedUser).toBeNull()
  })
})
