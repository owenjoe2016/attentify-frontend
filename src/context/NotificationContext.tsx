// components/NotificationContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type Notification = {
  type: "success" | "error" | "info";
  message: string;
};

type NotificationContextType = {
  notify: (type: Notification["type"], message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("NotificationProvider is missing");
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = (type: Notification["type"], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000); // auto-hide after 3s
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-2  shadow-lg text-white z-50 transition-opacity duration-300 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
