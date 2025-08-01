import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConnectionContextType {
    sourceNodeId: string | null;
    setSourceNodeId: (nodeId: string | null) => void;
    isConnectionStarted: boolean;
    setIsConnectionStarted: (started: boolean) => void;
    resetConnection: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnectionContext = () => {
    const context = useContext(ConnectionContext);
    if (context === undefined) {
        throw new Error('useConnectionContext must be used within a ConnectionProvider');
    }
    return context;
};

interface ConnectionProviderProps {
    children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
    const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
    const [isConnectionStarted, setIsConnectionStarted] = useState(false);

    const resetConnection = () => {
        setSourceNodeId(null);
        setIsConnectionStarted(false);
    };

    const value: ConnectionContextType = {
        sourceNodeId,
        setSourceNodeId,
        isConnectionStarted,
        setIsConnectionStarted,
        resetConnection,
    };

    return (
        <ConnectionContext.Provider value={value}>
            {children}
        </ConnectionContext.Provider>
    );
}; 