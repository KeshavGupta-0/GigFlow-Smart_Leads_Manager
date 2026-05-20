"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeads = exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getLeads = void 0;
const leadRepository = __importStar(require("../repositories/lead.repository"));
const ApiError_1 = require("../utils/ApiError");
const getLeads = async (query, userId, role) => {
    const { leads, total } = await leadRepository.findAll(query, userId, role);
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);
    return {
        docs: leads,
        totalDocs: total,
        limit,
        totalPages,
        page,
    };
};
exports.getLeads = getLeads;
const getLeadById = async (id, userId, role) => {
    const lead = await leadRepository.findById(id);
    if (!lead) {
        throw new ApiError_1.ApiError(404, 'Lead not found');
    }
    if (role !== 'admin' && lead.createdBy._id.toString() !== userId) {
        throw new ApiError_1.ApiError(403, 'Not authorized to access this lead');
    }
    return lead;
};
exports.getLeadById = getLeadById;
const createLead = async (data, userId) => {
    return leadRepository.create(data, userId);
};
exports.createLead = createLead;
const updateLead = async (id, data, userId, role) => {
    const lead = await leadRepository.findById(id);
    if (!lead) {
        throw new ApiError_1.ApiError(404, 'Lead not found');
    }
    if (role !== 'admin' && lead.createdBy._id.toString() !== userId) {
        throw new ApiError_1.ApiError(403, 'Not authorized to update this lead');
    }
    const updatedLead = await leadRepository.update(id, data);
    return updatedLead;
};
exports.updateLead = updateLead;
const deleteLead = async (id, userId, role) => {
    const lead = await leadRepository.findById(id);
    if (!lead) {
        throw new ApiError_1.ApiError(404, 'Lead not found');
    }
    if (role !== 'admin') {
        throw new ApiError_1.ApiError(403, 'Not authorized to delete leads');
    }
    await leadRepository.deleteById(id);
    return { success: true };
};
exports.deleteLead = deleteLead;
const exportLeads = async (query, userId, role) => {
    return leadRepository.findAllForExport(query, userId, role);
};
exports.exportLeads = exportLeads;
