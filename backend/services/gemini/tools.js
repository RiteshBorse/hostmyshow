export const geminiTools = [
    {
      functionDeclarations: [
        {
          name: "getRecommendedEvents",
          description: "Fetch recommended events based on date and/or time. Returns up to 5 upcoming events.",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "Date in YYYY-MM-DD format", nullable: true },
              time: { type: "string", description: "Time in HH:mm format", nullable: true }
            },
            required: []
          }
        },
        {
          name: "getTodaysEvents",
          description: "Get all events happening today.",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "getEventsByLocation",
          description: "Find events happening at a specific location or city.",
          parameters: {
            type: "object",
            properties: {
              location: { type: "string", description: "City or place name" }
            },
            required: ["location"]
          }
        },
        {
          name: "getEventsByTitle",
          description: "Find events by their title or part of the title.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Event title or keyword" }
            },
            required: ["title"]
          }
        },
        {
          name: "getEventsByDescription",
          description: "Find events by keywords in their description.",
          parameters: {
            type: "object",
            properties: {
              keyword: { type: "string", description: "A keyword in event description" }
            },
            required: ["keyword"]
          }
        }
      ]
    }
  ];
  