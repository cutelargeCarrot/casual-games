import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'battle_rooms'})
export class Room {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        length:50,
        unique:true,
        comment:'房间名称'
    })
    name:string

    @Column({
        length:100,
        comment:'用户'
    })
    users:string

    @Column({
        length:20,
        nullable:true,
        comment:'房间密码'
    })
    password:string
    @Column({
        comment:'房间是否公开',
        default:true,
        type: 'tinyint',
        width: 1 
    })
    is_public:boolean

    @Column({
        length:100,
        nullable:true,
        comment:'简介',
    })
    describe:string

    @CreateDateColumn()
    createTime:Date
}