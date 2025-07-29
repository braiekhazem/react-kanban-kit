export const mockData = (() => {
  // Helper to generate tasks
  const priorities = ["high", "medium", "low", "urgent"];
  const assignees = [
    "Sarah Chen",
    "Mike Johnson",
    "Alex Rodriguez",
    "Emily Davis",
    "David Wilson",
    "Lisa Thompson",
    "Tom Anderson",
    "Rachel Green",
    "Chris Lee",
    "Anna Kim",
    "John Smith",
    "Jane Doe",
    "Samuel Clark",
    "Olivia Brown",
    "Noah White",
    "Emma Harris",
    "Liam Martin",
    "Sophia Lewis",
    "Mason Walker",
    "Isabella Young",
    "James Hall",
    "Mia Allen",
    "Benjamin King",
    "Charlotte Wright",
    "Elijah Scott",
    "Amelia Green",
    "Lucas Adams",
    "Harper Nelson",
    "Henry Baker",
    "Evelyn Carter",
  ];
  const tagsList = [
    ["Design", "UI/UX"],
    ["Documentation", "API"],
    ["Backend", "Database"],
    ["Security", "Frontend"],
    ["Mobile", "CSS"],
    ["Payment", "Integration"],
    ["Email", "Automation"],
    ["SEO", "Marketing"],
    ["Testing", "QA"],
    ["DevOps", "CI/CD"],
  ];
  const descriptions = [
    "Create reusable UI components for the design system including buttons, forms, and navigation elements",
    "Document all REST API endpoints with examples and response schemas",
    "Optimize database queries and add proper indexing for better performance",
    "Implement secure user authentication with JWT tokens and password reset functionality",
    "Ensure all pages are fully responsive and work well on mobile devices",
    "Integrate Stripe payment system for subscription handling",
    "Set up automated email notifications for user actions and system events",
    "Optimize landing page for better conversion rates and SEO performance",
    "Write unit and integration tests for critical modules",
    "Automate deployment pipeline for faster releases",
  ];

  // Trello-specific data
  const labels = [
    { color: "#61bd4f", name: "Ready" },
    { color: "#f2d600", name: "In Progress" },
    { color: "#ff9f1a", name: "Review" },
    { color: "#eb5a46", name: "Bug" },
    { color: "#c377e0", name: "Feature" },
    { color: "#0079bf", name: "Documentation" },
    { color: "#00c2e0", name: "Testing" },
    { color: "#51e898", name: "Design" },
  ];

  const coverImages = [
    "https://trello.com/1/cards/64afb5cac95dc9620a6f9ad2/attachments/64b107c4336787ab01a88390/previews/64b107c5336787ab01a88683/download/tree-736885_1280_%282%29.jpg",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    null, // Some cards without covers
    null,
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
  ];

  // Generate 20 backlog tasks (task-1 to task-20)
  const backlogTasks = [];
  for (let i = 1; i <= 20; i++) {
    backlogTasks.push(`task-${i}`);
  }
  // Generate 20 done tasks (task-101 to task-120)
  const doneTasks = [];
  for (let i = 101; i <= 120; i++) {
    doneTasks.push(`task-${i}`);
  }

  // Build the main structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {
    root: {
      id: "root",
      title: "Root",
      children: ["col-1", "col-2", "col-3", "col-4"],
      totalChildrenCount: 4,
      totalItemsCount: 4,
      parentId: null,
    },
    "col-1": {
      id: "col-1",
      title: "Backlog",
      children: backlogTasks,
      totalChildrenCount: backlogTasks.length,
      totalItemsCount: backlogTasks.length,
      parentId: "root",
      content: {
        id: "col-1",
        name: "Backlog",
        color: "#8d8d8d",
        percentage: 0,
      },
    },
    "col-2": {
      id: "col-2",
      title: "In Progress",
      children: ["task-201", "task-202"],
      totalChildrenCount: 2,
      parentId: "root",
      totalItemsCount: 2,
      content: {
        id: "col-2",
        name: "In Progress",
        color: "#5a43d6",
        percentage: 60,
      },
    },
    "col-3": {
      id: "col-3",
      title: "Review",
      children: ["task-301"],
      totalChildrenCount: 1,
      totalItemsCount: 1,
      parentId: "root",
      content: {
        id: "col-3",
        name: "Review",
        color: "#9c2bad",
        percentage: 80,
      },
    },
    "col-4": {
      id: "col-4",
      title: "Done",
      children: doneTasks,
      totalChildrenCount: doneTasks.length,
      totalItemsCount: doneTasks.length,
      parentId: "root",
      content: {
        id: "col-4",
        name: "Done",
        color: "#299764",
        percentage: 100,
      },
    },
  };

  // Add backlog tasks (task-1 to task-20)
  for (let i = 1; i <= 20; i++) {
    data[`task-${i}`] = {
      id: `task-${i}`,
      title: `Backlog Task #${i}`,
      parentId: "col-1",
      children: [],
      totalChildrenCount: 0,
      totalItemsCount: 0,
      type: "card",
      content: {
        description: descriptions[i % descriptions.length],
        priority: priorities[i % priorities.length],
        assignee: assignees[i % assignees.length],
        dueDate: `2024-02-${(10 + i).toString().padStart(2, "0")}`,
        tags: tagsList[i % tagsList.length],
        comments: i % 6,
        attachments: i % 4,
        // Trello-specific fields
        labels:
          i % 3 === 0
            ? [labels[i % labels.length]]
            : i % 2 === 0
            ? [labels[i % labels.length], labels[(i + 1) % labels.length]]
            : [],
        coverImage: i % 4 === 0 ? coverImages[i % coverImages.length] : null,
        members: i % 3 === 0 ? [assignees[i % assignees.length]] : [],
        dueComplete: i % 8 === 0,
        checklist: i % 5 === 0 ? { completed: 2, total: 5 } : null,
      },
    };
  }

  // Add done tasks (task-101 to task-120)
  for (let i = 101; i <= 120; i++) {
    data[`task-${i}`] = {
      id: `task-${i}`,
      title: `Done Task #${i - 100}`,
      parentId: "col-4",
      children: [],
      totalChildrenCount: 0,
      type: "card",
      content: {
        description: descriptions[i % descriptions.length],
        priority: priorities[i % priorities.length],
        assignee: assignees[i % assignees.length],
        dueDate: `2024-01-${(i - 100 + 1).toString().padStart(2, "0")}`,
        tags: tagsList[i % tagsList.length],
        comments: (i - 100) % 6,
        attachments: (i - 100) % 4,
        // Trello-specific fields
        labels: (i - 100) % 3 === 0 ? [labels[i % labels.length]] : [],
        coverImage:
          (i - 100) % 5 === 0 ? coverImages[i % coverImages.length] : null,
        members: (i - 100) % 4 === 0 ? [assignees[i % assignees.length]] : [],
        dueComplete: (i - 100) % 6 === 0,
        checklist: (i - 100) % 4 === 0 ? { completed: 3, total: 4 } : null,
      },
    };
  }

  // Add a couple of tasks for In Progress and Review columns
  data["task-201"] = {
    id: "task-201",
    title: "User authentication flow",
    parentId: "col-2",
    children: [],
    totalChildrenCount: 0,
    type: "card",
    content: {
      description:
        "Implement secure user authentication with JWT tokens and password reset functionality",
      priority: "high",
      assignee: "Emily Davis",
      dueDate: "2024-02-12",
      tags: ["Security", "Frontend"],
      comments: 5,
      attachments: 3,
      labels: [
        { color: "#eb5a46", name: "Bug" },
        { color: "#c377e0", name: "Feature" },
      ],
      coverImage:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
      members: ["Emily Davis", "John Smith"],
      dueComplete: false,
      checklist: { completed: 3, total: 7 },
    },
  };
  data["task-202"] = {
    id: "task-202",
    title: "Mobile responsive design",
    parentId: "col-2",
    children: [],
    totalChildrenCount: 0,
    type: "card",
    content: {
      description:
        "Ensure all pages are fully responsive and work well on mobile devices",
      priority: "medium",
      assignee: "David Wilson",
      dueDate: "2024-02-18",
      tags: ["Mobile", "CSS"],
      comments: 2,
      attachments: 0,
      labels: [{ color: "#51e898", name: "Design" }],
      coverImage: null,
      members: ["David Wilson"],
      dueComplete: true,
      checklist: null,
    },
  };
  data["task-301"] = {
    id: "task-301",
    title: "Payment integration",
    parentId: "col-3",
    children: [],
    totalChildrenCount: 0,
    type: "card",
    content: {
      description: "Integrate Stripe payment system for subscription handling",
      priority: "high",
      assignee: "Lisa Thompson",
      dueDate: "2024-02-14",
      tags: ["Payment", "Integration"],
      comments: 4,
      attachments: 2,
      labels: [{ color: "#f2d600", name: "In Progress" }],
      coverImage:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      members: ["Lisa Thompson", "Mike Johnson", "Sarah Chen"],
      dueComplete: false,
      checklist: { completed: 1, total: 3 },
    },
  };

  return data;
})();
