import React, { createContext, useState, useCallback } from 'react';

type SandpackFiles = {
  [key: string]: string | { code: string };
};

type SandpackContextType = {
  files: SandpackFiles;
  updateSandpackFiles: (newFiles: SandpackFiles) => void;
  addNewComponent: (componentName: string, componentSelector: string, exampleUsage: string, files: SandpackFiles) => void;
};

export const SandpackContext = createContext<SandpackContextType>({
  files: {},
  updateSandpackFiles: () => {},
  addNewComponent: () => {},
});

export const SandpackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<SandpackFiles>({});

  const updateSandpackFiles = useCallback((newFiles: SandpackFiles) => {
    setFiles(prevFiles => ({ ...prevFiles, ...newFiles }));
  }, []);

  const addNewComponent = useCallback((componentName: string, componentSelector: string, exampleUsage: string, newComponentFiles: SandpackFiles) => {
    setFiles(prevFiles => {
      const updatedFiles = { ...prevFiles, ...newComponentFiles };

      // Update app.component.html
      const appHtml = updatedFiles['/src/app/app.component.html'] || '';
      const newHtmlContent = typeof appHtml === 'string' ? appHtml : appHtml.code;
      updatedFiles['/src/app/app.component.html'] = `${newHtmlContent}\n${exampleUsage}`;

      // Update app.component.ts
      const kebabCaseName = componentName.replace(/Component$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const appTs = updatedFiles['/src/app/app.component.ts'] || '';
      const appTsContent = typeof appTs === 'string' ? appTs : appTs.code;
      const importStatement = `import { ${componentName} } from './${kebabCaseName}/${kebabCaseName}.component';`;
      
      // Split the file content into lines
      const lines = appTsContent.split('\n');
      
      // Find the index of the @Component decorator
      const componentIndex = lines.findIndex(line => line.trim().startsWith('@Component'));
      
      // Insert the new import statement at the beginning of the file
      lines.unshift(importStatement);
      
      // Replace the imports line with the updated one
      if (componentIndex !== -1) {
        const importsLineIndex = lines.findIndex((line, index) => 
          index > componentIndex && line.includes('imports:')
        );
        if (importsLineIndex !== -1) {
          lines[importsLineIndex] = lines[importsLineIndex].replace(
            /imports:\s*\[(.*?)\]/,
            `imports: [$1, ${componentName}]`
          );
        } else {
          // If no imports line found, add it
          lines.splice(componentIndex + 1, 0, `  imports: [CommonModule, FormsModule, ${componentName}],`);
        }
      }
      
      // Join the lines back into a single string
      updatedFiles['/src/app/app.component.ts'] = lines.join('\n');

      return updatedFiles;
    });
  }, []);

  return (
    <SandpackContext.Provider value={{ files, updateSandpackFiles, addNewComponent }}>
      {children}
    </SandpackContext.Provider>
  );
};
