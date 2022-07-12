import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UserService } from "src/Services/user.service";


@Injectable()
export class IsUserInterceptor implements NestInterceptor{

    constructor(private readonly userService:UserService){}

    async intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        const {userId} = request.session || {}
        console.log(userId, "USER IDD")
        if(userId) {
            const user = await this.userService.findUserById(userId);
            request.user = user; 
        }
        return next.handle()
    }

}