import axios from "axios";

const http = axios.create({ baseURL: 'http://localhost:3000' });
const API_URL = "http://localhost:4000/fsm/machine";
const STATE_URL = "http://localhost:4000/fsm/state"; 

// Find user by credentials
export async function findUserByCreds(email, password) {
  const { data } = await http.get('/users', { params: { email, password } });
  return data?.[0] ?? null;
}

// FSM API
export const fsmApi = {
  // Send a state transition
  async sendTransition(key, transition, data = {}) {
    try {
      const response = await axios.post(API_URL, {
        key,
        transition,
        data
      });
      return response.data;
    } catch (error) {
      console.error("Error in FSM transition:", error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch current FSM state (NEW)
  async getCurrentState() {
    try {
      const response = await axios.get(STATE_URL);
      return response.data; // { state: 'ADMIN' } etc.
    } catch (error) {
      console.error("Error fetching FSM state:", error.response?.data || error.message);
      throw error;
    }
  }
};
