import {PrismaClient, User} from "@prisma/client";
import UserService from "../../main/service/UserService";

const prisma = new PrismaClient();
const userService = new UserService(prisma);

describe("Test Add User", () => {

    it("should return user", async () => {
        const name = "Pepe"
        const user : User = await userService.addUser(name);
        expect(user).toBeDefined();
        // @ts-ignore
        expect(user.name).toBe(name);
    });

});