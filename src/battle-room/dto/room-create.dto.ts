import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RoomCreateDto {
    @IsNotEmpty({message:'房间名称不能为空'})
    @ApiProperty()
    name:string
    @ApiProperty()
    users:string
    @ApiProperty()
    password:string
    @ApiProperty()
    describe:string
    @ApiProperty()
    is_public:boolean

}