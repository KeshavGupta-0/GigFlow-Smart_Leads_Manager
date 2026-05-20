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
const leadsService = __importStar(require("../services/leads.service"));
const ApiResponse_1 = require("../utils/ApiResponse");
const getLeads = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        const result = await leadsService.getLeads(req.query, userId, role);
        res.status(200).json((0, ApiResponse_1.ApiResponse)(200, 'Leads fetched successfully', result));
    }
    catch (error) {
        next(error);
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        const lead = await leadsService.getLeadById(req.params.id, userId, role);
        res.status(200).json((0, ApiResponse_1.ApiResponse)(200, 'Lead fetched successfully', lead));
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadById = getLeadById;
const createLead = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const lead = await leadsService.createLead(req.body, userId);
        res.status(201).json((0, ApiResponse_1.ApiResponse)(201, 'Lead created successfully', lead));
    }
    catch (error) {
        next(error);
    }
};
exports.createLead = createLead;
const updateLead = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        const lead = await leadsService.updateLead(req.params.id, req.body, userId, role);
        res.status(200).json((0, ApiResponse_1.ApiResponse)(200, 'Lead updated successfully', lead));
    }
    catch (error) {
        next(error);
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        await leadsService.deleteLead(req.params.id, userId, role);
        res.status(200).json((0, ApiResponse_1.ApiResponse)(200, 'Lead deleted successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLead = deleteLead;
const exportLeads = async (req, res, next) => {
    try {
        const { userId, role } = req.user;
        const leads = await leadsService.exportLeads(req.query, userId, role);
        if (leads.length === 0) {
            res.status(404).json((0, ApiResponse_1.ApiResponse)(404, 'No leads found to export'));
            return;
        }
        const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
        const rows = leads.map(lead => [
            lead._id.toString(),
            `"${lead.name.replace(/"/g, '""')}"`,
            `"${lead.email.replace(/"/g, '""')}"`,
            lead.status,
            lead.source,
            lead.createdAt.toISOString()
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.status(200).send(csvContent);
    }
    catch (error) {
        next(error);
    }
};
exports.exportLeads = exportLeads;
