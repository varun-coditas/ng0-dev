import React, { createContext, useState, useCallback } from 'react';

type SandpackFiles = {
  [key: string]: string;
};

type SandpackContextType = {
  files: SandpackFiles;
  updateSandpackFiles: (newFiles: SandpackFiles) => void;
};

export const SandpackContext = createContext<SandpackContextType>({
  files: {},
  updateSandpackFiles: () => {},
});

export const SandpackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<SandpackFiles>({});

  const updateSandpackFiles = useCallback((newFiles: SandpackFiles) => {
    setFiles(prevFiles => ({ ...prevFiles, ...newFiles }));
  }, []);

  return (
    <SandpackContext.Provider value={{ files, updateSandpackFiles }}>
      {children}
    </SandpackContext.Provider>
  );
};
