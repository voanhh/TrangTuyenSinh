import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "varchar",
        length: 255
    })
    name: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
        nullable: false
    })
    email: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    password: string;

    @Column({
        type: "varchar",
        length: 20,
        nullable: false,
        default: "" 
    })
    phone: string;

    @Column({
        type: "varchar",
        length: 30,
        nullable: false,
        default: "user"
    })
    role: string;

}