// src/utils/auth.js
export function isAuthenticated() {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')
    
    if (!user || !token) {
        return false
    }
    
    try {
        const userData = JSON.parse(user)
        // Check if user has admin role
        if (userData.role !== 'admin') {
            logout() // Clear invalid user data
            return false
        }
        
        // Basic token expiry check (optional - JWT verification would be better)
        return true
    } catch (error) {
        logout() // Clear corrupted user data
        return false
    }
}

export function getToken() {
    return localStorage.getItem('accessToken')
}

export function getUser() {
    try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    } catch (error) {
        return null
    }
}

export function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}
