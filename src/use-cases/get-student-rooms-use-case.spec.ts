import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'
import { InMemoryClassRepository } from '../repository/in-memory/in-memory-rooms-repository'
import { GetStudentRoomsUseCase } from './get-student-rooms-use-case'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: GetStudentRoomsUseCase

describe('Get Room Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new GetStudentRoomsUseCase(usersRepository, classRepository)
  })

  it('should be able to get a room infos', async () => {
    const student = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'STUDENT',
    })

    const teacher = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'STUDENT',
    })

    const studentClass1 = await classRepository.create({
      teacher: { connect: { id: teacher.id } },
      capacity: 20,
      class_number: 201,
      isAvaiable: true,
    })

    const studentClass2 = await classRepository.create({
      teacher: { connect: { id: teacher.id } },
      capacity: 10,
      class_number: 402,
      isAvaiable: true,
    })

    await classRepository.insertStudent(
      studentClass1.teacher_id,
      student.id,
      studentClass1.id,
    )

    await classRepository.insertStudent(
      studentClass2.teacher_id,
      student.id,
      studentClass2.id,
    )

    const { rooms } = await sut.execute({
      studentId: student.id,
    })

    expect(rooms).toHaveLength(2)
  })
})
