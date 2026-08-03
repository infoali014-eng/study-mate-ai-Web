import { Course } from "@/types/course.types";

export const seedCourses: Course[] = [
  {
    id: "compiler-engineering-parsers",
    slug: "compiler-engineering-parsers",
    title: "Compiler Engineering: Building a Recursive Descent Parser",
    description: "Learn the core mechanics of syntax analysis. This course guides you step-by-step through regular expressions, tokenization, grammar design, and the implementation of a recursive descent parser for algebraic expressions.",
    thumbnail: "/courses/compiler-engineering.png",
    lectures: [
      {
        id: "lexical-analysis",
        slug: "lexical-analysis",
        title: "1. Introduction to Lexical Analysis",
        description: "Understand how raw character files are converted into structured lists of tokens. We cover scanning algorithms, lexer rules, and state machines.",
        videoUrl: "https://www.youtube.com/watch?v=HxaD_mKXiW4",
        notes: {
          id: "n-lex",
          title: "Introduction to Lexing & Tokenization",
          pdfUrl: "/courses/notes/sample-notes.pdf",
          content: `## Lexical Analysis & Tokenization

Lexical analysis is the very first phase of a compiler. It reads the source code as a stream of characters and groups them into meaningful sequences called **Lexemes**, which are mapped to **Tokens**.

### Core Concepts

1. **Token**: An abstract category representing a structural unit (e.g., \`IDENTIFIER\`, \`NUMBER\`, \`PLUS\`, \`WHILE\`).
2. **Lexeme**: The actual text substring matching a token pattern (e.g., \`42\`, \`x\`, \`+\`, \`while\`).
3. **Pattern**: Rules describing the token structure, usually written using Regular Expressions (Regex).

### The Scanning Loop

A lexer loops through the input file, matches characters against defined rules, discards whitespace/comments, and emits token objects. Below is a simplified Scanner object in C#:

\`\`\`csharp
public enum TokenType {
    NUMBER,
    PLUS,
    MINUS,
    EOF
}

public class Token {
    public TokenType Type { get; }
    public string Value { get; }

    public Token(TokenType type, string value) {
        Type = type;
        Value = value;
    }
}
\`\`\``
        },
        quiz: {
          id: "q-lex",
          title: "Lexer Fundamentals Quiz",
          questions: [
            {
              id: "q-lex-1",
              question: "What is the primary role of a Lexical Analyzer (Lexer)?",
              options: [
                "To verify variable type compatibility",
                "To group source characters into structured tokens",
                "To build the Abstract Syntax Tree (AST)",
                "To output targeted assembler language instructions"
              ],
              correctOptionIndex: 1
            },
            {
              id: "q-lex-2",
              question: "Which of the following is considered a Lexeme?",
              options: [
                "The keyword string 'while' in the source file",
                "The binary execution block",
                "The register allocation table",
                "A compiler optimizer flag"
              ],
              correctOptionIndex: 0
            }
          ]
        },
        task: {
          id: "t-lex",
          title: "Implement a Basic Scanner Loop",
          description: "Write a simple lexical scanner in C# or pseudocode that takes an input string and outputs a list of tokens representing numbers and operations, while skipping whitespace.",
          instructions: "1. Create a scanner function: `List<Token> Scan(string source)`.\n2. Iterate through each character. If it is whitespace, skip it.\n3. If it is a digit, read all subsequent digits to form a `NUMBER` token.\n4. If it is '+' or '-', emit a `PLUS` or `MINUS` token.\n5. Handle the end of the file (EOF).\n6. Test with input '12 + 34 - 5' and ensure 5 tokens are returned."
        },
        resources: [
          {
            id: "res-lex-1",
            title: "Lexer Starter Template (GitHub Gist)",
            type: "code",
            url: "https://gist.github.com"
          }
        ]
      },
      {
        id: "recursive-descent",
        slug: "recursive-descent",
        title: "2. Recursive Descent Parser Implementation",
        description: "Translate context-free grammars directly into compiler execution code. We implement lookahead token checks and recursive parser methods.",
        videoUrl: "https://www.youtube.com/watch?v=HxaD_mKXiW4",
        notes: {
          id: "n-parse",
          title: "Recursive Descent Parsing",
          pdfUrl: "/courses/notes/sample-notes.pdf",
          content: `## Recursive Descent Parsing

Recursive descent is a top-down parsing technique where grammar rules are translated directly into nested programming functions. It is simple, intuitive, and widely used in production compilers.

### Parse Grammar Rules

Consider a simple math expression grammar:
\`\`\`text
Expression -> Term ((PLUS | MINUS) Term)*
Term       -> Factor ((MULTIPLY | DIVIDE) Factor)*
Factor     -> NUMBER | LPAREN Expression RPAREN
\`\`\`

### Parser Structure

Each production rule in the grammar corresponds to a function. The parser consumes tokens by looking at the current lookahead token and recursively calling corresponding helper methods:

\`\`\`csharp
public class Parser {
    private List<Token> tokens;
    private int current = 0;

    public Parser(List<Token> tokens) {
        this.tokens = tokens;
    }

    private Token Peek() => tokens[current];
    private Token Advance() => tokens[current++];

    public Expression ParseExpression() {
        Expression expr = ParseTerm();
        while (Match(TokenType.PLUS, TokenType.MINUS)) {
            Token op = Previous();
            Expression right = ParseTerm();
            expr = new BinaryExpression(expr, op, right);
        }
        return expr;
    }
}
\`\`\``
        },
        quiz: {
          id: "q-parse",
          title: "Parser Mechanics Quiz",
          questions: [
            {
              id: "q-parse-1",
              question: "Recursive descent parsing is an example of which parsing category?",
              options: [
                "Bottom-up parsing",
                "Top-down parsing",
                "LR(1) parser systems",
                "LALR compilation techniques"
              ],
              correctOptionIndex: 1
            },
            {
              id: "q-parse-2",
              question: "What does the parser do when the current token does not match any grammar rules?",
              options: [
                "Attempts to auto-complete the code",
                "Reports a syntax error and stops or attempts recovery",
                "Silently ignores the character",
                "Allocates a runtime heap reference"
              ],
              correctOptionIndex: 1
            }
          ]
        },
        task: {
          id: "t-parse",
          title: "Translate Grammar Rules to Functions",
          description: "Map parser grammar methods to function prototypes. Build parser code structures in your language of choice.",
          instructions: "1. Create methods: `ParseExpression()` and `ParseTerm()`.\n2. Write a `Match(params TokenType[] types)` helper to check and advance index.\n3. Make sure parsing is top-down (Expressions call Terms, which in turn parse Factors).\n4. Trace parsing on the tokens from '10 + 20' to verify syntax validity."
        },
        resources: [
          {
            id: "res-parse-1",
            title: "Parser AST Node Examples",
            type: "slides",
            url: "https://slideshare.net"
          }
        ]
      }
    ]
  }
];

// Helper function to dynamically calculate statistics
export function getCourseStats(course: Course) {
  const lectures = course.lectures.length;
  let notes = 0;
  let quizzes = 0;
  let tasks = 0;

  for (const lec of course.lectures) {
    if (lec.notes) notes++;
    if (lec.quiz) quizzes++;
    if (lec.task) tasks++;
  }

  return {
    lectures,
    notes,
    quizzes,
    tasks,
  };
}
