import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { InMemoryClassRepository } from '../repository/in-memory/in-memory-class-repository'
import { DeleteClassRoomUseCase } from './delete-room-use-case'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: DeleteClassRoomUseCase

describe('Delete Classroom Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new DeleteClassRoomUseCase(usersRepository, classRepository)
  })

  it('should be able to delete a classroom', async () => {
    const teacher = await usersRepository.create({
      name: 'Jair Oliveira',
      email: 'jair@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 124543,
      user_type: 'TEACHER',
    })

    const firstRomm = await classRepository.create({
      owner_id: teacher.id,
      capacity: 20,
      class_number: 201,
      isAvaiable: true,
    })

    await classRepository.create({
      owner_id: teacher.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    const rooms = await classRepository.findById(teacher.id)

    await sut.execute({
      classId: firstRomm.id,
      ownerId: teacher.id,
    })

    const deletedRooms = await classRepository.findById(teacher.id)

    expect(rooms).toHaveLength(2)
    expect(deletedRooms).toHaveLength(1)
  })
})
