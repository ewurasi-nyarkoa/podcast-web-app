export interface TeamMember {
  id: number;
  name: string;
  role: string;
  profile_image: string;
  bio: string;
  social_media_links: SocialMediaLink[];
  created_at?: Date;
  updated_at?: Date;
}

export interface SocialMediaLink {
  id: number;
  platform: string;
  url: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface CreateTeamMemberRequest {
  name: string;
  role: string;
  profile_image: string;
  bio: string;
  social_media_links: { platform: string; url: string; }[];
}