import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { asyncHandler } from '../utility/asyncHandler';
import ApiResponse from '../utility/ApiResponse';
import { ApiError } from '../utility/ApiError';

// Health Check - Verify system status
export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        
        // Get basic system stats
        const [
            userCount,
            postCount,
            commentCount,
            companyCount
        ] = await Promise.all([
            prisma.user.count(),
            prisma.post.count(),
            prisma.comment.count(),
            prisma.company.count()
        ]);

        const systemInfo = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                stats: {
                    users: userCount,
                    posts: postCount,
                    comments: commentCount,
                    companies: companyCount
                }
            },
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0'
        };

        return res.status(200).json(
            new ApiResponse(200, systemInfo, "System is healthy")
        );

    } catch (error) {
        throw new ApiError(503, `System health check failed: ${error}`);
    }
});

// Get System Statistics
export const getSystemStats = asyncHandler(async (req: Request, res: Response) => {
    try {
        const stats = {
            content: {
                totalPosts: await prisma.post.count(),
                activePosts: await prisma.post.count({ where: { status: 'ACTIVE' } }),
                totalComments: await prisma.comment.count(),
                processedComments: await prisma.comment.count({ where: { status: 'ANALYZED' } })
            },
            users: {
                total: await prisma.user.count(),
                byRole: await prisma.user.groupBy({
                    by: ['role'],
                    _count: { id: true }
                })
            },
            processing: {
                queueSize: await prisma.processingQueue.count(),
                pending: await prisma.processingQueue.count({ where: { status: 'PENDING' } }),
                processing: await prisma.processingQueue.count({ where: { status: 'PROCESSING' } }),
                failed: await prisma.processingQueue.count({ where: { status: 'FAILED' } })
            }
        };

        return res.status(200).json(
            new ApiResponse(200, stats, "System statistics retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, `Failed to retrieve system statistics: ${error}`);
    }
});

// Get Public Configuration
export const getPublicConfig = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Return public configuration that frontend can use
        const config = {
            features: {
                aiProcessing: true,
                realTimeUpdates: true,
                multiLanguageSupport: true
            },
            limits: {
                maxCommentLength: 5000,
                maxCommentsPerPost: 1000,
                supportedLanguages: ['ENGLISH', 'HINDI', 'BILINGUAL']
            },
            ui: {
                defaultLanguage: 'ENGLISH',
                theme: 'light',
                itemsPerPage: 20
            }
        };

        return res.status(200).json(
            new ApiResponse(200, config, "Public configuration retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, `Failed to retrieve public configuration: ${error}`);
    }
});

// Search Suggestions
export const getSearchSuggestions = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { query, type = 'all', limit = 10 } = req.query;

        if (!query || typeof query !== 'string') {
            throw new ApiError(400, "Search query is required");
        }

        const suggestions: any[] = [];

        // Search in posts
        if (type === 'all' || type === 'posts') {
            const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { issuedBy: { contains: query, mode: 'insensitive' } }
                    ],
                    status: 'ACTIVE'
                },
                select: {
                    id: true,
                    title: true,
                    postType: true,
                    issuedBy: true
                },
                take: Math.floor(parseInt(limit as string) / 2)
            });

            suggestions.push(...posts.map(post => ({
                type: 'post',
                id: post.id,
                title: post.title,
                subtitle: `${post.postType} by ${post.issuedBy}`
            })));
        }

        // Search in companies
        if (type === 'all' || type === 'companies') {
            const companies = await prisma.company.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' }
                },
                select: {
                    id: true,
                    name: true,
                    state: true,
                    businessCategory: {
                        select: {
                            name: true
                        }
                    }
                },
                take: Math.floor(parseInt(limit as string) / 2)
            });

            suggestions.push(...companies.map(company => ({
                type: 'company',
                id: company.id,
                title: company.name,
                subtitle: `${company.businessCategory.name}${company.state ? ` - ${company.state}` : ''}`
            })));
        }

        return res.status(200).json(
            new ApiResponse(200, suggestions.slice(0, parseInt(limit as string)), "Search suggestions retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, `Failed to retrieve search suggestions: ${error}`);
    }
});

// Get Popular Keywords from Comments
export const getPopularKeywords = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { postId, limit = 20, period = '30' } = req.query;
        
        const periodDays = parseInt(period as string);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);

        const whereClause: any = {
            createdAt: { gte: startDate },
            keywords: { not: { equals: [] } }
        };

        if (postId) {
            whereClause.postId = postId;
        }

        const comments = await prisma.comment.findMany({
            where: whereClause,
            select: {
                keywords: true
            }
        });

        // Flatten and count keywords
        const keywordCounts: Record<string, number> = {};
        comments.forEach(comment => {
            comment.keywords.forEach(keyword => {
                keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            });
        });

        // Sort by frequency and return top keywords
        const popularKeywords = Object.entries(keywordCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, parseInt(limit as string))
            .map(([keyword, count]) => ({
                keyword,
                count,
                percentage: Math.round((count / comments.length) * 100)
            }));

        return res.status(200).json(
            new ApiResponse(200, popularKeywords, "Popular keywords retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, `Failed to retrieve popular keywords: ${error}`);
    }
});

// Validate Company Information
export const validateCompany = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { name, uniNumber } = req.query;

        if (!name && !uniNumber) {
            throw new ApiError(400, "Company name or UNI Number is required");
        }

        const whereClause: any = {};
        if (uniNumber) {
            whereClause.uniNumber = uniNumber;
        } else if (name) {
            whereClause.name = { equals: name, mode: 'insensitive' };
        }

        const company = await prisma.company.findFirst({
            where: whereClause,
            select: {
                id: true,
                name: true,
                uniNumber: true,
                state: true,
                businessCategory: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!company) {
            return res.status(200).json(
                new ApiResponse(200, { 
                    exists: false, 
                    company: null 
                }, "Company not found in database")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, {
                exists: true,
                company
            }, "Company information retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, `Failed to validate company: ${error}`);
    }
});

// Get Business Categories with Weightage
export const getBusinessCategories = asyncHandler(async (req: Request, res: Response) => {
    try {
        const categories = await prisma.businessCategory.findMany({
            orderBy: { weightageScore: 'desc' }
        });

        // Group categories by weight for better organization
        const categoriesByWeight = categories.reduce((acc: any, category: any) => {
            const weight = category.weightageScore.toString();
            if (!acc[weight]) {
                acc[weight] = [];
            }
            acc[weight].push(category);
            return acc;
        }, {});

        return res.status(200).json(
            new ApiResponse(200, {
                categories,
                categoriesByWeight
            }, "Business categories retrieved successfully")
        );

    } catch (error) {
        throw new ApiError(500, `Failed to retrieve business categories: ${error}`);
    }
});
