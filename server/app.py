from flask import Flask, request, jsonify
from openai import OpenAI
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.route('/get-code', methods=['POST'])
def chat():
    message = request.json.get('message')
    print(message)
    # kill process
    # exit()
    if not message:
        return {"error": "No message provided"}, 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # You may need to update this to the latest available model
            messages=[
                {
                    "role": "system", 
                    "content": """
                    You are an AI assistant that generates Angular component code based on user requests. The code should be in a standalone Angular project. 
                    The code you give is going to be put in app.component.html, app.component.css, and app.component.ts. 
                    You can use bootstrap5.3.3 classes to style the component.
                    You will also need to provide the default imports for the component.
                    The code should be valid and working when copy and pasted into an Angular project.
                    This is the default code:
                    import { Component } from "@angular/core";
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
      helloWorld = "Hello world";
      showMessage = false;
      userInput = "";
    
      toggleMessage(): void {
        this.showMessage = !this.showMessage;
      }
    
      clearInput(): void {
        this.userInput = "";
      }
    }
                    """
                },
                {
                    "role": "user", 
                    "content": message
                }
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "component_schema",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "responseMessage": {
                            "type": "string",
                            "description": "A brief message describing the generated component"
                            },
                            "code": {
                                "type": "object",
                                "properties": {
                                    "html": {
                                        "type": "string",
                                        "description": "The component's HTML code"
                                    },
                                    "css": {
                                        "type": "string",
                                        "description": "The component's CSS code"
                                    },
                                    "ts": {
                                        "type": "string",
                                        "description": "The component's TypeScript code"
                                    }
                                },
                                "required": ["html", "css", "ts"]
                            }
                        },
                        "required": ["responseMessage", "code"]
                    }
                }
            }
        )

        content = response.choices[0].message.content
        # parse the content as json
        parsed_content = json.loads(content)
        return parsed_content

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5500)