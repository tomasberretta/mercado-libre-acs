import UserService from "../../main/service/UserService";
import { MockContext, Context, createMockContext } from '../../resources/Context';

const userService = new UserService();

let mockContext: MockContext
let context: Context

beforeEach(() => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context
})

describe("Test Add User", () => {


    it("should return user", async () => {
        const name = "Pepe"
        const user = {
            id: 1,
            name: name,
            email: null,
            phone: null,
        }

        mockContext.prisma.user.create.mockResolvedValue(user)

        await expect(userService.addUser(user, context)).resolves.toEqual({
            id: 1,
            name: name,
            email: null,
            phone: null,
        })

        expect(user).toBeDefined();
        expect(user.name).toBe(name);
    });

});