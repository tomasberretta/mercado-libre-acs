import {PrismaClient, Provider} from "@prisma/client";
import ProviderService from "../../main/service/ProviderService";

const prisma = new PrismaClient();
const providerService = new ProviderService(prisma);

describe("Test Add Provider", () => {

    it("should return provider", async () => {
        const name = "Pepe"
        const provider : Provider = await providerService.addProvider(name);
        expect(provider).toBeDefined();
        // @ts-ignore
        expect(provider.name).toBe(name);
    });

});