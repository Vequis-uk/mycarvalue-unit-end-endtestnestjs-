import { AfterInsert, AfterRemove, AfterUpdate, Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  LogInsert() {
    console.log('Inserted User With ID:', this.id);    
  }
  @AfterUpdate()
  LogUpdate() {
    console.log('Updated User With ID:', this.id);    
  }
  @AfterRemove()
  LogRemove() {
    console.log('Deleted User With ID:', this.id);    
  }
}
