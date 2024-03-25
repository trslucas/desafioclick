import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { InMemoryClassRepository } from '../repository/in-memory/in-memory-class-repository'
import { GetRoomUseCase } from './get-room-use-case'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: GetRoomUseCase

describe('Get Room Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new GetRoomUseCase(usersRepository, classRepository)
  })

  it('should be able to get a room infos', async () => {
    const createdUser = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    const createdRoom = await classRepository.create({
      owner_id: createdUser.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    const { room } = await sut.execute({
      userId: createdUser.id,
    })

    expect(room.id).toEqual(expect.any(String))
    expect(createdUser.id).toEqual(room.owner_id)
    expect(createdUser.id).toEqual(createdRoom.owner_id)
  })
})
