import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { AdminService } from "src/Services/admin.service";


@Injectable()
export class IsAdminInterceptor implements NestInterceptor{

    constructor(private readonly adminService:AdminService){}

    async intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        console.log(request.session, "SESSION")
        const {adminId} = request.session || {}
        console.log(adminId)
        if(adminId) {
            const admin = await this.adminService.findAdminById(adminId);
            request.admin = admin; 
        }
        return next.handle()
    }

}