import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import client from "./Client";

export type Context = {
    prisma: PrismaClient
}

export type MockContext = {
    prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
    return {
        prisma: mockDeep<PrismaClient>(),
    }
}

export const getContext = (): Context => {
    return {
        prisma: client,
    }
}
