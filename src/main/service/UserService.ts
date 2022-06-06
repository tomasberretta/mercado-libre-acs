import {User} from '@prisma/client';

export default class UserService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    addUser = async(name: String):Promise<User>=>{
        return await this.prisma.user.create({
            data:{
                name: name
            }
        });
    }

}