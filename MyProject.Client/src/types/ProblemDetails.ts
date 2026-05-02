export interface ProblemDetails {
  title: string;
  status?: number;
  errors?: Record<string, string[]>; // E.g {"Title:["to shurt", "required"]"}
}
