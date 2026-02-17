// API Base Configuration and HTTP Client

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || "http://localhost:3000/api") {
    this.baseURL = baseURL;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Get authorization token from session storage
   */
  private getAuthToken(): string | null {
    return sessionStorage.getItem("authToken");
  }

  /**
   * Get headers with auth token if available
   */
  private getHeaders(): Record<string, string> {
    const headers = { ...this.headers };
    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Handle API response
   */
  private handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      throw {
        message: `HTTP Error: ${response.statusText}`,
        status: response.status,
      };
    }
    return response.json();
  }

  /**
   * Handle API error
   */
  private handleError(error: any): never {
    console.error("API Error:", error);
    throw {
      message: error.message || "An unexpected error occurred",
      status: error.status,
      data: error.data,
    } as ApiError;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    sessionStorage.setItem("authToken", token);
  }

  /**
   * Clear authorization token
   */
  clearAuthToken(): void {
    sessionStorage.removeItem("authToken");
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse, ApiError };
