import {Provider} from '@prisma/client';
import {Context} from "../../resources/Context";

export default class ProviderService {

    addProvider = async(name: string, context: Context):Promise<Provider>=>{
        return await context.prisma.provider.create({
            data:{
                name: name
            }
        });
    }

    deleteProviders = async(context: Context) => {
        await context.prisma.provider.deleteMany({})
    }

}