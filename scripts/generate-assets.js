const fs = require('fs');
const path = require('path');

// Ensure directories exist
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'cv');
const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const projectsDir = path.join(assetsDir, 'projects');

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(projectsDir, { recursive: true });

// Function to generate a valid PDF with text
function createSimplePDF(title, role, description, skills, outputPath) {
  const content = `
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${500 + title.length + role.length + description.length + skills.length} >>
stream
BT
/F1 22 Tf
50 720 Td
(MOHAMED ALI) Tj
/F1 14 Tf
0 -26 Td
(${role.toUpperCase()}) Tj
/F1 10 Tf
0 -20 Td
(Location: Cairo, Egypt  |  Email: enagmoahed@gmail.com  |  GitHub: Mohamedali409) Tj
0 -15 Td
(LinkedIn: in/mohamed-ali409  |  Portfolio / Digital Card: 2026 Edition) Tj
/F1 13 Tf
0 -30 Td
(PROFESSIONAL PROFILE) Tj
/F1 10 Tf
0 -18 Td
(${description}) Tj
/F1 13 Tf
0 -30 Td
(TECHNICAL EXPERTISE) Tj
/F1 10 Tf
0 -18 Td
(${skills}) Tj
/F1 13 Tf
0 -30 Td
(EDUCATION & DIPLOMA) Tj
/F1 10 Tf
0 -18 Td
(- Bachelor in Management Information Systems - El Shorouk Academy, Cairo) Tj
0 -15 Td
(- AI-Powered Software Development Diploma (9 Months) - Digital Pioneers Digilians) Tj
/F1 13 Tf
0 -30 Td
(CORE ATTRIBUTES) Tj
/F1 10 Tf
0 -18 Td
(- Scalable Architecture, Clean REST APIs, Database Optimization, Agile Team Player) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000059 00000 n 
0000000116 00000 n 
0000000236 00000 n 
0000000850 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
940
%%EOF
`;
  fs.writeFileSync(outputPath, content.trim());
}

// 1. Generate the 4 PDFs
createSimplePDF(
  'Full-Stack Developer CV',
  'Full-Stack Developer',
  'Passionate Full-Stack Developer experienced in React, Next.js, Node.js, and Express.',
  'JavaScript, TypeScript, React.js, Next.js, Node.js, Express, MongoDB, PostgreSQL, REST APIs',
  path.join(uploadDir, 'Mohamed_Ali_FullStack_CV.pdf')
);

createSimplePDF(
  'Backend Developer — Node.js CV',
  'Backend Developer (Node.js)',
  'Specialized in building high-concurrency Node.js REST APIs, database schemas, and microservices.',
  'Node.js, Express.js, PostgreSQL, MySQL, MongoDB, Redis, JWT Authentication, System Design',
  path.join(uploadDir, 'Mohamed_Ali_Backend_NodeJS_CV.pdf')
);

createSimplePDF(
  'Software Engineer CV',
  'Software Engineer',
  'Software Engineer with a solid foundation in computer systems, algorithms, and clean architecture.',
  'Software Architecture, OOP, Data Structures, REST APIs, Database Optimization, CI/CD',
  path.join(uploadDir, 'Mohamed_Ali_Software_Engineer_CV.pdf')
);

createSimplePDF(
  'Junior DevOps & Cloud CV',
  'Junior DevOps / Cloud Engineer',
  'Cloud and DevOps enthusiast focused on Docker containerization, CI/CD, and Linux environments.',
  'Docker, AWS Core Services, Linux CLI, Nginx, CI/CD GitHub Actions, Git, Shell Scripting',
  path.join(uploadDir, 'Mohamed_Ali_DevOps_Cloud_CV.pdf')
);

console.log('Sample verified PDF CVs generated successfully in /public/uploads/cv/');
