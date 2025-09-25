import { 
  systemHealthCheck,
  commentFetchScheduler,
  processRawComments
} from "./functions/on-comment-flow";

// Export functions for the serve handler
export const functions = [
  systemHealthCheck,
  commentFetchScheduler,
  processRawComments
];