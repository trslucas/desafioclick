import { InMemoryClassRepository } from '../repository/in-memory/in-memory-rooms-repository'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { CreateRoomUseCase } from './create-room-use-case'

import { beforeEach, describe, expect, it } from 'vitest'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: CreateRoomUseCase

describe('Create Room Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new CreateRoomUseCase(usersRepository, classRepository)
  })
  it('should be able to create a room', async () => {
    const user = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    if (user.user_type !== 'TEACHER') {
      throw new Error()
    }

    const { room } = await sut.execute({
      teacher_id: user.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    expect(room.id).toEqual(expect.any(String))
    expect(room.teacher_id).toEqual(user.id)
    expect(user.user_type).toEqual('TEACHER')
  })
})
