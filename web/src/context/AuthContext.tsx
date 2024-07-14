import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  currentUser: unknown;
  updateUser: (user: unknown) => void;
}>({
  currentUser: null,
  updateUser: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") as string) || null
  );

  const updateUser = (user: unknown) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
