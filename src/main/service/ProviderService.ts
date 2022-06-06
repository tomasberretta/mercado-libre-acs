import {Provider} from '@prisma/client';

export default class ProviderService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    addProvider = async(name: String):Promise<Provider>=>{
        return await this.prisma.provider.create({
            data:{
                name: name
            }
        });
    }

}