import prisma from '../prismaClient';

// Comprehensive audit logging interface for our MCA e-consultation system
export interface AuditLogEntry {
    action: string;
    category: 'AUTH' | 'SECURITY' | 'CONFIG' | 'NCO' | 'USER_ACTION';
    entityId?: string;
    entityType?: string;
    userId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    errorMessage?: string;
}

// Core audit logging function that stores in database
const createAuditLog = async (entry: AuditLogEntry): Promise<void> => {
    try {
        await prisma.auditLog.create({
            data: {
                action: entry.action,
                category: entry.category,
                userId: entry.userId || null,
                entityType: entry.entityType || null,
                entityId: entry.entityId || null,
                details: entry.details ? JSON.parse(JSON.stringify(entry.details)) : null,
                ipAddress: entry.ipAddress || null,
                userAgent: entry.userAgent || null,
                success: entry.success ?? true,
                errorMessage: entry.errorMessage || null
            }
        });

        // Also log to console for immediate visibility during development
        console.log(`[${entry.category}] ${entry.action}`, {
            userId: entry.userId,
            entityType: entry.entityType,
            entityId: entry.entityId,
            success: entry.success,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Fallback to console logging if database fails
        console.error('Database audit logging failed, falling back to console:', error);
        console.log(`[${entry.category}] ${entry.action}`, {
            userId: entry.userId,
            details: entry.details,
            ipAddress: entry.ipAddress,
            timestamp: new Date().toISOString()
        });
    }
};

// Log user authentication activities
export const logAuth = async (
    action: 'LOGIN_SUCCESS' | 'LOGOUT' | 'LOGIN_FAILED' | 'REGISTRATION_SUCCESS' | 'REGISTRATION_FAILED',
    userId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
) => {
    await createAuditLog({
        action,
        category: 'AUTH',
        userId,
        details,
        ipAddress,
        userAgent,
        success: !action.includes('FAILED')
    });
};

// Log security-related events
export const logSecurityEvent = async (
    event: string,
    userId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true
) => {
    await createAuditLog({
        action: event,
        category: 'SECURITY',
        userId,
        details,
        ipAddress,
        userAgent,
        success
    });
};

// Log user actions on posts and comments
export const logUserAction = async (
    action: string,
    userId: string,
    entityType: 'POST' | 'COMMENT' | 'USER' | 'COMPANY' | 'BUSINESS_CATEGORY',
    entityId: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
) => {
    await createAuditLog({
        action,
        category: 'USER_ACTION',
        userId,
        entityType,
        entityId,
        details,
        ipAddress,
        userAgent
    });
};

// Log configuration actions (admin activities)
export const logConfigAction = async (
    action: string,
    userId: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
) => {
    await createAuditLog({
        action,
        category: 'CONFIG',
        userId,
        details,
        ipAddress,
        userAgent
    });
};

// Log NCO (National Company Office) related actions
export const logNCOAction = async (
    action: string,
    userId: string,
    entityType?: string,
    entityId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
) => {
    await createAuditLog({
        action,
        category: 'NCO',
        userId,
        entityType,
        entityId,
        details,
        ipAddress,
        userAgent
    });
};

// Utility function to get audit logs with filtering and pagination
export const getAuditLogs = async (
    options: {
        category?: string;
        action?: string;
        userId?: string;
        entityType?: string;
        startDate?: Date;
        endDate?: Date;
        success?: boolean;
        limit?: number;
        offset?: number;
    } = {}
) => {
    const {
        category,
        action,
        userId,
        entityType,
        startDate,
        endDate,
        success,
        limit = 100,
        offset = 0
    } = options;

    const whereClause: any = {};
    
    if (category) whereClause.category = category;
    if (action) whereClause.action = action;
    if (userId) whereClause.userId = userId;
    if (entityType) whereClause.entityType = entityType;
    if (success !== undefined) whereClause.success = success;
    
    if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
    }

    try {
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            }),
            prisma.auditLog.count({ where: whereClause })
        ]);

        return { logs, total };
    } catch (error) {
        console.error('Failed to retrieve audit logs:', error);
        throw error;
    }
};
