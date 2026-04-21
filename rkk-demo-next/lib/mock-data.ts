export const mockData = (() => {
  const priorities = ["high", "medium", "low", "urgent"];
  const assignees = [
    "Sarah Chen", "Mike Johnson", "Alex Rodriguez", "Emily Davis",
    "David Wilson", "Lisa Thompson", "Tom Anderson", "Rachel Green",
    "Chris Lee", "Anna Kim", "John Smith", "Jane Doe",
    "Samuel Clark", "Olivia Brown", "Noah White", "Emma Harris",
    "Liam Martin", "Sophia Lewis", "Mason Walker", "Isabella Young",
  ];
  const tagsList = [
    ["Design", "UI/UX"], ["Documentation", "API"], ["Backend", "Database"],
    ["Security", "Frontend"], ["Mobile", "CSS"], ["Payment", "Integration"],
    ["Email", "Automation"], ["SEO", "Marketing"], ["Testing", "QA"], ["DevOps", "CI/CD"],
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

  const labels = [
    { color: "#61bd4f", name: "Ready" }, { color: "#f2d600", name: "In Progress" },
    { color: "#ff9f1a", name: "Review" }, { color: "#eb5a46", name: "Bug" },
    { color: "#c377e0", name: "Feature" }, { color: "#0079bf", name: "Documentation" },
    { color: "#00c2e0", name: "Testing" }, { color: "#51e898", name: "Design" },
  ];

  const coverImages = [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    null, null,
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
  ];

  const backlogTasks = Array.from({ length: 20 }, (_, i) => `task-${i + 1}`);
  const doneTasks = Array.from({ length: 20 }, (_, i) => `task-${i + 101}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {
    root: {
      id: "root", title: "Root",
      children: ["col-1", "col-2", "col-3", "col-4"],
      totalChildrenCount: 4, totalItemsCount: 4, parentId: null,
    },
    "col-1": {
      id: "col-1", title: "Backlog",
      children: backlogTasks,
      totalChildrenCount: backlogTasks.length, totalItemsCount: backlogTasks.length,
      parentId: "root",
      content: { id: "col-1", name: "Backlog", color: "#8b5cf6", percentage: 0 },
    },
    "col-2": {
      id: "col-2", title: "In Progress",
      children: ["task-201", "task-202"],
      totalChildrenCount: 2, totalItemsCount: 2, parentId: "root",
      content: { id: "col-2", name: "In Progress", color: "#3b82f6", percentage: 60 },
    },
    "col-3": {
      id: "col-3", title: "Review",
      children: ["task-301"],
      totalChildrenCount: 1, totalItemsCount: 1, parentId: "root",
      content: { id: "col-3", name: "Review", color: "#f59e0b", percentage: 80 },
    },
    "col-4": {
      id: "col-4", title: "Done",
      children: doneTasks,
      totalChildrenCount: doneTasks.length, totalItemsCount: doneTasks.length,
      parentId: "root",
      content: { id: "col-4", name: "Done", color: "#22c55e", percentage: 100 },
    },
  };

  for (let i = 1; i <= 20; i++) {
    data[`task-${i}`] = {
      id: `task-${i}`, title: `Backlog Task #${i}`,
      parentId: "col-1", children: [], totalChildrenCount: 0, totalItemsCount: 0, type: "card",
      content: {
        description: descriptions[i % descriptions.length],
        priority: priorities[i % priorities.length],
        assignee: assignees[i % assignees.length],
        dueDate: `2024-02-${(10 + i).toString().padStart(2, "0")}`,
        tags: tagsList[i % tagsList.length],
        comments: i % 6, attachments: i % 4,
        labels: i % 3 === 0 ? [labels[i % labels.length]] : i % 2 === 0 ? [labels[i % labels.length], labels[(i + 1) % labels.length]] : [],
        coverImage: i % 4 === 0 ? coverImages[i % coverImages.length] : null,
        members: i % 3 === 0 ? [assignees[i % assignees.length]] : [],
        dueComplete: i % 8 === 0,
        checklist: i % 5 === 0 ? { completed: 2, total: 5 } : null,
      },
    };
  }

  for (let i = 101; i <= 120; i++) {
    data[`task-${i}`] = {
      id: `task-${i}`, title: `Done Task #${i - 100}`,
      parentId: "col-4", children: [], totalChildrenCount: 0, type: "card",
      content: {
        description: descriptions[i % descriptions.length],
        priority: priorities[i % priorities.length],
        assignee: assignees[i % assignees.length],
        dueDate: `2024-01-${(i - 100 + 1).toString().padStart(2, "0")}`,
        tags: tagsList[i % tagsList.length],
        comments: (i - 100) % 6, attachments: (i - 100) % 4,
        labels: (i - 100) % 3 === 0 ? [labels[i % labels.length]] : [],
        coverImage: (i - 100) % 5 === 0 ? coverImages[i % coverImages.length] : null,
        members: (i - 100) % 4 === 0 ? [assignees[i % assignees.length]] : [],
        dueComplete: (i - 100) % 6 === 0,
        checklist: (i - 100) % 4 === 0 ? { completed: 3, total: 4 } : null,
      },
    };
  }

  data["task-201"] = {
    id: "task-201", title: "User authentication flow",
    parentId: "col-2", children: [], totalChildrenCount: 0, type: "card",
    content: {
      description: "Implement secure user authentication with JWT tokens and password reset functionality",
      priority: "high", assignee: "Emily Davis", dueDate: "2024-02-12",
      tags: ["Security", "Frontend"], comments: 5, attachments: 3,
      labels: [{ color: "#eb5a46", name: "Bug" }, { color: "#c377e0", name: "Feature" }],
      coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
      members: ["Emily Davis", "John Smith"], dueComplete: false,
      checklist: { completed: 3, total: 7 },
    },
  };

  data["task-202"] = {
    id: "task-202", title: "Mobile responsive design",
    parentId: "col-2", children: [], totalChildrenCount: 0, type: "card",
    content: {
      description: "Ensure all pages are fully responsive and work well on mobile devices",
      priority: "medium", assignee: "David Wilson", dueDate: "2024-02-18",
      tags: ["Mobile", "CSS"], comments: 2, attachments: 0,
      labels: [{ color: "#51e898", name: "Design" }],
      coverImage: null, members: ["David Wilson"], dueComplete: true, checklist: null,
    },
  };

  data["task-301"] = {
    id: "task-301", title: "Payment integration",
    parentId: "col-3", children: [], totalChildrenCount: 0, type: "card",
    content: {
      description: "Integrate Stripe payment system for subscription handling",
      priority: "high", assignee: "Lisa Thompson", dueDate: "2024-02-14",
      tags: ["Payment", "Integration"], comments: 4, attachments: 2,
      labels: [{ color: "#f2d600", name: "In Progress" }],
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      members: ["Lisa Thompson", "Mike Johnson", "Sarah Chen"], dueComplete: false,
      checklist: { completed: 1, total: 3 },
    },
  };

  return data;
})();

// ─── Jira Mock Data ──────────────────────────────────────────────────────────
const jiraIssueTypes = ["story", "bug", "task", "epic"] as const;
const jiraPriorities = ["critical", "high", "medium", "low"] as const;
const jiraAssignees = ["SC", "MJ", "AR", "ED", "DW", "LT"];
const jiraColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#f43f5e", "#0ea5e9"];
const jiraStories = [
  "Design system token architecture", "OAuth2 provider integration", "Dashboard analytics widgets",
  "Performance profiling & optimization", "API rate limiting middleware", "Real-time notifications via WebSocket",
  "Dark mode theme implementation", "Search with Elasticsearch", "Role-based access control",
  "PDF report generation", "Stripe billing integration", "CI/CD pipeline improvements",
  "Database migration strategy", "Mobile app push notifications", "A/B testing framework",
];

const generateJiraCard = (colId: string, idx: number) => {
  const type = jiraIssueTypes[idx % jiraIssueTypes.length];
  const priority = jiraPriorities[idx % jiraPriorities.length];
  const assignee = jiraAssignees[idx % jiraAssignees.length];
  const avatarColor = jiraColors[idx % jiraColors.length];
  return {
    id: `jira-${colId}-${idx}`, title: jiraStories[idx % jiraStories.length],
    parentId: colId, children: [] as string[], totalChildrenCount: 0, type: "card",
    content: { issueType: type, priority, assignee, avatarColor, storyPoints: [1,2,3,5,8,13][idx % 6], issueKey: `RKK-${100 + idx * 7 + parseInt(colId.slice(-1)) * 13}` },
  };
};

export const getJiraInitialData = () => {
  const columns = [
    { id: "jira-col-1", title: "To Do", count: 5 },
    { id: "jira-col-2", title: "In Progress", count: 4 },
    { id: "jira-col-3", title: "In Review", count: 3 },
    { id: "jira-col-4", title: "Done", count: 6 },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {
    root: {
      id: "root", title: "Root",
      children: columns.map((c) => c.id),
      totalChildrenCount: columns.length, parentId: null,
    },
  };

  columns.forEach((col, ci) => {
    const items = Array.from({ length: col.count }, (_, i) =>
      generateJiraCard(col.id, ci * 10 + i)
    );
    data[col.id] = {
      id: col.id, title: col.title,
      children: items.map((i) => i.id),
      totalChildrenCount: col.count, totalItemsCount: col.count,
      parentId: "root",
    };
    items.forEach((item) => { data[item.id] = item; });
  });

  return data;
};

// ─── Infinite Scroll Mock API ─────────────────────────────────────────────────
const IS_PAGE_SIZE = 10;
const IS_CATEGORIES = ["Feature", "Bug", "Improvement", "Docs", "Refactor"] as const;
const IS_CATEGORY_COLORS: Record<string, string> = {
  Feature: "#6366f1", Bug: "#ef4444", Improvement: "#0ea5e9",
  Docs: "#10b981", Refactor: "#f59e0b",
};
const IS_ASSIGNEES = ["SC", "MJ", "AR", "ED", "DW", "LT", "TA", "RG"];
const IS_AVATAR_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];
const IS_VERBS = ["Implement", "Fix", "Update", "Refactor", "Review", "Migrate", "Optimize", "Add"];
const IS_NOUNS = ["authentication", "dashboard", "API integration", "UI components", "database schema", "notification system", "search feature", "payment flow", "settings page", "analytics module"];

const generateISCard = (columnId: string, globalIndex: number) => {
  const category = IS_CATEGORIES[globalIndex % IS_CATEGORIES.length];
  return {
    id: `${columnId}-card-${globalIndex}`,
    title: `${IS_VERBS[globalIndex % IS_VERBS.length]} ${IS_NOUNS[globalIndex % IS_NOUNS.length]}`,
    parentId: columnId, children: [] as string[], totalChildrenCount: 0, type: "card",
    content: {
      category, categoryColor: IS_CATEGORY_COLORS[category],
      assignee: IS_ASSIGNEES[globalIndex % IS_ASSIGNEES.length],
      avatarColor: IS_AVATAR_COLORS[globalIndex % IS_AVATAR_COLORS.length],
      index: globalIndex,
    },
  };
};

export const fetchMoreCards = (columnId: string, page: number): Promise<ReturnType<typeof generateISCard>[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * IS_PAGE_SIZE;
      resolve(Array.from({ length: IS_PAGE_SIZE }, (_, i) => generateISCard(columnId, start + i + 1)));
    }, 900);
  });
};

export const getInfiniteScrollInitialData = () => {
  const columns = [
    { id: "is-col-1", title: "To Do", total: 80, color: "#6366f1" },
    { id: "is-col-2", title: "In Progress", total: 45, color: "#0ea5e9" },
    { id: "is-col-3", title: "Review", total: 28, color: "#f59e0b" },
    { id: "is-col-4", title: "Done", total: 120, color: "#10b981" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {
    root: {
      id: "root", title: "Root",
      children: columns.map((c) => c.id),
      totalChildrenCount: columns.length, parentId: null,
    },
  };

  columns.forEach((col) => {
    const initialItems = Array.from({ length: IS_PAGE_SIZE }, (_, i) => generateISCard(col.id, i + 1));
    data[col.id] = {
      id: col.id, title: col.title,
      children: initialItems.map((item) => item.id),
      totalChildrenCount: col.total, totalItemsCount: col.total,
      parentId: "root",
      content: { color: col.color, total: col.total },
    };
    initialItems.forEach((item) => { data[item.id] = item; });
  });

  return data;
};
