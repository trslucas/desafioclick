import { InMemoryClassRepository } from '../repository/in-memory/in-memory-class-repository'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'

import { beforeEach, describe, expect, it } from 'vitest'
import { InsertUserInRoomUseCase } from './insert-student-room-use-case'
import { ExceededCapacityTypeError } from './errors/max-capacity-error'
import { UserAlreadyExistisError } from './errors/user-already-exists-error'
import { InvalidResourceError } from './errors/invalid-resource-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let classRepository: InMemoryClassRepository
let sut: InsertUserInRoomUseCase

describe('Insert User in Room Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    classRepository = new InMemoryClassRepository()
    sut = new InsertUserInRoomUseCase(usersRepository, classRepository)
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
    await sut.execute({
      studentId: student2.id,
      ownerId: classRoom.id,
    })
    const { room } = await sut.execute({
      studentId: student.id,
      ownerId: classRoom.id,
    })

    console.log(room)

    expect(room.id).toEqual(expect.any(String))
    expect(classRoom.owner_id).toEqual(teacher.id)
    expect(student.user_type).toEqual('STUDENT')
    expect(teacher.user_type).toEqual('TEACHER')
  })

  it('should be able to insert a student in two diferent rooms', async () => {
    const teacher1 = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    const teacher2 = await usersRepository.create({
      name: 'Raphael Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1432,
      user_type: 'TEACHER',
    })

    if (teacher1.user_type !== 'TEACHER') {
      throw new InvalidCredentialsError()
    }

    const student = await usersRepository.create({
      name: 'Raphael Oliveira',
      email: 'raphaeloliveira@outlook.com',
      birth_date: new Date('1994-08-04'),
      registration: 18434,
      user_type: 'STUDENT',
    })

    const classRoom1 = await classRepository.create({
      owner_id: teacher1.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    const classRoom2 = await classRepository.create({
      owner_id: teacher2.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    const room1 = await sut.execute({
      studentId: student.id,
      ownerId: classRoom1.id,
    })

    const room2 = await sut.execute({
      studentId: student.id,
      ownerId: classRoom2.id,
    })

    const insertedStudent1 = room1.room.students.some(
      (item) => item.userId === student.id,
    )

    const insertedStudent2 = room2.room.students.some(
      (item) => item.userId === student.id,
    )

    expect(insertedStudent1).toEqual(insertedStudent2)
  })

  it('should not be able to add a student to a room that was not created by the owner class teacher', async () => {
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

    const otherTeacher = await usersRepository.create({
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

    await expect(() =>
      sut.execute({
        studentId: student.id,
        ownerId: otherTeacher.id,
      }),
    ).rejects.toBeInstanceOf(InvalidResourceError)

    expect(classRoom.owner_id).not.toEqual(otherTeacher.id)
  })

  it('should not be able to insert a already exists student', async () => {
    const teacher = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    if (teacher.user_type !== 'TEACHER') {
      throw new Error()
    }

    const classRoom = await classRepository.create({
      owner_id: teacher.id,
      capacity: 20,
      class_number: 101,
      isAvaiable: true,
    })

    const student = await usersRepository.create({
      name: 'Raphael Oliveira',
      email: 'raphaeloliveira@outlook.com',
      birth_date: new Date('1994-08-04'),
      registration: 18434,
      user_type: 'STUDENT',
    })

    await sut.execute({
      studentId: student.id,
      ownerId: classRoom.id,
    })

    await expect(() =>
      sut.execute({
        studentId: student.id,
        ownerId: classRoom.id,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistisError)
  })

  it('should not be able to exceed room limit', async () => {
    const teacher = await usersRepository.create({
      name: 'Lucas Trindade',
      email: 'trslucas@outlook.com',
      birth_date: new Date('1993-10-20'),
      registration: 1,
      user_type: 'TEACHER',
    })

    if (teacher.user_type !== 'TEACHER') {
      throw new Error()
    }

    const classRoom = await classRepository.create({
      owner_id: teacher.id,
      capacity: 1,
      class_number: 101,
      isAvaiable: true,
    })

    const student = await usersRepository.create({
      name: 'Raphael Oliveira',
      email: 'raphaeloliveira@outlook.com',
      birth_date: new Date('1994-08-04'),
      registration: 18434,
      user_type: 'STUDENT',
    })

    const otherStudent = await usersRepository.create({
      name: 'Lucas Saes',
      email: 'sales@outlook.com',
      birth_date: new Date('1994-08-04'),
      registration: 18434,
      user_type: 'STUDENT',
    })

    await sut.execute({
      studentId: student.id,
      ownerId: classRoom.id,
    })

    await expect(() =>
      sut.execute({
        studentId: otherStudent.id,
        ownerId: classRoom.id,
      }),
    ).rejects.toBeInstanceOf(ExceededCapacityTypeError)
  })
})
