const files = {
    "/src/app/app.component.css": {
        code: ":host{padding: 20px;}",
    },
    "/src/app/app.component.html": {
      code: "",
    },
    "/src/app/app.component.ts": {
      code: `import { Component } from "@angular/core";
    import { CommonModule } from "@angular/common";
    import { FormsModule } from "@angular/forms";
    
    @Component({
      selector: "app-root",
      standalone: true,
      templateUrl: "./app.component.html",
      styleUrls: ["./app.component.css"],
      imports: [CommonModule, FormsModule],
    })
    export class AppComponent {
      
    }
    
    
    `,
    },
    "/src/index.html": {
      code: `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Standalone Angular</title>
      <base href="/">
          
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/x-icon" href="favicon.ico">
      
    </head>
    <body>
       <app-root></app-root>
    </body>
    </html>
    `,
    },
    "/src/main.ts": {
      code: `import "@angular/compiler";
          import { bootstrapApplication } from '@angular/platform-browser';
    import { AppComponent } from './app/app.component';
    
    bootstrapApplication(AppComponent)
      .catch(err => console.log(err));
    
    const tailwindCDN = document.createElement('script');
    tailwindCDN.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindCDN);


    `,
    },
    "/src/polyfills.ts": {
      code: `import "zone.js"; // Required for Angular      
    `,
    },
    "/package.json": {
      code: JSON.stringify(
        {
          dependencies: {
            "@angular/animations": "^18.2.0",
            "@angular/common": "^18.2.0",
            "@angular/compiler": "^18.2.0",
            "@angular/core": "^18.2.0",
            "@angular/forms": "^18.2.0",
            "@angular/platform-browser": "^18.2.0",
            "@angular/platform-browser-dynamic": "^18.2.0",
            "zone.js": "~0.14.10",
            rxjs: "^7.5.0",
          },
          main: "/src/main.ts",
        },
        null,
        2
      ),
    },
  };

export default files;