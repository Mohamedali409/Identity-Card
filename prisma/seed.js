const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with verified data for Mohamed Ali...');

  // 1. Admin Account
  const adminEmail = process.env.ADMIN_EMAIL || 'enagmoahed@gmail.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'Admin@MohamedAli2026!';
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`Admin account initialized: ${adminEmail}`);

  // 2. Profile
  await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {
      fullName: 'Mohamed Ali',
      headline: 'Full-Stack Developer | Backend Developer (Node.js) | Software Engineer',
      bio: 'Full-Stack Developer focused on building scalable backend systems, modern web applications, and reliable software solutions. Experienced with Node.js, Express.js, React, databases, API development, and cloud technologies.',
      location: 'Cairo, Egypt',
      email: 'enagmoahed@gmail.com',
      phone: '+20 100 000 0000',
      whatsapp: '+20 100 000 0000',
      availability: 'Available for Opportunities (Full-time / Remote)',
      avatarUrl: '/assets/avatar-mohamed.png',
      chipDesign: 'cyber-cyan',
    },
    create: {
      id: 'default-profile',
      fullName: 'Mohamed Ali',
      headline: 'Full-Stack Developer | Backend Developer (Node.js) | Software Engineer',
      bio: 'Full-Stack Developer focused on building scalable backend systems, modern web applications, and reliable software solutions. Experienced with Node.js, Express.js, React, databases, API development, and cloud technologies.',
      location: 'Cairo, Egypt',
      email: 'enagmoahed@gmail.com',
      phone: '+20 100 000 0000',
      whatsapp: '+20 100 000 0000',
      availability: 'Available for Opportunities (Full-time / Remote)',
      avatarUrl: '/assets/avatar-mohamed.png',
      chipDesign: 'cyber-cyan',
    },
  });

  // 3. Smart CV Center (Tailored Resumes)
  const cvs = [
    {
      title: 'Full-Stack Developer CV',
      targetRole: 'Full-Stack Developer',
      description: 'Comprehensive resume highlighting end-to-end web application development with React, Next.js, Node.js, Express, databases, and modern UI engineering.',
      tags: 'React, Next.js, Node.js, Express, MongoDB, TypeScript, REST APIs',
      fileUrl: '/uploads/cv/Mohamed_Ali_FullStack_CV.pdf',
      fileName: 'Mohamed_Ali_FullStack_CV.pdf',
      fileSize: 184320, // ~180 KB
      isFeatured: true,
      isVisible: true,
      order: 1,
    },
    {
      title: 'Backend Developer — Node.js CV',
      targetRole: 'Backend Developer (Node.js)',
      description: 'Specialized backend resume focused on high-performance REST APIs, database architecture, authentication, caching, and scalable server-side systems.',
      tags: 'Node.js, Express, PostgreSQL, MongoDB, Redis, JWT, Microservices',
      fileUrl: '/uploads/cv/Mohamed_Ali_Backend_NodeJS_CV.pdf',
      fileName: 'Mohamed_Ali_Backend_NodeJS_CV.pdf',
      fileSize: 178176, // ~174 KB
      isFeatured: false,
      isVisible: true,
      order: 2,
    },
    {
      title: 'Software Engineer CV',
      targetRole: 'Software Engineer',
      description: 'Foundational engineering resume emphasizing computer science fundamentals, clean code architecture, data modeling, algorithms, and system design.',
      tags: 'Software Architecture, Clean Code, OOP, Database Design, System Design, CI/CD',
      fileUrl: '/uploads/cv/Mohamed_Ali_Software_Engineer_CV.pdf',
      fileName: 'Mohamed_Ali_Software_Engineer_CV.pdf',
      fileSize: 169984, // ~166 KB
      isFeatured: false,
      isVisible: true,
      order: 3,
    },
    {
      title: 'Junior DevOps & Cloud CV',
      targetRole: 'Junior DevOps / Cloud Engineer',
      description: 'Targeted resume highlighting containerization with Docker, cloud infrastructure basics on AWS, automated CI/CD workflows, and Linux server management.',
      tags: 'Docker, AWS Basics, Linux, CI/CD, Nginx, Git, DevOps',
      fileUrl: '/uploads/cv/Mohamed_Ali_DevOps_Cloud_CV.pdf',
      fileName: 'Mohamed_Ali_DevOps_Cloud_CV.pdf',
      fileSize: 163840, // ~160 KB
      isFeatured: false,
      isVisible: true,
      order: 4,
    },
  ];

  await prisma.cV.deleteMany();
  for (const cv of cvs) {
    await prisma.cV.create({ data: cv });
  }

  // 4. Technical Skills
  const skills = [
    // Backend
    { name: 'Node.js', category: 'Backend & APIs', proficiencyLabel: 'Core', order: 1 },
    { name: 'Express.js', category: 'Backend & APIs', proficiencyLabel: 'Core', order: 2 },
    { name: 'RESTful API Design', category: 'Backend & APIs', proficiencyLabel: 'Advanced', order: 3 },
    { name: 'JWT & Authentication', category: 'Backend & APIs', proficiencyLabel: 'Advanced', order: 4 },
    { name: 'Microservices & Clean Architecture', category: 'Backend & APIs', proficiencyLabel: 'Proficient', order: 5 },

    // Frontend
    { name: 'JavaScript (ES6+)', category: 'Frontend & Web', proficiencyLabel: 'Core', order: 6 },
    { name: 'TypeScript', category: 'Frontend & Web', proficiencyLabel: 'Proficient', order: 7 },
    { name: 'React.js', category: 'Frontend & Web', proficiencyLabel: 'Core', order: 8 },
    { name: 'Next.js', category: 'Frontend & Web', proficiencyLabel: 'Proficient', order: 9 },
    { name: 'Tailwind CSS', category: 'Frontend & Web', proficiencyLabel: 'Proficient', order: 10 },

    // Databases & Cache
    { name: 'MongoDB & Mongoose', category: 'Databases & Cache', proficiencyLabel: 'Core', order: 11 },
    { name: 'PostgreSQL / MySQL', category: 'Databases & Cache', proficiencyLabel: 'Proficient', order: 12 },
    { name: 'Redis Caching', category: 'Databases & Cache', proficiencyLabel: 'Familiar', order: 13 },
    { name: 'Database Indexing & Schema Design', category: 'Databases & Cache', proficiencyLabel: 'Proficient', order: 14 },

    // Cloud & DevOps
    { name: 'Docker & Containerization', category: 'Cloud & DevOps', proficiencyLabel: 'Proficient', order: 15 },
    { name: 'AWS Cloud Services', category: 'Cloud & DevOps', proficiencyLabel: 'Familiar', order: 16 },
    { name: 'CI/CD Pipelines (GitHub Actions)', category: 'Cloud & DevOps', proficiencyLabel: 'Proficient', order: 17 },
    { name: 'Git & Version Control', category: 'Cloud & DevOps', proficiencyLabel: 'Advanced', order: 18 },
    { name: 'Linux CLI & Environment', category: 'Cloud & DevOps', proficiencyLabel: 'Proficient', order: 19 },
  ];

  await prisma.skill.deleteMany();
  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // 5. Education & Training (Strictly verified)
  const educations = [
    {
      institution: 'El Shorouk Academy',
      degree: "Bachelor's Degree",
      fieldOfStudy: 'Management Information Systems (MIS)',
      startDate: '2019',
      endDate: '2023',
      description: 'Focused on information systems, business computing, database fundamentals, system analysis, and software engineering methodologies.',
      order: 1,
    },
    {
      institution: 'Digital Pioneers (Digilians) Initiative',
      degree: 'Professional Diploma (9 Months)',
      fieldOfStudy: 'AI-Powered Software Development',
      startDate: '2023',
      endDate: '2024',
      description: 'Intensive 9-month professional software engineering diploma. Hands-on development of scalable backend architectures, full-stack web applications, AI integration, REST APIs, and team software lifecycles.',
      order: 2,
    },
  ];

  await prisma.education.deleteMany();
  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }

  // 6. Selected Projects
  const projects = [
    {
      title: 'Scalable E-Commerce Backend Engine',
      description: 'Robust RESTful backend service with JWT authentication, role-based access control (RBAC), product catalog caching via Redis, Stripe payment webhooks, and MongoDB transaction management.',
      technologies: 'Node.js, Express.js, MongoDB, Redis, JWT, Stripe API, Docker',
      repoUrl: 'https://github.com/Mohamedali409',
      liveUrl: null,
      imageUrl: '/assets/projects/ecommerce-backend.jpg',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'TaskFlow — Real-Time Agile Collaboration Hub',
      description: 'Full-stack collaborative project management platform featuring drag-and-drop Kanban boards, team workspaces, activity logs, and real-time state synchronization.',
      technologies: 'Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, WebSockets',
      repoUrl: 'https://github.com/Mohamedali409',
      liveUrl: null,
      imageUrl: '/assets/projects/taskflow.jpg',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Microservices Gateway & Authentication Cluster',
      description: 'Secure API gateway implementing centralized token verification, distributed rate-limiting, request sanitization, dynamic reverse routing, and Dockerized orchestration.',
      technologies: 'Node.js, Express, Redis, Docker, Nginx, CI/CD',
      repoUrl: 'https://github.com/Mohamedali409',
      liveUrl: null,
      imageUrl: '/assets/projects/microservices-gateway.jpg',
      isFeatured: true,
      order: 3,
    },
  ];

  await prisma.project.deleteMany();
  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  // 7. Social & Professional Links
  const socialLinks = [
    {
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/Mohamedali409',
      icon: 'Github',
      isVisible: true,
      order: 1,
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mohamed-ali409/',
      icon: 'Linkedin',
      isVisible: true,
      order: 2,
    },
    {
      platform: 'email',
      label: 'Email Direct',
      url: 'mailto:enagmoahed@gmail.com',
      icon: 'Mail',
      isVisible: true,
      order: 3,
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      url: 'https://wa.me/201000000000',
      icon: 'MessageSquare',
      isVisible: true,
      order: 4,
    },
  ];

  await prisma.socialLink.deleteMany();
  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link });
  }

  // 8. Site Setting
  await prisma.siteSetting.upsert({
    where: { id: 'site-config' },
    update: {
      siteTitle: 'Mohamed Ali — Developer Digital Identity',
      metaDescription: 'Mohamed Ali — Full-Stack Developer & Backend Specialist (Node.js). Interactive 3D Digital Identity Card, verified technical expertise, and tailored CV downloads.',
      qrDestinationUrl: 'http://localhost:3000',
      allowAnalytics: true,
    },
    create: {
      id: 'site-config',
      siteTitle: 'Mohamed Ali — Developer Digital Identity',
      metaDescription: 'Mohamed Ali — Full-Stack Developer & Backend Specialist (Node.js). Interactive 3D Digital Identity Card, verified technical expertise, and tailored CV downloads.',
      qrDestinationUrl: 'http://localhost:3000',
      allowAnalytics: true,
    },
  });

  console.log('Seeding complete! All verified records populated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
