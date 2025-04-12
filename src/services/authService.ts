tsx
interface User {
  username: string;
}

interface AuthService {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  getCurrentUser: () => User | null;
}

const authService: AuthService = {
  login: (username, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },
  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },
  getCurrentUser: () => {
    return null;
  },
};

export default authService;