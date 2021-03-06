
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";

@Entity()
export class user {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }

}