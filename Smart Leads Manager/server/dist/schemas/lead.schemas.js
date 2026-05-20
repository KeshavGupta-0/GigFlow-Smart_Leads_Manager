"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadQuerySchema = exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        status: zod_1.z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
        source: zod_1.z.enum(['Website', 'Instagram', 'Referral'])
    })
});
exports.updateLeadSchema = zod_1.z.object({
    body: exports.createLeadSchema.shape.body.partial()
});
exports.leadQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
        source: zod_1.z.enum(['Website', 'Instagram', 'Referral']).optional(),
        search: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['asc', 'desc']).default('desc'),
        page: zod_1.z.coerce.number().min(1).default(1),
        limit: zod_1.z.coerce.number().min(1).max(100).default(10)
    })
});
