import { InMemoryClassRepository } from '../repository/in-memory/in-memory-class-repository'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'

import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { GetStudentsByRoomUseCase } from './get-students-by-room-use-case'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: GetStudentsByRoomUseCase

describe('Get All Students By Room Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new GetStudentsByRoomUseCase(usersRepository, classRepository)
  })
  it('should be able to insert student in a room', async () => {
    const teacher = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    if (teacher.user_type !== 'TEACHER') {
      throw new InvalidCredentialsError()
    }

    const student = await usersRepository.create({
      name: 'Raphael Oliveira',
      email: 'raphaeloliveira@outlook.com',
      birth_date: new Date('1994-08-04'),
      registration: 18434,
      user_type: 'STUDENT',
    })

    const student2 = await usersRepository.create({
      name: 'Viado Oliveira',
      email: 'raphaeloliveira@outlook.com',
      birth_date: new Date('1994-08-04'),
      registration: 18434,
      user_type: 'STUDENT',
    })

    const classRoom = await classRepository.create({
      owner_id: teacher.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    await classRepository.insertStudent(classRoom.id, student.id)

    await classRepository.insertStudent(classRoom.id, student2.id)
    const { room } = await sut.execute({
      classId: classRoom.id,
      ownerId: classRoom.owner_id,
    })

    expect(room.students).toHaveLength(2)
    expect(room.students[0].userId).toEqual(student.id)
    expect(room.students[1].userId).toEqual(student2.id)
  })
})
