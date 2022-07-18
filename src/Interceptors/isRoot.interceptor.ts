import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class IsRootInterceptor implements NestInterceptor{

    constructor(private readonly configService:ConfigService){}

    async intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        const {superadminusername} = request.session || {}
        //console.log(superadminusername, "USERADMIN USERNAME")
        if(superadminusername) {
            const username = this.configService.get("SUPER_ADMIN_USERNAME");
            request.superadminusername = username; 
        }
        //console.log(request.superadminusername, "REQ")
        return next.handle()
    }

}