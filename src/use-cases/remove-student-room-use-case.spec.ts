import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { RemoveStudentRoomUseCase } from './remove-student-room-use-case'
import { InMemoryClassRepository } from '../repository/in-memory/in-memory-rooms-repository'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: RemoveStudentRoomUseCase

describe('Remove Student From ClassRoom User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new RemoveStudentRoomUseCase(usersRepository, classRepository)
  })

  it('should be able to remove a student of classroom', async () => {
    const user1 = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1291,
      user_type: 'STUDENT',
    })

    const user2 = await usersRepository.create({
      name: 'Raphael Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1291,
      user_type: 'STUDENT',
    })

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

    await classRepository.insertStudent(
      classRoom.teacher_id,
      user1.id,
      classRoom.id,
    )
    await classRepository.insertStudent(
      classRoom.teacher_id,
      user2.id,
      classRoom.id,
    )

    await sut.execute({
      studentId: user1.id,
      ownerId: classRoom.teacher_id,
      classId: classRoom.id,
    })

    const room = await classRepository.findById(teacher.id)

    expect(room).toHaveLength(1)
  })
})
