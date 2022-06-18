import {User} from '@prisma/client';
import { Context } from '../../resources/Context';

interface CreateUser {
    name: string
}

export default class UserService {

    addUser = async(user: CreateUser, context: Context):Promise<User>=>{
        return await context.prisma.user.create({
            data: user
        });
    }

    deleteUsers= async (context: Context): Promise<any> => {
        return await context.prisma.user.deleteMany({})
    }

}