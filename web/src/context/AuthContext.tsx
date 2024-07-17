import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  currentUser: unknown;
  currentToken: unknown;
  updateUser: (user: unknown) => void;
  updateToken: (token: unknown) => void;
}>({
  currentUser: null,
  currentToken: null,
  updateUser: () => {},
  updateToken: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") as string) || null
  );
  const [currentToken, setCurrentToken] = useState(
    JSON.parse(localStorage.getItem("token") as string) || null
  );

  const updateUser = (user: unknown) => {
    setCurrentUser(user);
  };

  const updateToken = (token: unknown) => {
    setCurrentToken(token);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("token", JSON.stringify(currentToken));
  }, [currentUser, currentToken]);

  return (
    <AuthContext.Provider
      value={{ currentUser, currentToken, updateUser, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
