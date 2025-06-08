export const loginFormControls = [
  {
    name: "email",
    label: " Email",
    placeholder: "Enter Your Email",
    componenttype: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Your Password",
    componenttype: "password",
    type: "password",
  },
];

export const formatEndDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-GB"); // outputs "dd/mm/yyyy"
};

export const allPossibleSkills = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "SQL",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "Frontend",
  "Backend",
  "DevOps",
  "QA",
  "Manual Testing",
  "Automation",
  "JIRA",
  "Data Visualization",
  "Figma",
  "UI/UX",
  "Cloud Architecture",
  "Microservices",
  "Django",
  "Express",
  "Go",
  "React Native",
  "Performance Tuning",
  "Mobile Development",
];
