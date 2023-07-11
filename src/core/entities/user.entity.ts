import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  _id: number;

  @Column({
    type: 'number',
    unique: true,
  })
  id: number;

  @Column({
    type: 'string',
    unique: true,
  })
  email: string;

  @Column({
    type: 'string',
  })
  first_name: string;

  @Column({
    type: 'string',
  })
  last_name: string;

  @Column({
    type: 'string',
  })
  avatar: string;

  @Column({
    type: 'date',
  })
  createdAt: any;

  @Column({
    type: 'date',
  })
  updatedAt: any;
}
