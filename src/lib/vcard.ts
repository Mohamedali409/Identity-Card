export interface VCardProfile {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export function generateVCard(profile: VCardProfile): string {
  const parts = profile.fullName.trim().split(" ");
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  const firstName = parts[0] || "Mohamed";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${profile.fullName}`,
    `TITLE:${profile.headline}`,
    `NOTE:${profile.bio.replace(/\n/g, "\\n")}`,
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
  ];

  if (profile.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${profile.phone}`);
  }
  if (profile.whatsapp) {
    lines.push(`TEL;TYPE=WORK,MSG:${profile.whatsapp}`);
  }
  if (profile.location) {
    lines.push(`ADR;TYPE=HOME:;;;${profile.location};;;`);
  }
  if (profile.websiteUrl) {
    lines.push(`URL;TYPE=WORK:${profile.websiteUrl}`);
  }
  if (profile.githubUrl) {
    lines.push(`X-SOCIALPROFILE;TYPE=github:${profile.githubUrl}`);
  }
  if (profile.linkedinUrl) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedinUrl}`);
  }

  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}
