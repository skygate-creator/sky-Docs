'use client';

import { createContext, useContext, useState } from 'react';
import { Request } from '@/interface';

interface RequestsContextType {
  requests: Request[];
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>;
  markAsRead: (id: string) => void;
  addRequest: (request: Request) => void;
}

const RequestsContext = createContext<RequestsContextType | null>(null);

export const RequestsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [requests, setRequests] = useState<Request[]>([]);

  const markAsRead = (id: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, is_read: true } : request,
      ),
    );
  };

  const addRequest = (request: Request) => {
    setRequests((prev) => [request, ...prev]);
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        setRequests,
        markAsRead,
        addRequest,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);

  if (!context) {
    throw new Error('useRequests must be used inside RequestsProvider');
  }

  return context;
};
