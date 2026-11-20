import { useState, useEffect } from 'react';
import {
  apiPostConversation,
  apiGetConversations,
  apiGetConversation,
  apiGetConversationMessages,
  apiPostConversationMessage,
  apiPostConversationRead,
  apiPostMessageRead,
  apiGetConversationUnreadCount,
} from '@/lib/api/client';
import { getSession, loginHref } from '@/lib/api/session';
import { snackbar, toast } from '@/lib/notify';

/** Conversation type constants matching the backend. */
export const CONVERSATION_TYPE_PROPERTY = 'PROPERTY';
export const CONVERSATION_TYPE_DIRECT = 'DIRECT';

/** Result of creating/retrieving a conversation. */
export interface ConversationOut {
  id: number;
  conversation_type: string;
  property_listing_id: number | null;
  participant_a_user_id: number;
  participant_b_user_id: number;
  created_at: string | null;
  updated_at: string | null;
}

/** Summary information for a conversation list item. */
export interface ConversationSummary {
  id: number;
  conversation_type: string;
  other_user_id: number;
  other_user_display_name: string | null;
  property_listing_id: number | null;
  property_info: { listing_id: number; title: string; property_type: string; price_display: string } | null;
  latest_message: { id: number; body: string; created_at: string } | null;
  latest_message_at: string | null;
  unread_count: number;
}

/** Message summary for conversation history. */
export interface MessageSummary {
  id: number;
  sender_user_id: number;
  body: string;
  message_type: string | null;
  created_at: string | null;
}

/** Paginated conversation messages. */
export interface MessagesResponse {
  items: MessageSummary[];
  page: number;
  page_size: number;
  total: number;
  has_more: boolean;
}

/** Hook result for conversation state. */
export interface UseConversationResult {
  conversations: ConversationSummary[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: number, page?: number, pageSize?: number) => Promise<MessagesResponse>;
  sendMessage: (conversationId: number, body: string, messageType?: string) => Promise<MessageSummary | null>;
  markConversationRead: (conversationId: number) => Promise<void>;
  markMessageRead: (conversationId: number, messageId: number) => Promise<void>;
}

/** Start a new conversation or retrieve existing one.
 *  conversation_type: 'PROPERTY' or 'DIRECT'
 *  other_user_id: The other participant's user ID
 *  property_listing_id: Required for PROPERTY type; NULL for DIRECT
 */
export async function startConversation(
  other_user_id: number,
  conversation_type: string,
  property_listing_id?: number,
): Promise<ConversationOut> {
  const result = await apiPostConversation({
    other_user_id,
    conversation_type,
    property_listing_id,
  });
  return {
    id: (result as ConversationOut).id,
    conversation_type: (result as ConversationOut).conversation_type,
    property_listing_id: (result as ConversationOut).property_listing_id,
    participant_a_user_id: (result as ConversationOut).participant_a_user_id,
    participant_b_user_id: (result as ConversationOut).participant_b_user_id,
    created_at: (result as ConversationOut).created_at,
    updated_at: (result as ConversationOut).updated_at,
  };
}

/** Get conversations for the authenticated user. */
export async function loadConversations(userId: number): Promise<ConversationSummary[]> {
  const result = await apiGetConversations(1, 20);
  return (result as MessagesResponse | any)?.items || [];
}

/** Get paginated messages for a conversation. */
export async function loadMessages(
  conversationId: number,
  page = 1,
  pageSize = 50,
): Promise<MessagesResponse> {
  return await apiGetConversationMessages(conversationId, page, pageSize);
}

/** Send a message to a conversation. */
export async function sendNewMessage(
  conversationId: number,
  body: string,
  messageType?: string,
): Promise<MessageSummary | null> {
  try {
    const result = await apiPostConversationMessage({
      conversation_id: conversationId,
      body,
      message_type: messageType,
    }) as { id: number; sender_user_id: number; body: string; message_type: string | null; created_at: string };
    return {
      id: result.id,
      sender_user_id: result.sender_user_id,
      body: result.body,
      message_type: result.message_type,
      created_at: result.created_at,
    };
  } catch (e) {
    toast.error('Failed to send message. Please try again.');
    return null;
  }
}

/** Mark a conversation as read for the authenticated user. */
export async function markConvRead(conversationId: number): Promise<void> {
  await apiPostConversationRead(conversationId);
}

/** Mark a specific message as read. */
export async function markMsgRead(conversationId: number, messageId: number): Promise<void> {
  await apiPostMessageRead(conversationId, messageId);
}

/** Get unread message count for the authenticated user. */
export async function getUnreadCount(): Promise<number> {
  const result = await apiGetConversationUnreadCount();
  return (result as any)?.unread_count || 0;
}