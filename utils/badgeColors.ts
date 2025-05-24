export const getBadgeColor = (tech: string) => {
  switch (tech.toLowerCase()) {
    case "python":
    case "jupyter":
      return "blue";
    case "typescript":
    case "javascript":
      return "cyan";
    case "java":
      return "green";
    case "leadership":
    case "ai":
    case "machine learning":
      return "grape";
    case "robotics":
    case "engineering":
      return "red";
    case "cad":
    case "3d printing":
      return "indigo";
    case "computer vision":
    case "data science":
    case "data analysis":
      return "teal";
    case "web scraping":
    case "web development":
    case "htmx":
      return "pink";
    case "electronics":
    case "firmware":
      return "yellow";
    case "sql":
    case "postgres":
    case "sqlite":
    case "project management":
      return "orange";
    case "go":
      return "violet";
    case "php":
      return "indigo";
    case "teaching":
      return "lime";
    default:
      return "gray";
  }
}; 