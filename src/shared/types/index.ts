/**
 * Global type definitions
 * 
 * Note: Feature-specific types should be in their respective feature modules
 */

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface APIResponse<T> {
    data: T;
    message?: string;
    error?: string;
}
