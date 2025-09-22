import { commentWorkflow, postSummarization } from "./commentWorkflow";

// Export functions for the serve handler
export const functions = [
  commentWorkflow,
  postSummarization
];