const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:7007/api';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.accessToken = localStorage.getItem('authToken');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    const userData = { firstName, lastName, email, password };
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(token: string) {
    return this.request('/auth/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async verifyOAuthToken(token: string, provider: string) {
    return this.request('/auth/verify-oauth', {
      method: 'POST',
      body: JSON.stringify({ token, provider }),
    });
  }

  // Problems methods
  async getProblems(id: string) {
    return this.request(`/users/${id}/problems`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async createProblem(problemData: any, user: { id: string | undefined }) {
    return this.request(`/users/${user.id}/problems`, {
      method: 'POST',
      body: JSON.stringify(problemData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  // Learning Items methods
  async getLearningItems(id: string) {
    return this.request(`/users/${id}/learning-items`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async createLearningItem(learningData: any, user: { id: string | undefined }) {
    return this.request(`/users/${user.id}/learning-items`, {
      method: 'POST',
      body: JSON.stringify(learningData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async updateLearningItem(id: string, learningData: any) {
    return this.request(`/learning-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(learningData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    
  }

  async deleteLearningItem(id: string) {
    return this.request(`/learning-items/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  // Revision Items methods
  async getRevisionItems(id: string) {
    return this.request(`/users/${id}/revision-items`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async createRevisionItem(revisionData: any, user: { id: string | undefined }) {
    return this.request(`/users/${user.id}/revision-items`, {
      method: 'POST',
      body: JSON.stringify(revisionData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async completeRevisionItem(id: string) {
    return this.request(`/revision-items/${id}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  // Analytics methods
  async getAnalytics(userId: string, dateParams?: any) {
    let url = `/analytics?userId=${userId}`;

    if (dateParams) {
      if (dateParams.timeframe) {
        url += `&timeframe=${dateParams.timeframe}`;
      }
      if (dateParams.startDate) {
        url += `&startDate=${dateParams.startDate}`;
      }
      if (dateParams.endDate) {
        url += `&endDate=${dateParams.endDate}`;
      }
    }

    return this.request(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  // Roadmap methods
  async getRoadmaps(id: string) {
    return this.request(`/users/${id}/roadmaps`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async createRoadmap(roadmapData: any, user: { id: string | undefined }) {
    return this.request(`/users/${user.id}/roadmaps`, {
      method: 'POST',
      body: JSON.stringify(roadmapData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async getRoadmap(roadmapId: string) {
    return this.request(`/roadmaps/${roadmapId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async createTopic(topicData: any, roadmapId: string) {
    return this.request(`/roadmaps/${roadmapId}/topics`, {
      method: 'POST',
      body: JSON.stringify(topicData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async createSubtopic(subtopicData: any, topicId: string) {
    return this.request(`/topics/${topicId}/subtopics`, {
      method: 'POST',
      body: JSON.stringify(subtopicData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async completeTopic(topicId: string) {
    return this.request(`/topics/${topicId}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async uncompleteTopic(topicId: string) {
    return this.request(`/topics/${topicId}/uncomplete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  async completeSubtopic(subtopicId: string) {
    return this.request(`/subtopics/${subtopicId}/complete`, {
      method: 'PUT',
    });
  }

  async uncompleteSubtopic(subtopicId: string) {
    return this.request(`/subtopics/${subtopicId}/uncomplete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }

  // REMOVED: Nested subtopic creation - simplified to 2-level hierarchy only
}

export const apiClient = new ApiClient(API_BASE_URL);