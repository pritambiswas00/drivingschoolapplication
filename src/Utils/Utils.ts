import {  Injectable } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class UtilService {
    constructor(){}


    async hashPassword(password: string): Promise<string> {

        const salt = randomBytes(8).toString("hex");
        const hashPassword = (await scrypt(password, salt, 16)) as Buffer;
        return `${salt}.${hashPassword.toString("hex")}`
    }

    async comparePassword(password:string, hashedPassword:String): Promise<boolean> {
           const [salt, storedHash] = hashedPassword.split(".");
           const newHash = (await scrypt(password,salt, 16)) as Buffer
           if(newHash.toString("hex") !== storedHash)return false;
           return true;
    }

   convertToUnix (date: Date) {
      const unixDate = parseInt((date.getTime() / 1000).toFixed(0));
      return unixDate;
   }


}