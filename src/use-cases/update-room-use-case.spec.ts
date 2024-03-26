import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'

import { InMemoryClassRepository } from '../repository/in-memory/in-memory-rooms-repository'
import { UpdateRoomUseCase } from './update-room-use-case'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: UpdateRoomUseCase

describe('Update Room Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new UpdateRoomUseCase(usersRepository, classRepository)
  })

  it('should be able to update a classroom data', async () => {
    const teacher = await usersRepository.create({
      name: 'Jair Oliveira',
      email: 'jair@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 124543,
      user_type: 'TEACHER',
    })

    const classRoom = await classRepository.create({
      teacher: { connect: { id: teacher.id } },
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    const { room } = await sut.execute({
      ownerId: teacher.id,
      classId: classRoom.id,
      capacity: 10,
      class_number: 102,
      isAvaiable: false,
    })

    expect(room.capacity).toEqual(10)
  })
})
