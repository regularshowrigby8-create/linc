import type { NotificationSettings, User } from '@/data/types';

/**
 * Deterministic mock users. Fake names and locations only.
 * No real phone numbers, identity numbers, bank details or documents.
 */

export const mockCurrentUser: User = {
  id: 'user-you',
  name: 'Naledi Khumalo',
  email: 'naledi@example.co.za',
  accountType: 'personal',
  registeredWorkspaces: ['customer', 'collaboration'],
  verificationByWorkspace: {
    customer: 'verified',
    qualification: 'not_started',
    collaboration: 'pending',
    supply: 'not_started',
  },
  contactVisibility: 'accepted_connections',
  location: 'Cape Town',
  avatarInitials: 'NK',
  lastUsedWorkspace: 'customer',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-thandi',
    name: 'Thandi Mokoena',
    email: 'thandi@example.co.za',
    accountType: 'business',
    businessName: 'Mokoena Home Services',
    registeredWorkspaces: ['customer', 'supply'],
    verificationByWorkspace: {
      customer: 'verified',
      qualification: 'not_started',
      collaboration: 'not_started',
      supply: 'verified',
    },
    contactVisibility: 'public',
    location: 'Gqeberha',
    avatarInitials: 'TM',
  },
  {
    id: 'user-rian',
    name: 'Riaan Botha',
    email: 'riaan@example.co.za',
    accountType: 'business',
    businessName: 'Botha Design Studio',
    registeredWorkspaces: ['customer', 'qualification', 'collaboration'],
    verificationByWorkspace: {
      customer: 'verified',
      qualification: 'verified',
      collaboration: 'verified',
      supply: 'not_started',
    },
    contactVisibility: 'public',
    location: 'Stellenbosch',
    avatarInitials: 'RB',
  },
  {
    id: 'user-lerato',
    name: 'Lerato Nkosi',
    email: 'lerato@example.co.za',
    accountType: 'personal',
    registeredWorkspaces: ['qualification'],
    verificationByWorkspace: {
      customer: 'not_started',
      qualification: 'pending',
      collaboration: 'not_started',
      supply: 'not_started',
    },
    contactVisibility: 'accepted_connections',
    location: 'Johannesburg',
    avatarInitials: 'LN',
  },
  {
    id: 'user-ayanda',
    name: 'Ayanda Dlamini',
    email: 'ayanda@example.co.za',
    accountType: 'business',
    businessName: 'Dlamini Catering',
    registeredWorkspaces: ['customer', 'collaboration', 'supply'],
    verificationByWorkspace: {
      customer: 'verified',
      qualification: 'not_started',
      collaboration: 'verified',
      supply: 'pending',
    },
    contactVisibility: 'public',
    location: 'Durban',
    avatarInitials: 'AD',
  },
  {
    id: 'user-pieter',
    name: 'Pieter van Wyk',
    email: 'pieter@example.co.za',
    accountType: 'business',
    businessName: 'VW Bulk Supply',
    registeredWorkspaces: ['supply'],
    verificationByWorkspace: {
      customer: 'not_started',
      qualification: 'not_started',
      collaboration: 'not_started',
      supply: 'verified',
    },
    contactVisibility: 'public',
    location: 'Bloemfontein',
    avatarInitials: 'PV',
  },
];

export const mockNotificationSettings: NotificationSettings = {
  channels: {
    in_app: true,
    email: true,
    sms: false,
    whatsapp: false,
    push: false,
  },
  lockedChannels: ['in_app'],
};
