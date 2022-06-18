import ProviderService from "../../main/service/ProviderService";
import { MockContext, Context, createMockContext } from '../../resources/Context';

const providerService = new ProviderService();

let mockContext: MockContext
let context: Context

beforeEach(() => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context
})

describe("Test Add Provider", () => {

    it("should return provider", async () => {
        const name = "ChairsAndTables"
        const provider = {
            id: 1,
            name: name,
            email: null,
            phone: null,
        }

        mockContext.prisma.provider.create.mockResolvedValue(provider)

        await expect(providerService.addProvider(provider.name, context)).resolves.toEqual(provider)

        expect(provider).toBeDefined();
        expect(provider.name).toBe(name);
    });

});