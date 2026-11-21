export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string | null;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  birthDate: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  city: string;
  bio?: string | null;
  profession?: string | null;
  education?: string | null;
  lookingFor?: string | null;
  distanceKm?: number | null;
  isVerified?: boolean;
  isPremium?: boolean;
  photos: ProfilePhoto[];
  interests: string[];
}

export interface ProfilePhoto {
  id: string;
  url: string;
  order: number;
  isMain: boolean;
}

export interface MatchItem {
  matchId: string;
  conversationId: string;
  matchedAt: string;
  otherUser: {
    id: string;
    displayName: string;
    age: number;
    city: string;
    photoUrl: string | null;
    isVerified: boolean;
    isPremium: boolean;
  };
  lastMessage?: {
    content: string | null;
    createdAt: string;
    isRead: boolean;
    senderId: string;
  } | null;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string | null;
  content: string | null;
  isRead: boolean;
  createdAt: string;
  attachments: Array<{
    id: string;
    fileUrl: string;
    fileType: string;
    duration?: number | null;
  }>;
}

export interface VerificationInstructions {
  selfie1Instruction: string;
  selfie2Instruction: string;
  voicePhrase: string;
  voiceDurationSeconds: number;
}
