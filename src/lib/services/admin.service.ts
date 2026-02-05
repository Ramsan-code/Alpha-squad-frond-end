import { api, ApiResponse } from "@/lib/api/client";

export interface PendingUser {
    _id: string;
    userId: {
        _id: string;
        email: string;
    };
    firstName: string;
    lastName: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    // Student specific
    gradeLevel?: string;
    // Teacher specific
    specialization?: string;
    experience?: number;
}

export interface PendingApprovalsResponse {
    students: PendingUser[];
    teachers: PendingUser[];
    transactions: any[];
}

export const adminService = {
    /**
     * Get all pending approvals (students, teachers, transactions)
     */
    getPendingApprovals: async (): Promise<ApiResponse<PendingApprovalsResponse>> => {
        return api.get<ApiResponse<PendingApprovalsResponse>>('/admin/pending');
    },

    /**
     * Approve a student
     */
    approveStudent: async (id: string): Promise<ApiResponse<any>> => {
        return api.patch<ApiResponse<any>>(`/students/${id}/approve`, {});
    },

    /**
     * Reject a student
     */
    rejectStudent: async (id: string, reason: string): Promise<ApiResponse<any>> => {
        return api.patch<ApiResponse<any>>(`/students/${id}/reject`, { reason });
    },

    /**
     * Approve a teacher
     */
    approveTeacher: async (id: string): Promise<ApiResponse<any>> => {
        return api.patch<ApiResponse<any>>(`/teachers/${id}/approve`, {});
    },

    /**
     * Reject a teacher
     */
    rejectTeacher: async (id: string, reason: string): Promise<ApiResponse<any>> => {
        return api.patch<ApiResponse<any>>(`/teachers/${id}/reject`, { reason });
    },
};
