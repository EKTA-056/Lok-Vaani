import { Inngest } from "inngest";

// Create Inngest client
export const inngest = new Inngest({ 
  id: "lokvaani-analysis",
  name: "LokVaani MCA21 Analysis",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

