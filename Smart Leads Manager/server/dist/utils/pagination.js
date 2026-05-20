"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = void 0;
const buildPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        totalDocs: total,
        limit,
        totalPages,
        page,
        pagingCounter: (page - 1) * limit + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
    };
};
exports.buildPaginationMeta = buildPaginationMeta;
