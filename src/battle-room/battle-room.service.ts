import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Like } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomCreateDto } from './dto/room-create.dto';
import { UserData } from 'src/interfaces/user-data.interface';

@Injectable()
export class BattleRoomService {

    @InjectEntityManager()
    private manager:EntityManager

    // /battle-room/room GET
    async roomList(pageNo:number,pageSize:number,name:string){
        const condition:Record<string,any> = {}
        if(name) condition.name = Like(`%${name}%`)
        condition.is_public = true
        const slipCount = (pageNo-1) * pageSize
        const [data,totalCount] = await this.manager.findAndCount(Room,{
            skip:slipCount,
            take:pageSize,
            where:condition
        })
        return {
            data,totalCount
        }
    }

    // /battle-room/room POST
    async roomCreate(userInfo:UserData,data:RoomCreateDto){
        const roomName = await this.manager.findOne(Room,{
            where:{name:data.name}
        })
        if(roomName) throw new HttpException('房间名已被占用',HttpStatus.BAD_REQUEST)
        const addRoom = new Room()
        addRoom.name = data.name
        addRoom.is_public = JSON.parse(data.is_public.toString())
        addRoom.describe = data.describe || '暂无简介'
        addRoom.password = data.password
        addRoom.users = JSON.stringify([userInfo])
        
        try{
            await this.manager.transaction( async manager=>{
                await manager.save(addRoom)
            })
            return '创建成功'
        }catch(e){
            return '创建失败'
        }
    }

    // /battle-room/player GET
    async enterRoom(userInfo:UserData,id:number){
        const room = await this.manager.findOne(Room,{
            where:{id}
        })
        if(room.users) JSON.parse(room.users).map(item=>{
            if(item.userId == userInfo.userId)throw new HttpException('您已在房间中',HttpStatus.BAD_REQUEST) 
        })
    
        if(!room.users || JSON.parse(room.users).length <= 0) room.users = JSON.stringify([userInfo])
        else if(JSON.parse(room.users).length >=2) throw new HttpException('房间已满',HttpStatus.BAD_REQUEST)
        else room.users = JSON.stringify([...JSON.parse(room.users),userInfo])
        try{
            await this.manager.transaction(async manager=>{
                manager.save(room)
            })
            return '加入成功'
        }catch(e){
            return '加入失败'
        }
    }

    // /battle-room/player Delete
    async leaveRoom(userId:number,roomId:number){
        const room = await this.manager.findOne(Room,{
            where:{id:roomId}
        })
        let newUsers = [];
        if(!JSON.parse(room.users).length)throw new HttpException('无人房间',HttpStatus.BAD_REQUEST)
        JSON.parse(room.users).forEach(element => {
           if(element.userId && element.userId != userId) newUsers = [...newUsers,element]
        })
        if(!newUsers.length)return await this.roomDelete(userId,roomId)
        room.users = JSON.stringify(newUsers)
        try{
            this.manager.transaction(async manager=>{
                await manager.save(room)
            })
            return '退出成功'
        }catch(e){
        return '出错了'
        }
    }
    
    // /battle-room/room DELETE
    async roomDelete(userId:number,roomId:number){
        const room = await this.manager.findOne(Room,{
            where:{id:roomId}
        })
        if(userId != JSON.parse(room.users)[0].userId)throw new HttpException('只有房主才能解散房间',HttpStatus.BAD_REQUEST)

        try{ await this.manager.transaction( async manager=>{
            await manager.delete(Room,roomId)
        })
            return '解散成功'
        }catch(e){
            return '操作失败'
        }
    }

}
