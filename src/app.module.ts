import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/User.entity';
import { Role } from './user/entities/Role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import { IdentityGuard } from './guard/identity.guard';
import { BattleRoomModule } from './battle-room/battle-room.module';
import { Room } from './battle-room/entities/room.entity';
import { SocialModule } from './social/social.module';
import { Friend } from './social/entities/Friend.entity';
import { Log4jsModule } from '@nestx-log4js/core';
import { CommunicationModule } from './communication/communication.module';

@Module({
  imports: [
    // TypeORM
    TypeOrmModule.forRootAsync({
      useFactory(configService:ConfigService){
        return {
          type:'mysql',
          host:configService.get('mysql_server_host'),
          port:configService.get('mysql_server_port'),
          username:configService.get('mysql_server_username'),
          password:configService.get('mysql_server_password'),
          database:configService.get('mysql_server_database'),
          synchronize:true,
          logging:true,
          entities:[User, Role, Room, Friend],
          poolSize:10,
          connectorPackage:'mysql2',
          extra:{
            authPlugin:'sha256_password'
          }
        }
      },
      inject:[ConfigService]
    }),
    // JWT
    JwtModule.registerAsync({
      global:true,
      useFactory(configService:ConfigService){
        return {
          secret:configService.get('jwt_secret'),
          signOptions:{
            expiresIn:'30m' // 默认 30 分钟过期时间
          }
        }
      },
      inject:[ConfigService]
    }),

    // config
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'src/.env'
    }),
    // log4js
    Log4jsModule.forRoot(),
    //
    UserModule,
    RedisModule,
    EmailModule,
    BattleRoomModule,
    SocialModule,
    CommunicationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { // 登录守卫
      provide: APP_GUARD,
      useClass: LoginGuard
    },
    { // 权限认证
      provide: APP_GUARD,
      useClass: IdentityGuard
    }  
  
  ],
})
export class AppModule {}
