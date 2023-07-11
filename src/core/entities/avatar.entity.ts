import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'avatars' })
export class Avatar {
  @ObjectIdColumn()
  _id: string;

  @Column({
    type: 'number',
    unique: true,
  })
  userId: number;

  @Column({
    type: 'string',
  })
  hash: string;
}
